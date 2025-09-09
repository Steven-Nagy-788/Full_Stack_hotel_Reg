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
        var alreadyMadeBookings = await db.Bookings.Where(b => b.Hotel_Id == hotelId && b.RoomType_Id == roomId)
            .AnyAsync(b => 
                DateOnly.FromDateTime(b.Check_In) < wantedDateToCheckOut && 
                DateOnly.FromDateTime(b.Check_Out) > wantedDateToCheckIn
            );
        return alreadyMadeBookings;
    }
    public async ValueTask<IResult> CreateBooking(BookingDTO bookingDto)
    {
        // if (bookingDto.Check_In >= bookingDto.Check_Out)
        //     return Results.BadRequest("Check-out date must be after check-in date.");
        // if (bookingDto.Check_In < DateOnly.FromDateTime(DateTime.Today))
        //     return Results.BadRequest("Check-in date cannot be in the past.");
        // var user = await db.Users.Where(b => b.Id == bookingDto.User_Id).FirstOrDefaultAsync();
        // if (user is null)
        //     return Results.BadRequest("User not found.");
        // var hotel = await db.Hotels.Where(b => b.Id == bookingDto.Hotel_Id).FirstOrDefaultAsync();
        // if (hotel is null)
        //     return Results.BadRequest("Hotel not found.");
        var unavailable = await ValidateBookingDate(bookingDto.Hotel_Id, bookingDto.RoomType_Id, bookingDto.Check_In, bookingDto.Check_Out);
        if (unavailable)
            return Results.Conflict();
        var roomType = await db.RoomTypes
            .Where(rt => rt.Id == bookingDto.RoomType_Id && rt.HotelId == bookingDto.Hotel_Id)
            .FirstOrDefaultAsync();
        if (roomType is null)
            return Results.BadRequest();
        var booking = new Booking
        {
            User_Id = bookingDto.User_Id,
            Hotel_Id = bookingDto.Hotel_Id,
            RoomType_Id = bookingDto.RoomType_Id,
            Check_In = bookingDto.Check_In.ToDateTime(TimeOnly.MinValue),
            Check_Out = bookingDto.Check_Out.ToDateTime(TimeOnly.MinValue),
            Status = BookingStatus.PENDING,
            RoomsCount = bookingDto.RoomsCount
        };
        booking.Total_Price = booking.Nights * roomType.Base_Price * bookingDto.RoomsCount;
        await db.Bookings.AddAsync(booking);
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

        // Check for booking conflicts (excluding current booking)
        var unavailable = await db.Bookings
            .Where(b => b.Hotel_Id == existingBooking.Hotel_Id && 
                       b.RoomType_Id == existingBooking.RoomType_Id && 
                       b.Id != id)
            .AnyAsync(b => 
                DateOnly.FromDateTime(b.Check_In) < bookingUpdateDto.Check_Out && 
                DateOnly.FromDateTime(b.Check_Out) > bookingUpdateDto.Check_In
            );
            
        if (unavailable)
            return Results.Conflict("Room is not available for the selected dates.");

        // Update properties
        existingBooking.Check_In = bookingUpdateDto.Check_In.ToDateTime(TimeOnly.MinValue);
        existingBooking.Check_Out = bookingUpdateDto.Check_Out.ToDateTime(TimeOnly.MinValue);
        existingBooking.RoomsCount = bookingUpdateDto.RoomsCount;
        existingBooking.Status = bookingUpdateDto.Status;
        
        // Recalculate total price
        existingBooking.Total_Price = existingBooking.Nights * roomType.Base_Price * bookingUpdateDto.RoomsCount;

        await db.SaveChangesAsync();
        return Results.Ok(existingBooking);
    }

    public async ValueTask<IResult> UpdateBookingStatus(int id, BookingStatusUpdateDTO statusDto)
    {
        // Find existing booking
        var booking = await db.Bookings.FindAsync(id);
        if (booking == null)
            return Results.NotFound($"Booking with ID {id} not found.");

        // Update status
        booking.Status = statusDto.Status;
        await db.SaveChangesAsync();
        
        return Results.Ok(booking);
    }

    public async ValueTask<IResult> DeleteBooking(int id)
    {
        // Find existing booking
        var booking = await db.Bookings.FindAsync(id);
        if (booking == null)
            return Results.NotFound($"Booking with ID {id} not found.");

        db.Bookings.Remove(booking);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
}
