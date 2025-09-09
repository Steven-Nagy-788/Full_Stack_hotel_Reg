using Microsoft.AspNetCore.Mvc;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Services;

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
        [HttpGet]
        public async Task<IResult> GetBookings()
        {
            return await _bookingService.GetBookings();
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<IResult> GetBooking(int id)
        {
            return await _bookingService.GetBooking(id);
        }

        // GET: api/Bookings/user/5
        [HttpGet("user/{userId}")]
        public async Task<IResult> GetBookingsByUserId(int userId)
        {
            return await _bookingService.GetBookingsByUserId(userId);
        }

        // POST: api/Bookings
        [HttpPost]
        public async Task<IResult> CreateBooking(BookingDTO bookingDto)
        {
            return await _bookingService.CreateBooking(bookingDto);
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
