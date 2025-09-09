using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Models.Dtos.HotelDto;
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
        private readonly IHotelService _hotelService;

        public HotelController(IHotelService hotelService)
        {
            _hotelService = hotelService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllHotels()
        {
            var hotels = await _hotelService.GetAllHotelsAsync();
            return Ok(hotels);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHotelById(int id)
        {
            var hotel = await _hotelService.GetHotelByIdAsync(id);
            if (hotel is null) return NotFound();
            return Ok(hotel);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateHotel([FromBody] HotelDtoCreate dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var hotel = await _hotelService.CreateHotelAsync(dto, userId);
            return Ok(hotel);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateHotel(int id, [FromBody] HotelDtoCreate dto)
        {
            var updated = await _hotelService.UpdateHotelAsync(id, dto);
            if (!updated) return NotFound();
            return Ok(new { message = "Hotel updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            var deleted = await _hotelService.DeleteHotelAsync(id);
            if (!deleted) return NotFound();
            return Ok(new { message = "Hotel deleted successfully" });
        }
    }
}
