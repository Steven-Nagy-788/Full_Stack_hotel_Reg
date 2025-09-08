using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Hotel_Reserv.Services
{
    public interface IAuthService
    {
        ValueTask<User?> RegisterAsync(UserDtoReg request);
        ValueTask<String?> LoginAsync(UserDtoLog request);
        ValueTask<List<UserDto?>> GetUsersAsync();
        ValueTask<User?> CreateUserAsync(UserDtoReg request);
        ValueTask<User?> UpdateUserAsync(int id,UserDtoReg upd);
        ValueTask<User?> DeleteUserAsync(int id);
    }
}
