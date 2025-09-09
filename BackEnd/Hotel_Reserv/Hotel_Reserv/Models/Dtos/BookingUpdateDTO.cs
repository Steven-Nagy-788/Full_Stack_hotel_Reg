namespace Hotel_Reserv.Models.Dtos;

public class BookingUpdateDTO
{
    public DateOnly Check_In { get; set; }
    public DateOnly Check_Out { get; set; }
    public int RoomsCount { get; set; }
    public BookingStatus Status { get; set; }
}
