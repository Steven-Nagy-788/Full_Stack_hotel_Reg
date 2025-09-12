using Hotel_Reserv.Data;
using Hotel_Reserv.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Hotel_Reserv.Services
{
    public class OrchestrationService : IOrchestrationService
    {
        private readonly ApplicationDbContext _context;

        public OrchestrationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async ValueTask<IResult> SearchAvailableHotelsAsync(HotelSearchRequest request)
        {
            try
            {
                // Get hotels in the specified city
                var hotelsQuery = _context.Hotels
                    .Include(h => h.RoomTypes)
                        .ThenInclude(rt => rt.RoomInventories)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(request.City))
                {
                    hotelsQuery = hotelsQuery.Where(h => h.City == request.City);
                }

                var hotels = await hotelsQuery.ToListAsync();

                var availableHotels = new List<HotelSearchResult>();

                foreach (var hotel in hotels)
                {
                    var availableRoomTypes = new List<AvailableRoomTypeDto>();

                    foreach (var roomType in hotel.RoomTypes)
                    {
                        // Filter by room type name if specified
                        if (!string.IsNullOrEmpty(request.RoomTypeName) && 
                            !string.Equals(roomType.Name, request.RoomTypeName, StringComparison.OrdinalIgnoreCase))
                            continue;

                        // Filter by capacity if number of guests is specified
                        if (!string.IsNullOrEmpty(request.NumberOfGuests))
                        {
                            // Exact match first, then flexible matching
                            if (!string.Equals(roomType.Capacity, request.NumberOfGuests, StringComparison.OrdinalIgnoreCase))
                            {
                                // Try more flexible capacity matching
                                var normalizedRequestCapacity = request.NumberOfGuests.ToLowerInvariant().Replace(" ", "");
                                var normalizedRoomCapacity = roomType.Capacity?.ToLowerInvariant().Replace(" ", "") ?? "";
                                
                                if (!normalizedRequestCapacity.Equals(normalizedRoomCapacity))
                                    continue;
                            }
                        }

                        // Get room inventories for the date range
                        var dateRange = GetDateRange(request.CheckIn, request.CheckOut);
                        
                        List<RoomInventoryDto> roomInventories;

                        if (dateRange.Count == 0)
                        {
                            // If no date range, return all available inventories
                            roomInventories = roomType.RoomInventories
                                .Select(inv => new RoomInventoryDto(
                                    inv.ID,
                                    inv.Date,
                                    inv.Total_Rooms,
                                    inv.Sold_Rooms,
                                    inv.AvailableRooms
                                )).ToList();
                        }
                        else
                        {
                            // Get inventories for the specified date range
                            var inventoriesInRange = roomType.RoomInventories
                                .Where(inv => dateRange.Contains(inv.Date))
                                .ToList();

                            roomInventories = inventoriesInRange
                                .Select(inv => new RoomInventoryDto(
                                    inv.ID,
                                    inv.Date,
                                    inv.Total_Rooms,
                                    inv.Sold_Rooms,
                                    inv.AvailableRooms
                                )).ToList();
                        }

                        // Add room type with its inventories
                        availableRoomTypes.Add(new AvailableRoomTypeDto(
                            roomType.Id,
                            roomType.Name,
                            roomType.Capacity,
                            roomType.Base_Price,
                            roomType.Description,
                            roomInventories
                        ));
                    }

                    // If hotel has available room types, add it to results
                    if (availableRoomTypes.Any())
                    {
                        availableHotels.Add(new HotelSearchResult(
                            hotel.Id,
                            hotel.Name,
                            hotel.City,
                            hotel.Address,
                            hotel.Description,
                            hotel.Thumbnail_url,
                            hotel.Stars,
                            availableRoomTypes
                        ));
                    }
                }

                return Results.Ok(availableHotels);
            }
            catch (Exception ex)
            {
                return Results.Problem($"An error occurred while searching for hotels: {ex.Message}");
            }
        }

        private static List<DateTime> GetDateRange(DateTime startDate, DateTime endDate)
        {
            var dates = new List<DateTime>();
            for (var date = startDate.Date; date < endDate.Date; date = date.AddDays(1))
            {
                dates.Add(date);
            }
            return dates;
        }
    }
}
