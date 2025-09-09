namespace Hotel_Reserv.Models.Dtos
{
    public class CreateUserDtoReg
    {
        public string UserName { get; set; } = string.Empty;
        public string PassWord { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
