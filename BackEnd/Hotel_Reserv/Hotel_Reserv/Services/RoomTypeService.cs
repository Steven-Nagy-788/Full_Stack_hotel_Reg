using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Hotel_Reserv.Services;

public class RoomTypeService(ApplicationDbContext db) : IRoomTypeService
{
    public async ValueTask<IResult> GetRoomTypes() =>
        Results.Ok(await db.RoomTypes.ToListAsync());

    public async ValueTask<IResult> GetRoomType(int id) =>
        Results.Ok(await db.RoomTypes.Include(rt => rt.RoomInventories).FirstOrDefaultAsync(rt => rt.Id == id));

    public async ValueTask<IResult> CreateRoomType(RoomTypeDto roomTypeDto)
    {
        var roomType = new RoomType()
        {
            Name = roomTypeDto.name,
            Capacity = roomTypeDto.Capacity,
            Base_Price = roomTypeDto.Base_price,
            Description = roomTypeDto.Description,
            HotelId = roomTypeDto.HotelID
        };
        await db.RoomTypes.AddAsync(roomType);
        await db.SaveChangesAsync();
        return Results.Created();
    }

    public async ValueTask<IResult> UpdateRoomType(int id, RoomType roomType)
    {
        var existingRoomType = await db.RoomTypes.FirstOrDefaultAsync(r => r.Id == id);
        if (existingRoomType is null)
            return Results.NotFound();
        existingRoomType.Name = roomType.Name;
        existingRoomType.Capacity = roomType.Capacity;
        existingRoomType.Base_Price = roomType.Base_Price;
        existingRoomType.Description = roomType.Description;
        existingRoomType.HotelId = roomType.HotelId;
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    public async ValueTask<IResult> DeleteRoomType(int id)
    {
        var existingRoomType = await db.RoomTypes.FirstOrDefaultAsync(r => r.Id == id);
        if (existingRoomType is not null)
        {
            db.RoomTypes.Remove(existingRoomType);
            await db.SaveChangesAsync();
        }
        return Results.Ok();
    }
}