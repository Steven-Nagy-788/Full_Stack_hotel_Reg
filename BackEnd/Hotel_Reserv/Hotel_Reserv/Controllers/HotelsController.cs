using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Hotel_Reserv.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelController : ControllerBase
    {
        private readonly IHotelService hotelService;

        public HotelController(IHotelService HotelService)
        {
            hotelService = HotelService;
        }

        [HttpGet]
        public async ValueTask<IResult> GetAllHotels() =>
            await hotelService.GetAllHotelsAsync();

        [HttpGet("{id}")]
        public async ValueTask<IResult> GetHotelById(int id) =>
            await hotelService.GetHotelByIdAsync(id);

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async ValueTask<IResult> CreateHotel([FromBody] HotelDtoCreate dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return await hotelService.CreateHotelAsync(dto, userId);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async ValueTask<IResult> UpdateHotel(int id, [FromBody] HotelDtoCreate dto) =>
            await hotelService.UpdateHotelAsync(id, dto);
         
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async ValueTask<IResult> DeleteHotel(int id) =>
            await hotelService.DeleteHotelAsync(id);

        //[HttpGet("search")]
        //public async Task<IResult> SearchHotels(
        //        string city,
        //        DateTime checkIn,
        //        DateTime checkOut,
        //        int numberOfClients,
        //        int numberOfRooms)=> await hotelService.SearchAvailableHotelsAsync(city, checkIn, checkOut, numberOfClients, numberOfRooms);

    }
}
