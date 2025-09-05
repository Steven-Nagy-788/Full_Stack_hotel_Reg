using Hotel_Reserv.Models;
using Microsoft.EntityFrameworkCore;
namespace Hotel_Reserv.Data;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<Hotel> Hotels { get; set; }
    public DbSet<RoomType> RoomTypes { get; set; }
    public DbSet<RoomInventory> RoomInventories { get; set; }
    public DbSet<Booking> Bookings { get; set; }
}
