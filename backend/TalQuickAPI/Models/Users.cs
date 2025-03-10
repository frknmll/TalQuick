using System.ComponentModel.DataAnnotations;
namespace TalQuickAPI.Models

{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public byte[] PasswordHash { get; set; } = new byte[0];

        [Required]
        public byte[] PasswordSalt { get; set; } = new byte[0];
    }
}
