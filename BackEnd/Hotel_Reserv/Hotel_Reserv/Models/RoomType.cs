using System.Text.Json.Serialization;

namespace Hotel_Reserv.Models;
public class RoomType
{
    public int Id { get; set; }
    public string Name { get; set; }=string.Empty;
    public int Capacity { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public string Bed_type { get; set; } = string.Empty;
    public decimal Base_Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public int HotelId { get; set; }
    [JsonIgnore]
    public Hotel Hotel { get; set; } = null!;
    [JsonIgnore]
    public ICollection<RoomInventory> RoomInventories { get; set; } = new List<RoomInventory>();
    [JsonIgnore]
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();




}