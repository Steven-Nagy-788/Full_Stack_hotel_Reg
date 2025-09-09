using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Hotel_Reserv.Services
{
    public interface IAuthService
    {
        ValueTask<IResult> RegisterAsync(UserDtoReg request);
        ValueTask<IResult> LoginAsync(UserDtoLog request);
        ValueTask<IResult> GetUsersAsync();
        ValueTask<IResult> CreateUserAsync(CreateUserDto request);
        ValueTask<IResult> UpdateUserAsync(int id, CreateUserDto upd);
        ValueTask<IResult> DeleteUserAsync(int id);
    }
}
