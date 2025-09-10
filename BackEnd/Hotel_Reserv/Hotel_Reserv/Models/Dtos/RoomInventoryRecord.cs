namespace Hotel_Reserv.Models.Dtos;
public record RoomInventroyDto(
    int Id,
    int RoomTypeId,
    DateTime Date,
    int TotalRooms,
    int SoldRooms,
    int AvailableRooms
);
public record RoomInventroyCreateDto(int TotalRooms, int RoomTypeId);
public record RoomInventroyUpdateDto(int TotalRooms, int SoldRooms);