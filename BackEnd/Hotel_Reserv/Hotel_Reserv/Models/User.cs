namespace Hotel_Reserv.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password_Hash { get; set; } = string.Empty;
    public string Role { get; set; } = "guest";
    public DateTime Created_At { get; init; } = DateTime.UtcNow;
    public ICollection<Hotel> Hotels { get; set; }=new List<Hotel>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

}