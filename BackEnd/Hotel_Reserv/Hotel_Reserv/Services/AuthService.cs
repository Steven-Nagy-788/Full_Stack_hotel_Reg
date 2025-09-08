using Hotel_Reserv.Data;
using Hotel_Reserv.Models;
using Hotel_Reserv.Models.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Hotel_Reserv.Services
{
    public class AuthService(ApplicationDbContext db, IConfiguration config) : IAuthService
    {
        public async ValueTask<User?> RegisterAsync(UserDtoReg request)
        {
            if (await db.Users.AnyAsync(u => u.Email == request.Email)) { return null; }
            var user = new User() { };
            var hashedpassword = new PasswordHasher<User>().HashPassword(user, request.PassWord);
            user.Name = request.UserName;
            user.Password_Hash = hashedpassword;
            user.Email = request.Email;
            db.Users.Add(user);
            await db.SaveChangesAsync();
            return user;
        }
        public async ValueTask<string?> LoginAsync(UserDtoLog request)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user is null) { return null; }
            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.Password_Hash, request.PassWord) == PasswordVerificationResult.Failed)
            { return null; }
            return CreateToken(user);
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
                new Claim(ClaimTypes.Name,user.Name),
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.Role,user.Role),
                new Claim("created_at", DateTime.UtcNow.ToString("o"))
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
}
