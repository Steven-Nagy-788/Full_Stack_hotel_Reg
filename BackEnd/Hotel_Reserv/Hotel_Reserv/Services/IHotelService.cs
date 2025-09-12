using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
public interface IHotelService
{
    ValueTask<IResult> GetAllHotelsAsync();
    ValueTask<IResult> GetHotelByIdAsync(int id);
    ValueTask<IResult> CreateHotelAsync(HotelDtoCreate dto, int userId);
    ValueTask<IResult> UpdateHotelAsync(int id, HotelDtoCreate dto);
    ValueTask<IResult> DeleteHotelAsync(int id);
    //ValueTask<IResult> SearchAvailableHotelsAsync(
    //    string city,
    //    DateTime checkIn,
    //    DateTime checkOut,
    //    int numberOfClients,
    //    int numberOfRooms);
}