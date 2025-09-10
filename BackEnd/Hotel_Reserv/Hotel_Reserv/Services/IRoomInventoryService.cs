using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
public interface IRoomInventoryService
{
    ValueTask<IResult> GetAllRoomInvAsync();
    ValueTask<IResult> GetRoomInvByIdAsync(int id);
    ValueTask<IResult> GetRoomInvByRoomTypeIdAsync(int id);
    ValueTask<IResult> CreateRoomInvAsync(RoomInventroyCreateDto dto);
    ValueTask<IResult> UpdateRoomInvAsync(int id, RoomInventroyUpdateDto dto);
    ValueTask<IResult> DeleteRoomInvAsync(int id);
}