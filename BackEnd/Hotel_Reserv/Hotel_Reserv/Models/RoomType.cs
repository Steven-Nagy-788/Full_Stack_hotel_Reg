namespace Hotel_Reserv.Models;
public class RoomType
{
    public int Id { get; set; }
    public int Hotel_Id { get; set; }
    public string? Name { get; set; }
    public int Capacity { get; set; }
    public string? Bed_type { get; set; }
    public decimal Base_Price { get; set; }
    public string? Description { get; set; }
    public virtual Hotel? Hotel { get; set; }
}