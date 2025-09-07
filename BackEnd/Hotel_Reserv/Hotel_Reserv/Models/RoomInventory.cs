using System.ComponentModel.DataAnnotations.Schema;

namespace Hotel_Reserv.Models;
public class RoomInventory
{
    public int ID { get; set; }
    public int RoomType_ID { get; set; }
    public DateTime Date { get; set; }
    public int Total_Rooms { get; set; }
    public int Sold_Rooms { get; set; } = 0;
    [ForeignKey("Hotel_Id")]
    public virtual RoomType? RoomType { get; set; }
}