using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
namespace Hotel_Reserv.Services;

public interface IRoomTypeService
{
    ValueTask<IResult> GetRoomTypes();
    ValueTask<IResult> GetRoomType(int id);
    ValueTask<IResult> CreateRoomType(RoomTypeDto roomType);
    ValueTask<IResult> UpdateRoomType(int id, RoomType roomType);
    ValueTask<IResult> DeleteRoomType(int id);
}