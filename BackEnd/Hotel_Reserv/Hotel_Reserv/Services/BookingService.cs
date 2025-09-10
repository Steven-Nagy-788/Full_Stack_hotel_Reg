using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Microsoft.EntityFrameworkCore;
namespace Hotel_Reserv.Services;

public class BookingService(ApplicationDbContext db) : IBookingService
{
    public async ValueTask<IResult> GetBookings() =>
        Results.Ok(await db.Bookings.ToListAsync());
    public async ValueTask<IResult> GetBooking(int id) =>
        Results.Ok(await db.Bookings.Where(b => b.Id == id).FirstOrDefaultAsync());
    public async ValueTask<IResult> GetBookingsByUserId(int userId) =>
        Results.Ok(await db.Bookings.Where(b => b.User_Id == userId).ToListAsync());

    public async Task<bool> ValidateBookingDate(int hotelId, int roomId, DateOnly wantedDateToCheckIn, DateOnly wantedDateToCheckOut)
    {
        // Get all dates that would be occupied by this booking (excluding checkout date)
        var bookingDates = GetDateRange(
            wantedDateToCheckIn.ToDateTime(TimeOnly.MinValue), 
            wantedDateToCheckOut.ToDateTime(TimeOnly.MinValue)
        );

        // Check room inventory availability for each date
        foreach (var date in bookingDates)
        {
            var inventory = await db.RoomInventories
                .FirstOrDefaultAsync(ri => ri.Date.Date == date.Date && ri.RoomType_ID == roomId);

            if (inventory == null)
            {
                // No inventory record exists for this date - we need to check if room type exists
                var roomTypeExists = await db.RoomTypes
                    .AnyAsync(rt => rt.Id == roomId && rt.HotelId == hotelId);
                
                if (!roomTypeExists)
                    return false; // Room type doesn't exist for this hotel
                
                // If no inventory exists, assume rooms are available (will be created when booking)
                continue;
            }

            // Check if there are available rooms for this date
            if (inventory.AvailableRooms <= 0)
            {
                return false; // No rooms available for this date
            }
        }

        // Return true if all dates have available rooms
        return true;
    }

    public async Task<bool> ValidateBookingDateForUpdate(Booking existingBooking, DateOnly newCheckIn, DateOnly newCheckOut)
    {
        // Get dates for both old and new booking periods
        var oldBookingDates = GetDateRange(existingBooking.Check_In, existingBooking.Check_Out);
        var newBookingDates = GetDateRange(
            newCheckIn.ToDateTime(TimeOnly.MinValue), 
            newCheckOut.ToDateTime(TimeOnly.MinValue)
        );

        // Check availability for each new date
        foreach (var date in newBookingDates)
        {
            var inventory = await db.RoomInventories
                .FirstOrDefaultAsync(ri => ri.Date.Date == date.Date && ri.RoomType_ID == existingBooking.RoomType_Id);

            if (inventory == null)
            {
                // No inventory record exists for this date - assume available
                continue;
            }

            // Calculate available rooms considering if this date was previously occupied by this booking
            var availableRooms = inventory.AvailableRooms;
            
            // If the old booking occupied this date and we're still using the same date, 
            // we have one additional room available (the one being freed up)
            if (oldBookingDates.Any(oldDate => oldDate.Date == date.Date) && 
                (existingBooking.Status == BookingStatus.PENDING || existingBooking.Status == BookingStatus.CONFIRMED))
            {
                availableRooms += 1; // Add back the room that will be freed from the old booking
            }

            // Check if there are available rooms for this date
            if (availableRooms <= 0)
            {
                return false; // No rooms available for this date
            }
        }

        return true;
    }
    public async ValueTask<IResult> CreateBooking(BookingDTO bookingDto, int userId)
    {
        var isAvailable = await ValidateBookingDate(bookingDto.Hotel_Id, bookingDto.RoomType_Id, bookingDto.Check_In, bookingDto.Check_Out);
        if (!isAvailable)
            return Results.Conflict("Room is not available for the selected dates.");
        var roomType = await db.RoomTypes
            .Where(rt => rt.Id == bookingDto.RoomType_Id && rt.HotelId == bookingDto.Hotel_Id)
            .FirstOrDefaultAsync();
        if (roomType is null)
            return Results.BadRequest();
        
        var booking = new Booking
        {
            User_Id = userId,
            Hotel_Id = bookingDto.Hotel_Id,
            RoomType_Id = bookingDto.RoomType_Id,
            Check_In = bookingDto.Check_In.ToDateTime(TimeOnly.MinValue),
            Check_Out = bookingDto.Check_Out.ToDateTime(TimeOnly.MinValue),
            Status = BookingStatus.PENDING
        };
        booking.Total_Price = booking.Nights * roomType.Base_Price;
        
        await db.Bookings.AddAsync(booking);
        
        // Update room inventories for PENDING booking
        await UpdateRoomInventoryForBooking(booking, true);
        
        await db.SaveChangesAsync();
        return Results.Created($"/api/Bookings/{booking.Id}", booking);
    }

