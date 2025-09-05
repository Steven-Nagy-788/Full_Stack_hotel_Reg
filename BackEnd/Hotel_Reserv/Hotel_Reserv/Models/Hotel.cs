namespace Hotel_Reserv.Models;
public class Hotel
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public string? Description { get; set; }
    public int Stars { get; set; }
    public string? Thumbnail_url { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public virtual ICollection<RoomType>? RoomTypes { get; set; }
}