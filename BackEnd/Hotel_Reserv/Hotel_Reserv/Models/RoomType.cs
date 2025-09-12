using System.Text.Json.Serialization;

namespace Hotel_Reserv.Models;
public class RoomType
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Capacity { get; set; }
    public decimal Base_Price { get; set; }
    public string? Description { get; set; }
    public int HotelId { get; set; }
    [JsonIgnore]
    public Hotel? Hotel { get; set; }
    [JsonIgnore]
    public ICollection<RoomInventory> RoomInventories { get; set; } = new List<RoomInventory>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();




}