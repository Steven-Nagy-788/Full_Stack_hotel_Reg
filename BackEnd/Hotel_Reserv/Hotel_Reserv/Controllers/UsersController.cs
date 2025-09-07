using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Services;
using Microsoft.AspNetCore.Authorization;

namespace Hotel_Reserv.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        public UsersController(ApplicationDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        [HttpPost("register")]
        public async ValueTask<IResult> PostUser(UserRegDto userDto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Email == userDto.Email);
            if (userExists)
                return Results.Conflict();
            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password_Hash = _passwordHasher.Hash(userDto.Password_Hash),
                Role = userDto.Role
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Results.Created($"/api/users/{user.Id}", user);
        }

        [HttpPost("login")]
        public async ValueTask<IResult> LoginUser(UserLoginDto userLoginDto)
        {
            var userExists = await _context.Users.Where(u => u.Email == userLoginDto.Email).FirstOrDefaultAsync();
            if (userExists is null)
                return Results.NotFound();
            var correctPassword =_passwordHasher.Verify(userLoginDto.Password_Hash, userExists.Password_Hash!);
            if (!correctPassword)
                return Results.Unauthorized();
            return Results.Ok(userExists);
        }
        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
