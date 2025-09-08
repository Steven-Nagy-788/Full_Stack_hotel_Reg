using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;

namespace Hotel_Reserv.Services
{
    public interface IAuthService
    {
        ValueTask<User?> RegisterAsync(UserDtoReg request);
        ValueTask<String?> LoginAsync(UserDtoLog request);
    }
}
