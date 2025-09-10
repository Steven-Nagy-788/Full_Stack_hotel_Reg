namespace Hotel_Reserv.Models.Dtos;

public record HotelSearchRequest(
    string? City,
    DateTime CheckIn,
    DateTime CheckOut,
    string? NumberOfGuests,
    string? RoomTypeName
);

public record HotelSearchResult(
    int Id,
    string? Name,
    string? City,
    string? Address,
    string? Description,
    string? Thumbnail_url,
    int Stars,
    IEnumerable<AvailableRoomTypeDto> RoomTypes
);

public record AvailableRoomTypeDto(
    int Id,
    string? Name,
    string? Capacity,
    decimal Base_Price,
    string? Description,
    IEnumerable<RoomInventoryDto> RoomInventories
);

public record RoomInventoryDto(
    int ID,
    DateTime Date,
    int Total_Rooms,
    int Sold_Rooms,
    int AvailableRooms
);