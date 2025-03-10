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

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=TalQuickDB;Username=postgres;Password=123456");
            }
        }
    }
}
