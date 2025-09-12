using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
namespace Hotel_Reserv.Services;
public class AuthService(ApplicationDbContext db, IConfiguration config) : IAuthService
{
    public async ValueTask<IResult> RegisterAsync(UserDtoReg request)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.email))
            return Results.Conflict();
        var user = new User()
        {
            Name = request.name,
            Email = request.email
        };
        user.Password_Hash = new PasswordHasher<User>().HashPassword(user, request.password);
        await db.Users.AddAsync(user);
        await db.SaveChangesAsync();
        return Results.Ok();
    }
    public async ValueTask<IResult> LoginAsync(UserDtoLog request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.email);
        if (user is null || user.Password_Hash is null)
            return Results.NotFound();
        if (new PasswordHasher<User>().VerifyHashedPassword(user, user.Password_Hash, request.password) == PasswordVerificationResult.Failed)
            return Results.Unauthorized();
        return Results.Ok(CreateToken(user));
    }
    public async ValueTask<IResult> GetUsersAsync() => 
        Results.Ok(await db.Users.Select(user => new UserDto(user.Id, user.Name, user.Email,user.Role)).ToListAsync());
    public async ValueTask<IResult> CreateUserAsync(CreateUserDto request)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.email))
            return Results.Conflict();
        var user = new User()
        {
            Name = request.name,
            Email = request.email,
            Password_Hash = request.password,
            Role = request.role.ToString()
        };
        user.Password_Hash = new PasswordHasher<User>().HashPassword(user, request.password);
        await db.Users.AddAsync(user);
        await db.SaveChangesAsync();
        return Results.Ok();
    }
    public async ValueTask<IResult> UpdateUserAsync(int id, CreateUserDto upd)
    {
        var existingUser = await db.Users.FirstOrDefaultAsync(i => i.Id == id);
        if (existingUser is null)
            return Results.NotFound();
        existingUser.Name = upd.name;
        existingUser.Email = upd.name;
        existingUser.Password_Hash = new PasswordHasher<User>().HashPassword(existingUser, upd.password);
        existingUser.Role = upd.role.ToString();
        await db.SaveChangesAsync();
        return Results.Ok();
    }
    public async ValueTask<IResult> DeleteUserAsync(int id)
    {
        var existingUser = await db.Users.FirstOrDefaultAsync(i => i.Id == id);
        if (existingUser is not null)
        {
            db.Users.Remove(existingUser);
            await db.SaveChangesAsync();
        }
        return Results.Ok();
    }
    /*private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private async ValueTask<string> GenerateAndSaveRefreshTokenAsync(User user)
    {
        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await db.SaveChangesAsync();
        return refreshToken;
    }*/
    private string CreateToken(User user)
    {
        var Claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
            new Claim(ClaimTypes.Name,user.Name ?? string.Empty),
            new Claim(ClaimTypes.Email,user.Email ?? string.Empty),
            new Claim(ClaimTypes.Role,user.Role.ToString())
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["AppSettings:Token"]!));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
        var tokendescriptor = new JwtSecurityToken(
           issuer: config.GetValue<string>("AppSettings:Issuer"),
           audience: config.GetValue<string>("AppSettings:Audience"),
           claims: Claims,
           signingCredentials: cred,
           expires: DateTime.UtcNow.AddDays(1)
           );
        return new JwtSecurityTokenHandler().WriteToken(tokendescriptor);
    }
}
