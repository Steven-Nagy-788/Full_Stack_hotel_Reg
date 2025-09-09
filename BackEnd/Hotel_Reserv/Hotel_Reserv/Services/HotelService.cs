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

        public async Task<IEnumerable<HotelDto>> GetAllHotelsAsync()
        {
            var hotels = await _db.Hotels
                .ToListAsync();

            return hotels.Select(h => new HotelDto
            {
                Id = h.Id,
                Name = h.Name,
                City = h.City,
                Address = h.Address,
                Description = h.Description,
                Stars = h.Stars
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
                Stars = hotel.Stars
               };
            
        }

        public async Task<HotelDto> CreateHotelAsync(HotelDtoCreate dto, int userId)
        {
            var hotel = new Hotel
            {
                Name = dto.Name,
                City = dto.City,
                Address = dto.Address,
                Description = dto.Description,
                Stars = dto.Stars,
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
