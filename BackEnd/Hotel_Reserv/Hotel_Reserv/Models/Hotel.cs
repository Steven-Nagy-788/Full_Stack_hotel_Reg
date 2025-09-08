using System.Text.Json.Serialization;

namespace Hotel_Reserv.Models;
public class Hotel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Stars { get; set; }  
    public string Thumbnail_url { get; set; } = string.Empty;
    public DateTime Created_At { get; set; } = DateTime.UtcNow;
    public int CreatedById { get; set; }
    [JsonIgnore]
    public User user { get; set; } = null!;
    [JsonIgnore]
    public ICollection<RoomType> RoomTypes { get; set; } = new List<RoomType>();
    [JsonIgnore]
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    [JsonIgnore]
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

}