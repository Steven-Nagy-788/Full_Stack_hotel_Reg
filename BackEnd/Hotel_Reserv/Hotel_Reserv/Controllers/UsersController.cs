using Azure.Core;
using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hotel_Reserv.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(IAuthService authservice) : ControllerBase
    {
        [HttpPost("register")]
        public async ValueTask<ActionResult> PostUser(UserDtoReg request)
        {
            var user = await authservice.RegisterAsync(request);
            if (user is null) { return BadRequest("Email already exists"); }
            return Ok("account created");
        }

        [HttpPost("Login")]
        public async ValueTask<ActionResult<string>> Login(UserDtoLog request)
        {
            var token = await authservice.LoginAsync(request);
            if (token is null) { return BadRequest("invalid user name or password"); }
            return Ok(token);
        }
        [HttpGet("GetAllUsers")]
        [Authorize(Roles = "Admin")]
        public async ValueTask<ActionResult<List<UserDto>>> GetUsers()
        {
            var users = await authservice.GetUsersAsync();
            if (users == null || users.Count == 0)
                return NotFound("No users found.");
            return Ok(users);
        }



        [HttpPost("create_User")]
        [Authorize(Roles = "Admin")]
        public async ValueTask<ActionResult> CreateUser(CreateUserDto obj)
        {
            var user = await authservice.CreateUserAsync(obj);
            if (user is null) { return BadRequest("Email already exists"); }
            return Ok("account created");
        }



        [HttpPut("UpdateUser_{id:int}")]
        [Authorize(Roles = "Admin")]
        public async ValueTask<ActionResult> UpdateUser(int id, CreateUserDto obj)
        {
            var user= await authservice.UpdateUserAsync(id, obj);
            if (obj is null) { return BadRequest("INVALID OBJCT"); }
            return Ok(obj);
        }
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async ValueTask<ActionResult> DeleteUser(int id)
        {
            var user = await authservice.DeleteUserAsync(id);
            if (user is null) { return NotFound(); }
            return Ok("user is deleted ");
        }
    }
}
