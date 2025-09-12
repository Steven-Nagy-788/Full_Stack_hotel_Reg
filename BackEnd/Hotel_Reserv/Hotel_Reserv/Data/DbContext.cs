using Hotel_Reserv.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Hotel_Reserv.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<RoomInventory> RoomInventories { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // Hotel - RoomType
            modelBuilder.Entity<RoomType>()
                .HasOne(rt => rt.Hotel)
                .WithMany(h => h.RoomTypes)
                .HasForeignKey(rt => rt.HotelId)
                .OnDelete(DeleteBehavior.Cascade); // deleting Hotel deletes RoomTypes
                                                   // Hotel - User (Admin creates Hotels)
            modelBuilder.Entity<Hotel>()
                .HasOne(h => h.Admin)
                .WithMany(u => u.Hotels)
                .HasForeignKey(h => h.CreatedById)
                .OnDelete(DeleteBehavior.Restrict); // deleting Admin doesn't delete Hotels
            // RoomType - RoomInventory
            modelBuilder.Entity<RoomInventory>()
                .HasOne(ri => ri.RoomType)
                .WithMany(rt => rt.RoomInventories)
                .HasForeignKey(ri => ri.RoomType_ID)
                .OnDelete(DeleteBehavior.Cascade); // deleting RoomType deletes inventories

            // Booking - User
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.User_Id)
                .OnDelete(DeleteBehavior.Restrict); // prevent multiple cascade paths

            // Booking - Hotel
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Hotel)
                .WithMany(h => h.Bookings)
                .HasForeignKey(b => b.Hotel_Id)
                .OnDelete(DeleteBehavior.Restrict); // prevent multiple cascade paths

            // Booking - RoomType
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.RoomType)
                .WithMany(rt => rt.Bookings)
                .HasForeignKey(b => b.RoomType_Id)
                .OnDelete(DeleteBehavior.Restrict); // prevent multiple cascade paths

            // Review - User
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Review - Hotel
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Hotel)
                .WithMany(h => h.Reviews)
                .HasForeignKey(r => r.HotelId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
