using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace Hotel_Reserv.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HotelsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async ValueTask<IResult> GetHotels()
        {
            return Results.Ok(await _context.Hotels.ToListAsync());
        }

        [HttpGet("{id}")]
        public async ValueTask<IResult> GetHotel(int id)
        {
            var hotel = await _context.Hotels.FindAsync(id);
            return hotel is not null ? Results.Ok(hotel) : Results.NotFound();
        }

        // PUT: api/Hotels/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHotel(int id, Hotel hotel)
        {
            if (id != hotel.Id)
            {
                return BadRequest();
            }

            _context.Entry(hotel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HotelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        [HttpPost]
        public async ValueTask<IResult> PostHotel(HotelDto hotelDto)
        {
            var hotel = new Hotel
            {
                Name = hotelDto.Name,
                City = hotelDto.City,
                Address = hotelDto.Address,
                Description = hotelDto.Description,
                Stars = hotelDto.Stars,
                Thumbnail_url = hotelDto.Thumbnail_url
            };
            await _context.Hotels.AddAsync(hotel);
            await _context.SaveChangesAsync();
            return Results.Created($"api/Hotels/{hotel.Id}", hotel);
        }

        // DELETE: api/Hotels/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            var hotel = await _context.Hotels.FindAsync(id);
            if (hotel == null)
            {
                return NotFound();
            }

            _context.Hotels.Remove(hotel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HotelExists(int id)
        {
            return _context.Hotels.Any(e => e.Id == id);
        }
    }
}
