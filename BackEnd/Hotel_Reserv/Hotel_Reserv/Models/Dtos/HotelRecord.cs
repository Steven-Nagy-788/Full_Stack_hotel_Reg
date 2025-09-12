
namespace Hotel_Reserv.Models.Dtos;
public record HotelDto(
    int Id,
    string? Name,
    string? City,
    string? Address,
    string? Description,
    string? Thumbnail_url,
    int Stars
);
public record HotelDtoCreate(
    string? Name,
    string? City,
    string? Address,
    string? Description,
    string? Thumbnail_url,
    int Stars
);
//public List<RoomTypeDTO>? RoomTypes { get; set; }