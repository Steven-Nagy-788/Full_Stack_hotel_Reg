using System.Text.Json.Serialization;

namespace Hotel_Reserv.Models;
public class Hotel
{
    public int Id { get; init; }
    public string? Name { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public string? Description { get; set; }
    public int Stars { get; set; }  
    public string? Thumbnail_url { get; set; }
    public DateTime Created_At { get; init; } = DateTime.UtcNow;
    public int CreatedById { get; set; }
    [JsonIgnore]
    public User? Admin { get; set; }
    [JsonIgnore]
    public ICollection<RoomType> RoomTypes { get; set; } = new List<RoomType>();
    [JsonIgnore]
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    [JsonIgnore]
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

}