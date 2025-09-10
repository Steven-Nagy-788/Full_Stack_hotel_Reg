using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Hotel_Reserv.Services
{
    public class RoomInventoryService : IRoomInventoryService
    {
        private readonly ApplicationDbContext db;

        public RoomInventoryService(ApplicationDbContext data)
        {
            db = data;
        }
        public async ValueTask<IResult> GetAllRoomInvAsync() =>
            Results.Ok(await db.RoomInventories.ToListAsync());//.Select(hotel => new HotelDto(hotel.Id, hotel.Name, hotel.City, hotel.Address, hotel.Description, hotel.Thumbnail_url, hotel.Stars))
        public async ValueTask<IResult> GetRoomInvByIdAsync(int id) =>
            Results.Ok(await db.RoomInventories.FirstOrDefaultAsync(h => h.ID == id));
        public async ValueTask<IResult> GetRoomInvByRoomTypeIdAsync(int id) =>
            Results.Ok(await db.RoomInventories.FirstOrDefaultAsync(h => h.RoomType_ID == id));
        public async ValueTask<IResult> CreateRoomInvAsync(RoomInventroyCreateDto dto)
        {
            var roomInv = new RoomInventory()
            {
                Total_Rooms= dto.TotalRooms,
                RoomType_ID= dto.RoomTypeId
            };
            await db.RoomInventories.AddAsync(roomInv);
            await db.SaveChangesAsync();
            return Results.Ok();
        }
        public async ValueTask<IResult> UpdateRoomInvAsync(int id, RoomInventroyUpdateDto dto)
        {
            var existingRoomInv = await db.RoomInventories.FirstOrDefaultAsync(u => u.ID == id);
            if (existingRoomInv is null)
                return Results.NotFound();
            existingRoomInv.Total_Rooms = dto.TotalRooms;
            existingRoomInv.Sold_Rooms = dto.SoldRooms;
            await db.SaveChangesAsync();
            return Results.Ok();
        }

        public async ValueTask<IResult> DeleteRoomInvAsync(int id)
        {
            var RoomInv = await db.RoomInventories.FirstOrDefaultAsync(u => u.ID == id);
            if (RoomInv is not null)
            {
                db.RoomInventories.Remove(RoomInv);
                await db.SaveChangesAsync();
            }
            return Results.Ok();
        }
    }
}
