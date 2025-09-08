namespace Hotel_Reserv.Models.Dtos
{
    public class UserDtoReg
    {
        public string UserName { get; set; } = string.Empty;
        public string PassWord { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; }= "guest";    
    }
}
