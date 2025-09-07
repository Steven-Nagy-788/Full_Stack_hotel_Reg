using System.ComponentModel.DataAnnotations.Schema;

namespace Hotel_Reserv.Models;
public enum BookingStatus
{
    PENDING,
    CONFIRMED,
    REJECTED,
    CANCELLED,
    COMPLETED
}
public record BookingDto(int User_Id, int Hotel_Id, int RoomType_Id, DateTime Check_In, DateTime Check_Out);
public class Booking
{
    public int Id { get; set; }
    public int User_Id { get; set; }
    public int Hotel_Id { get; set; }
    public int RoomType_Id { get; set; }
    public DateTime Check_In { get; set; }
    public DateTime Check_Out { get; set; }
    public int Nights => (Check_Out - Check_In).Days;
    public decimal Total_Price { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.PENDING;
    public DateTime Created_At { get; init; } = DateTime.UtcNow;
    [ForeignKey("User_Id")]
    public virtual User? User { get; set; }
    [ForeignKey("Hotel_Id")]
    public virtual Hotel? Hotel { get; set; }
    [ForeignKey("RoomType_Id")]
    public virtual RoomType? RoomType { get; set; }
}