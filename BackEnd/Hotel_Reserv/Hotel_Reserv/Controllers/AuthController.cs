using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hotel_Reserv.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutfffhController(IAuthService authservice) : ControllerBase
    {
        [HttpPost("Register")]
        public async ValueTask<ActionResult<User>> Register(UserDtoReg request)
        {
            var user = await authservice.RegisterAsync(request);
            if (user is null) { return BadRequest("username already exists"); }
            return Ok(user);
        }
        [HttpPost("Login")]
        public async ValueTask<ActionResult<string>> Login(UserDtoLog request)
        {
            var token = await authservice.LoginAsync(request);
            if (token is null) { return BadRequest("invalid user name or password"); }
            return Ok(token);
        }

        [HttpGet("AuthenticatedOnly")]
        [Authorize]
        public IActionResult AuthenticatedOnlyEndPoint()
        {
            return Ok(new { Message = " You are authenticated!" });
        }
        [HttpGet("AdminsOnly")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminOnlyEndPoint()
        {
            return Ok(new { Message = " You are Admin!" });
        }
    }
}
