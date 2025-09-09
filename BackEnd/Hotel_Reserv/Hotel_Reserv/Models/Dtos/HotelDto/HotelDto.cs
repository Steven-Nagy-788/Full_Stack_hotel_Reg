using Hotel_Reserv.Models.Dtos.RoomtypeDto;
using System.ComponentModel.DataAnnotations;

namespace Hotel_Reserv.Models.Dtos.HotelDto
{
    public class HotelDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Stars { get; set; }

        // Rooms shown in a simple way (avoid loops)
        public List<RoomTypeDto>? RoomTypes { get; set; }
    }
}
