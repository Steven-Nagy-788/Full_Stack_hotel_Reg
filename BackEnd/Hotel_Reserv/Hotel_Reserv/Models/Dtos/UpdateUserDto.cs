namespace Hotel_Reserv.Models.Dtos
{
    public class UpdateUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password_Hash { get; set; }
        public string Role { get; set; }

    }
}
