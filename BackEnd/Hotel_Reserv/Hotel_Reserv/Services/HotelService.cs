using Azure.Core;
using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Models.Dtos.HotelDto;
using Microsoft.EntityFrameworkCore;

namespace Hotel_Reserv.Services
{
    public class HotelService : IHotelService
    {
        private readonly ApplicationDbContext _db;

        public HotelService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<HotelDto>?> GetAllHotelsAsync()
        {

            var hotels = await _db.Hotels
                .ToListAsync();
            if(hotels is null) { return null; }

            return hotels.Select(h => new HotelDto
            {
                Id = h.Id,
                Name = h.Name,
                City = h.City,
                Address = h.Address,
                Description = h.Description,
                Stars = h.Stars,
                Thumbnail_url = h.Thumbnail_url,
                RoomTypes = h.RoomTypes?.Select(rt => new RoomTypeDTO
                {
                    Name = rt.Name,
                    Capacity = rt.Capacity,
                    Base_Price = rt.Base_Price,
                    Bed_type = rt.Bed_type,
                    Description = rt.Description,
                    HotelId = rt.HotelId

                })
            .ToList()
            });

            }

        public async Task<IEnumerable<HotelDto>> SearchAvailableHotelsAsync(
    string city,
    DateTime checkIn,
    DateTime checkOut,
    int numberOfClients,
    int numberOfRooms)
        {
            var hotels = await _db.Hotels
                .Include(h => h.RoomTypes)
                    .ThenInclude(rt => rt.RoomInventories)
                .Where(h => h.City == city)
                .ToListAsync();

            var availableHotels = hotels
                .Where(h => h.RoomTypes.Any(rt =>
                    rt.Capacity >= numberOfClients &&  // Room must fit clients
                    rt.RoomInventories
                        .Where(inv => inv.Date >= checkIn && inv.Date < checkOut)
                        .All(inv => inv.AvailableRooms >= numberOfRooms) // Every date must have enough rooms
                ))
                .ToList();

            return  availableHotels.Select(h => new HotelDto
            {
                Id = h.Id,
                Name = h.Name,
                City = h.City,
                Address = h.Address,
                Description = h.Description,
                Stars = h.Stars
                // add other properties you need in the DTO
            }).ToList();
        }
        

        public async Task<HotelDto?> GetHotelByIdAsync(int id)
        {
            var hotel = await _db.Hotels
                .FirstOrDefaultAsync(h => h.Id == id);

            if (hotel is null) return null;

            return new HotelDto
            {
                Id = hotel.Id,
                Name = hotel.Name,
                City = hotel.City,
                Address = hotel.Address,
                Description = hotel.Description,
                Stars = hotel.Stars,
                Thumbnail_url= hotel.Thumbnail_url,
                RoomTypes = hotel.RoomTypes?.Select(rt => new RoomTypeDTO
                {
                    Name = rt.Name,
                    Capacity = rt.Capacity,
                    Base_Price = rt.Base_Price,
                    Bed_type = rt.Bed_type,
                    Description = rt.Description,
                    HotelId = rt.HotelId
                }).ToList()
            };


        }

        public async Task<HotelDto> CreateHotelAsync(HotelDtoCreate dto, int userId)
        {
            if (await _db.Hotels.AnyAsync(u =>
        u.Name == dto.Name &&
        u.City == dto.City &&
        u.Address == dto.Address)){return null;}
            var hotel = new Hotel
            {
                Name = dto.Name,
                City = dto.City,
                Address = dto.Address,
                Description = dto.Description,
                Stars = dto.Stars,
                Thumbnail_url = dto.Thumbnail_url,
                CreatedById = userId
            };

            _db.Hotels.Add(hotel);
            await _db.SaveChangesAsync();

            return new HotelDto
            {
                Id = hotel.Id,
                Name = hotel.Name,
                City = hotel.City,
                Address = hotel.Address,
                Description = hotel.Description,
                Stars = hotel.Stars,
                Thumbnail_url= hotel.Thumbnail_url,
                RoomTypes = new List<RoomTypeDTO>()
            };
        }

        public async Task<bool> UpdateHotelAsync(int id, HotelDtoCreate dto)
        {
            var hotel = await _db.Hotels.FindAsync(id);
            if (hotel is null) return false;

            hotel.Name = dto.Name;
            hotel.City = dto.City;
            hotel.Address = dto.Address;
            hotel.Description = dto.Description;
            hotel.Stars = dto.Stars;
            hotel.Thumbnail_url = dto.Thumbnail_url;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteHotelAsync(int id)
        {
            var hotel = await _db.Hotels.FindAsync(id);
            if (hotel is null) return false;

            _db.Hotels.Remove(hotel);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
