namespace Hotel_Reserv.Models.Dtos;

public class RoomTypeDTO
{
    public string Name { get; set; }=string.Empty;
    public int Capacity { get; set; }
    public string Bed_type { get; set; } = string.Empty;
    public decimal Base_Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public int HotelId { get; set; }    
}