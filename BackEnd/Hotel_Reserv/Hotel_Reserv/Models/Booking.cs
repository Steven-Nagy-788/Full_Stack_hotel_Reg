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
    public User User { get; set; } = null!;
    public int Hotel_Id { get; set; }
    public Hotel Hotel { get; set; } = null!;
    public int RoomType_Id { get; set; }
    public RoomType RoomType { get; set; } = null!;
    public DateTime Check_In { get; set; }
    public DateTime Check_Out { get; set; }
    public int Nights => (Check_Out.Date - Check_In.Date).Days;
    public int RoomsCount { get; set; } = 1;
    public decimal Total_Price { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.PENDING;
    public DateTime Created_At { get; init; } = DateTime.UtcNow;
  
}