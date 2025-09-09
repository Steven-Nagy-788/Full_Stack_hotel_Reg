// Services/IHotelService.cs
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos.HotelDto;

public interface IHotelService
{
    Task<IEnumerable<HotelDto>?> GetAllHotelsAsync();
    Task<HotelDto?> GetHotelByIdAsync(int id);
    Task<HotelDto> CreateHotelAsync(HotelDtoCreate dto, int userId);
    Task<bool> UpdateHotelAsync(int id, HotelDtoCreate dto);
    Task<bool> DeleteHotelAsync(int id);
    Task<IEnumerable<HotelDto>> SearchAvailableHotelsAsync(
        string city,
        DateTime checkIn,
        DateTime checkOut,
        int numberOfClients,
        int numberOfRooms);


}
