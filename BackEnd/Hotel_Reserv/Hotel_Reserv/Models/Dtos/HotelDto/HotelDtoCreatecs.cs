namespace Hotel_Reserv.Models.Dtos.HotelDto
{
    public class HotelDtoCreate
    {
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Thumbnail_url { get; set; } = string.Empty;
        public int Stars { get; set; }
    }
}
