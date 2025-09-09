using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Hotel_Reserv.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        // GET: api/Bookings
        [HttpGet("getallbooking")]
        [Authorize(Roles="guest,Admin")]
        public async Task<IResult> GetBookings()
        {
            return await _bookingService.GetBookings();
        }

        // GET: api/Bookings/5
        [HttpGet("get_id_of_the_booking{id}")]
        public async Task<IResult> GetBooking(int id)
        {
            return await _bookingService.GetBooking(id);
        }

        // GET: all booking of this user
        [HttpGet("get_booking_by_user_id{userId}")]
        public async Task<IResult> GetBookingsByUserId(int userId)
        {
            return await _bookingService.GetBookingsByUserId(userId);
        }

        // POST: api/Bookings
        [HttpPost]
        public async Task<IResult> CreateBooking([FromBody] BookingDTO bookingDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return await _bookingService.CreateBooking(bookingDto, userId);
        }

        // PUT: api/Bookings/5
        [HttpPut("{id}")]
        public async Task<IResult> UpdateBooking(int id, BookingUpdateDTO bookingUpdateDto)
        {
            return await _bookingService.UpdateBooking(id, bookingUpdateDto);
        }

        // PATCH: api/Bookings/5/status
        [HttpPatch("{id}/status")]
        public async Task<IResult> UpdateBookingStatus(int id, [FromBody] BookingStatusUpdateDTO statusDto)
        {
            return await _bookingService.UpdateBookingStatus(id, statusDto);
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        public async Task<IResult> DeleteBooking(int id)
        {
            return await _bookingService.DeleteBooking(id);
        }
    }
}
