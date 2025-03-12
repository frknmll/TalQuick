using Microsoft.EntityFrameworkCore;
using Npgsql;
using TalQuickAPI.Models; // Kullanıcı modelini içeri aktarıyoruz.

namespace TalQuickAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // 📌 **Veritabanı tablolarını temsil eden DbSet<T> ifadeleri burada yer alır**
        public DbSet<User> Users { get; set; } // Users tablosunu veritabanına ekliyoruz.
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupUser> GroupUsers { get; set; }
        public DbSet<GroupMessage> GroupMessages { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=TalQuickDB;Username=postgres;Password=123456");
            }
        }

        // ✅ GroupUser için Composite Key ekleme
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GroupUser>()
                .HasKey(gu => new { gu.UserId, gu.GroupId }); // ✅ Composite Primary Key tanımlandı

            base.OnModelCreating(modelBuilder);
        }
    }
}
