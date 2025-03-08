using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace TalQuickAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=TalQuickDB;Username=postgres;Password=123456");
            }
        }
    }
}
