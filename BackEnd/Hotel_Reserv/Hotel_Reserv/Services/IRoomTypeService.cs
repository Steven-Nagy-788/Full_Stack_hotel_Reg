using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Models.Dtos.RoomtypeDto;
namespace Hotel_Reserv.Services;

public interface IRoomTypeService
{
    ValueTask<IResult> GetRoomTypes();
    ValueTask<IResult> GetRoomType(int id);
<<<<<<< Updated upstream
    ValueTask<IResult> CreateRoomType(RoomType roomType);
=======
    ValueTask<IResult> CreateRoomType(RoomTypeDto roomType);
>>>>>>> Stashed changes
    ValueTask<IResult> UpdateRoomType(int id, RoomType roomType);
    ValueTask<IResult> DeleteRoomType(int id);
}