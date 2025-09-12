
namespace Hotel_Reserv.Models.Dtos;
//public class RoomTypeDTO
//{
//    public string Name { get; set; } = string.Empty;
//    public string Capacity { get; set; }
//    public decimal Base_Price { get; set; }
//    public string Description { get; set; } = string.Empty;
//    public int HotelId { get; set; }
//}
public record RoomTypeDto (string? name, string? Capacity,decimal Base_price, string? Description, int HotelID);