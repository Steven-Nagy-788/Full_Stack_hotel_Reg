namespace Hotel_Reserv.Models.Dtos;

public class BookingDTO
{
    public int User_Id { get; set; }
    public int Hotel_Id { get; set; }
    public int RoomType_Id { get; set; }
    public DateOnly Check_In { get; set; }
    public DateOnly Check_Out { get; set; }
    public int RoomsCount { get; set; } = 1;
}