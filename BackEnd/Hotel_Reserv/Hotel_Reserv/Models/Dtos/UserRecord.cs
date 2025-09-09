using Hotel_Reserv.Models.Enums;

namespace Hotel_Reserv.Models.Dtos;
public record UserDtoReg(string name,string email,string password);
public record UserDtoLog( string email,string password);
public record CreateUserDto(string name, string password, string email, UserRole role);
public record UserDto(int id, string? name, string? email, string role);