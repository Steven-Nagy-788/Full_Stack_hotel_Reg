namespace Hotel_Reserv.Models;
public enum UserRole
{
    Admin,
    Guest
}
public class UserDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Password_Hash { get; set; }
    public UserRole? Role { get; set; }
}
public class User : UserDto
{
    public int Id { get; set; } 
    public DateTime Created_At { get; init; } = DateTime.UtcNow;
    public virtual ICollection<Booking>? Bookings { get; set; }
}