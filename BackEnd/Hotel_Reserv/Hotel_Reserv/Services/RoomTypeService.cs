using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
<<<<<<< Updated upstream
=======
using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Models.Dtos.RoomtypeDto;
>>>>>>> Stashed changes
using Microsoft.EntityFrameworkCore;

namespace Hotel_Reserv.Services;

public class RoomTypeService(ApplicationDbContext db) : IRoomTypeService
{
    public async ValueTask<IResult> GetRoomTypes()
    {
        return Results.Ok(await db.RoomTypes.ToListAsync());
    }

    public async ValueTask<IResult> GetRoomType(int id)
    {
        return Results.Ok(await db.RoomTypes.Where(b => b.Id == id).FirstOrDefaultAsync());
    }

<<<<<<< Updated upstream
    public async ValueTask<IResult> CreateRoomType(RoomType roomType)
=======
    public async ValueTask<IResult> CreateRoomType(RoomTypeDto roomTypeDto)
>>>>>>> Stashed changes
    {
        await db.RoomTypes.AddAsync(roomType);
        await db.SaveChangesAsync();
        return Results.Created($"/api/RoomTypes/{roomType.Id}", roomType);
    }

    public async ValueTask<IResult> UpdateRoomType(int id, RoomType roomType)
    {
        try
        {
            if (id != roomType.Id)
            {
                return Results.BadRequest("ID mismatch between URL and body.");
            }

            var existingRoomType = await db.RoomTypes.FindAsync(id);
            if (existingRoomType == null)
            {
                return Results.NotFound($"Room type with ID {id} not found.");
            }

            // Update properties
            existingRoomType.Name = roomType.Name;
            existingRoomType.Capacity = roomType.Capacity;
            existingRoomType.Bed_type = roomType.Bed_type;
            existingRoomType.Base_Price = roomType.Base_Price;
            existingRoomType.Description = roomType.Description;
            existingRoomType.HotelId = roomType.HotelId;

            await db.SaveChangesAsync();
            return Results.NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await RoomTypeExists(id))
            {
                return Results.NotFound($"Room type with ID {id} not found.");
            }

            throw;
        }
        catch (Exception ex)
        {
            return Results.Problem($"Error updating room type: {ex.Message}");
        }
    }

    public async ValueTask<IResult> DeleteRoomType(int id)
    {
        try
        {
            var roomType = await db.RoomTypes.FindAsync(id);
            if (roomType == null)
            {
                return Results.NotFound($"Room type with ID {id} not found.");
            }

            db.RoomTypes.Remove(roomType);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }
        catch (Exception ex)
        {
            return Results.Problem($"Error deleting room type: {ex.Message}");
        }
    }

    private async ValueTask<bool> RoomTypeExists(int id)
    {
        return await db.RoomTypes.AnyAsync(e => e.Id == id);
    }
}