namespace Hotel_Reserv.Models;
public enum UserRole
{
    Admin,
    Guest
}
public record UserRegDto(string Name, string Email, string Password_Hash, UserRole Role);
public record UserLoginDto (string Email , string Password_Hash);
public class User
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Password_Hash { get; set; }
    public UserRole? Role { get; set; }
    public DateTime Created_At { get; init; } = DateTime.UtcNow;
    public virtual ICollection<Booking>? Bookings { get; set; }
}