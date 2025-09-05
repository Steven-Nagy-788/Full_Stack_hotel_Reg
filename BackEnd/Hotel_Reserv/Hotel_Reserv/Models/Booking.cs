namespace Hotel_Reserv.Models;
public enum BookingStatus
{
    PENDING,
    CONFIRMED,
    REJECTED,
    CANCELLED,
    COMPLETED
}
public class Booking
{
    public int Id { get; set; }
    public int User_Id { get; set; }
    public int Hotel_Id { get; set; }
    public int RoomType_Id { get; set; }
    public DateTime Check_In { get; set; }
    public DateTime Check_Out { get; set; }
    public int Nights { get; set; }
    public decimal Total_Price { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.PENDING;
    public DateTime Created_At { get; init; } = DateTime.UtcNow;
    public virtual User? User { get; set; }
    public virtual Hotel? Hotel { get; set; }
    public virtual RoomType? RoomType { get; set; }
}