using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel_Reserv.Data;
using Hotel_Reserv.Models;

namespace Hotel_Reserv.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomInventoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RoomInventoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/RoomInventories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomInventory>>> GetRoomInventories()
        {
            return await _context.RoomInventories.ToListAsync();
        }

        // GET: api/RoomInventories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomInventory>> GetRoomInventory(int id)
        {
            var roomInventory = await _context.RoomInventories.FindAsync(id);

            if (roomInventory == null)
            {
                return NotFound();
            }

            return roomInventory;
        }

        // PUT: api/RoomInventories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoomInventory(int id, RoomInventory roomInventory)
        {
            if (id != roomInventory.ID)
            {
                return BadRequest();
            }

            _context.Entry(roomInventory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomInventoryExists(id))
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

        // POST: api/RoomInventories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RoomInventory>> PostRoomInventory(RoomInventory roomInventory)
        {
            _context.RoomInventories.Add(roomInventory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoomInventory", new { id = roomInventory.ID }, roomInventory);
        }

        // DELETE: api/RoomInventories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomInventory(int id)
        {
            var roomInventory = await _context.RoomInventories.FindAsync(id);
            if (roomInventory == null)
            {
                return NotFound();
            }

            _context.RoomInventories.Remove(roomInventory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomInventoryExists(int id)
        {
            return _context.RoomInventories.Any(e => e.ID == id);
        }
    }
}