    public async ValueTask<IResult> UpdateBooking(int id, BookingUpdateDTO bookingUpdateDto)
    {
        // Find existing booking
        var existingBooking = await db.Bookings.FindAsync(id);
        if (existingBooking == null)
            return Results.NotFound($"Booking with ID {id} not found.");

        // Validate basic requirements first
        if (bookingUpdateDto.Check_In >= bookingUpdateDto.Check_Out)
            return Results.BadRequest("Check-out date must be after check-in date.");

        if (bookingUpdateDto.Check_In < DateOnly.FromDateTime(DateTime.Today) && bookingUpdateDto.Status == BookingStatus.PENDING)
            return Results.BadRequest("Check-in date cannot be in the past for pending bookings.");

        // Get room type for price calculation
        var roomType = await db.RoomTypes.FindAsync(existingBooking.RoomType_Id);
        if (roomType == null)
            return Results.BadRequest("Associated room type not found.");

        // For updates, we need to check availability while considering the current booking will be freed up
        var isAvailable = await ValidateBookingDateForUpdate(existingBooking, bookingUpdateDto.Check_In, bookingUpdateDto.Check_Out);
        if (!isAvailable)
            return Results.Conflict("Room is not available for the selected dates.");

        // Store old dates before updating
        var oldCheckIn = existingBooking.Check_In;
        var oldCheckOut = existingBooking.Check_Out;
        var oldStatus = existingBooking.Status;

        // Update properties
        existingBooking.Check_In = bookingUpdateDto.Check_In.ToDateTime(TimeOnly.MinValue);
        existingBooking.Check_Out = bookingUpdateDto.Check_Out.ToDateTime(TimeOnly.MinValue);
        existingBooking.Status = bookingUpdateDto.Status;

        // Recalculate total price
        existingBooking.Total_Price = existingBooking.Nights * roomType.Base_Price;

        // Handle inventory updates if dates changed and booking was/is occupying inventory
        if ((oldCheckIn != existingBooking.Check_In || oldCheckOut != existingBooking.Check_Out) && 
            (oldStatus == BookingStatus.PENDING || oldStatus == BookingStatus.CONFIRMED))
        {
            // Create a temporary booking object with old dates to free up old inventory
            var tempOldBooking = new Booking 
            { 
                Check_In = oldCheckIn, 
                Check_Out = oldCheckOut, 
                RoomType_Id = existingBooking.RoomType_Id,
                Status = oldStatus
            };
            await UpdateRoomInventoryForBooking(tempOldBooking, false); // Free old dates

            // Reserve new dates if booking is still active
            if (existingBooking.Status == BookingStatus.PENDING || existingBooking.Status == BookingStatus.CONFIRMED)
            {
                await UpdateRoomInventoryForBooking(existingBooking, true); // Reserve new dates
            }
        }

        await db.SaveChangesAsync();
        return Results.Ok(existingBooking);
    }

