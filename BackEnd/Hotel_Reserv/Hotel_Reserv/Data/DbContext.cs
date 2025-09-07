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
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // This is the key fix. It breaks the cascade cycle.
        // When a RoomType is deleted, do not automatically delete its Bookings.
        // This forces you to handle booking deletions manually if a room type is removed.
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.RoomType)
            .WithMany() // Assuming RoomType doesn't have a direct ICollection<Booking>
            .HasForeignKey(b => b.RoomType_Id)
            .OnDelete(DeleteBehavior.Restrict); // Or .NoAction

        // It's also good practice to prevent User deletion from cascading to Bookings.
        // Keep the booking history even if the user is deleted.
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany(u => u.Bookings)
            .HasForeignKey(b => b.User_Id)
            .OnDelete(DeleteBehavior.Restrict); // Or .NoAction
    }
}
