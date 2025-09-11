using Azure.Core;
using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Hotel_Reserv.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hotel_Reserv.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(IAuthService authservice) : ControllerBase
{
    [HttpPost("register")]
    public async ValueTask<IResult> PostUser(UserDtoReg request) => await authservice.RegisterAsync(request);

    [HttpPost("Login")]
    public async ValueTask<IResult> Login(UserDtoLog request) => await authservice.LoginAsync(request);

    [HttpGet("GetAllUsers")]
    [Authorize(Roles = "Admin,admin")]
    public async ValueTask<IResult> GetUsers() => await authservice.GetUsersAsync();

    [HttpPost("create_User")]
    [Authorize(Roles = "Admin,admin")]
    public async ValueTask<IResult> CreateUser(CreateUserDto obj) => await authservice.CreateUserAsync(obj);

    [HttpPut("UpdateUser/{id}")]
    [Authorize(Roles = "Admin,admin")]
    public async ValueTask<IResult> UpdateUser(int id, CreateUserDto obj) => await authservice.UpdateUserAsync(id, obj);

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,admin")]
    public async ValueTask<IResult> DeleteUser(int id) => await authservice.DeleteUserAsync(id);
}