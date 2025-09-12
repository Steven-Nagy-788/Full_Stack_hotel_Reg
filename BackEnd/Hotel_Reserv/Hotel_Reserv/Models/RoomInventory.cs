using System.Text.Json.Serialization;

namespace Hotel_Reserv.Models;
public class RoomInventory
{
    public int ID { get; init; }
    public DateTime Date { get; init; } = DateTime.UtcNow.Date;
    public int Total_Rooms { get; set; }
    public int Sold_Rooms { get; set; } = 0;
    public int AvailableRooms => Total_Rooms - Sold_Rooms;
    public int RoomType_ID { get; set; }
    [JsonIgnore]
    public RoomType? RoomType { get; set; }
}