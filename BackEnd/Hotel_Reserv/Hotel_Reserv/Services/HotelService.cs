using Azure.Core;
using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Hotel_Reserv.Services
{
    public class HotelService : IHotelService
    {
        private readonly ApplicationDbContext db;

        public HotelService(ApplicationDbContext data)
        {
            db = data;
        }

        public async ValueTask<IResult> GetAllHotelsAsync() => 
            Results.Ok(await db.Hotels.Select(hotel => new HotelDto(hotel.Id,hotel.Name,hotel.City, hotel.Address,hotel.Description,hotel.Thumbnail_url,hotel.Stars)).ToListAsync());
        public async ValueTask<IResult> GetHotelByIdAsync(int id) =>
            Results.Ok(await db.Hotels.FirstOrDefaultAsync(h => h.Id == id));
        public async ValueTask<IResult> CreateHotelAsync(HotelDtoCreate dto, int userId)
        {
            if (await db.Hotels.AnyAsync(u =>u.Name == dto.Name &&u.City == dto.City && u.Address == dto.Address)) 
                return Results.Conflict(); 
            var hotel = new Hotel
            {
                Name = dto.Name,
                City = dto.City,
                Address = dto.Address,
                Description = dto.Description,
                Stars = dto.Stars,
                Thumbnail_url = dto.Thumbnail_url,
                CreatedById = userId,
                Admin = await db.Users.FirstOrDefaultAsync(u=>u.Id == userId)
            };
            await db.Hotels.AddAsync(hotel);
            await db.SaveChangesAsync();
            return Results.Ok();
        }
        public async ValueTask<IResult> UpdateHotelAsync(int id, HotelDtoCreate dto)
        {
            var existingHotel = await db.Hotels.FirstOrDefaultAsync(u=>u.Id==id);
            if (existingHotel is null) 
                return Results.BadRequest();
            existingHotel.Name = dto.Name;
            existingHotel.City = dto.City;
            existingHotel.Address = dto.Address;
            existingHotel.Description = dto.Description;
            existingHotel.Stars = dto.Stars;
            existingHotel.Thumbnail_url = dto.Thumbnail_url;
            await db.SaveChangesAsync();
            return Results.Ok();
        }

        public async ValueTask<IResult> DeleteHotelAsync(int id)
        {
            var hotel = await db.Hotels.FirstOrDefaultAsync(u => u.Id == id);
            if (hotel is not null)
            {
                db.Hotels.Remove(hotel);
                await db.SaveChangesAsync();
            }
            return Results.Ok();
        }
        //    public async Task<IEnumerable<HotelDto>> SearchAvailableHotelsAsync(
        //string city,
        //DateTime checkIn,
        //DateTime checkOut,
        //int numberOfClients,
        //int numberOfRooms)
        //    {
        //        var hotels = await db.Hotels
        //            .Include(h => h.RoomTypes)
        //                .ThenInclude(rt => rt.RoomInventories)
        //            .Where(h => h.City == city)
        //            .ToListAsync();

        //        var availableHotels = hotels
        //            .Where(h => h.RoomTypes.Any(rt =>
        //                rt.Capacity >= numberOfClients &&  // Room must fit clients
        //                rt.RoomInventories
        //                    .Where(inv => inv.Date >= checkIn && inv.Date < checkOut)
        //                    .All(inv => inv.AvailableRooms >= numberOfRooms) // Every date must have enough rooms
        //            ))
        //            .ToList();

        //        return availableHotels.Select(h => new HotelDto
        //        {
        //            Id = h.Id,
        //            Name = h.Name,
        //            City = h.City,
        //            Address = h.Address,
        //            Description = h.Description,
        //            Stars = h.Stars
        //            // add other properties you need in the DTO
        //        }).ToList();
        //    }
    }
}
