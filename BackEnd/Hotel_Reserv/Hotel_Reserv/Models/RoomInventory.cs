namespace Hotel_Reserv.Models;
public class RoomInventory
{
    public int ID { get; set; }
    public DateTime Date { get; set; }
    public int Total_Rooms { get; set; }
    public int Sold_Rooms { get; set; } = 0;
    public int AvailableRooms => Total_Rooms - Sold_Rooms;
    public int RoomType_ID { get; set; }
    public RoomType RoomType { get; set; } = null!;
}