    public async ValueTask<IResult> UpdateBookingStatus(int id, BookingStatusUpdateDTO statusDto)
    {
        var existingBooking = await db.Bookings.FirstOrDefaultAsync(b => b.Id == id);
        if (existingBooking is null)
            return Results.NotFound();

        var oldStatus = existingBooking.Status;
        var newStatus = statusDto.Status;

        // Update booking status
        existingBooking.Status = newStatus;

        // Handle inventory updates based on status changes
        await HandleInventoryStatusChange(existingBooking, oldStatus, newStatus);

        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    public async ValueTask<IResult> DeleteBooking(int id)
    {
        var existingBooking = await db.Bookings.FirstOrDefaultAsync(b => b.Id == id);
        if (existingBooking is not null)
        {
            // Free up inventory before deleting
            if (existingBooking.Status == BookingStatus.PENDING || existingBooking.Status == BookingStatus.CONFIRMED)
            {
                await UpdateRoomInventoryForBooking(existingBooking, false);
            }
            
            db.Bookings.Remove(existingBooking);
            await db.SaveChangesAsync();
        }
        return Results.NoContent();
    }

    /// <summary>
    /// Updates room inventory when booking status changes
    /// </summary>
    private async Task HandleInventoryStatusChange(Booking booking, BookingStatus oldStatus, BookingStatus newStatus)
    {
        // Define which statuses occupy inventory
        var occupiesInventory = new[] { BookingStatus.PENDING, BookingStatus.CONFIRMED };
        
        bool wasOccupying = occupiesInventory.Contains(oldStatus);
        bool willOccupy = occupiesInventory.Contains(newStatus);

        if (wasOccupying && !willOccupy)
        {
            // Free up inventory (PENDING/CONFIRMED -> CANCELLED/REJECTED/COMPLETED)
            await UpdateRoomInventoryForBooking(booking, false);
        }
        else if (!wasOccupying && willOccupy)
        {
            // Occupy inventory (CANCELLED/REJECTED -> PENDING/CONFIRMED)
            await UpdateRoomInventoryForBooking(booking, true);
        }
        // If both old and new status occupy inventory, no change needed
    }

    /// <summary>
    /// Updates room inventory for a booking across all dates
    /// </summary>
    private async Task UpdateRoomInventoryForBooking(Booking booking, bool isReserving)
    {
        var bookingDates = GetDateRange(booking.Check_In, booking.Check_Out);
        
        foreach (var date in bookingDates)
        {
            var inventory = await db.RoomInventories
                .FirstOrDefaultAsync(ri => ri.Date.Date == date.Date && ri.RoomType_ID == booking.RoomType_Id);

            if (inventory != null)
            {
                if (isReserving)
                {
                    inventory.Sold_Rooms += 1; // Reserve one room
                }
                else
                {
                    inventory.Sold_Rooms = Math.Max(0, inventory.Sold_Rooms - 1); // Free one room (don't go below 0)
                }
            }
            else if (isReserving)
            {
                // Try to get total rooms from existing inventory records for this room type
                var existingInventory = await db.RoomInventories
                    .Where(ri => ri.RoomType_ID == booking.RoomType_Id)
                    .FirstOrDefaultAsync();
                
                var totalRooms = existingInventory?.Total_Rooms ?? 2; // Default to 2 if no existing inventory
                
                // Create new inventory record if it doesn't exist
                var newInventory = new RoomInventory
                {
                    Date = date,
                    Total_Rooms = totalRooms,
                    Sold_Rooms = 1,
                    RoomType_ID = booking.RoomType_Id
                };
                await db.RoomInventories.AddAsync(newInventory);
            }
        }
    }

    /// <summary>
    /// Gets all dates between check-in and check-out (excluding check-out date)
    /// </summary>
    private static List<DateTime> GetDateRange(DateTime checkIn, DateTime checkOut)
    {
        var dates = new List<DateTime>();
        for (var date = checkIn.Date; date < checkOut.Date; date = date.AddDays(1))
        {
            dates.Add(date);
        }
        return dates;
    }
}