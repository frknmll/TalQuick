using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TalQuickAPI.Models 
{
    public class GroupMessage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string SenderUsername { get; set; } = string.Empty; // ✅ Kullanıcının adını sakla

        [Required]
        public string Message { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [ForeignKey("User")]
        public int UserId { get; set; } // ✅ Kullanıcı ID eklendi
        public User? User { get; set; }

        [ForeignKey("Group")]
        public int GroupId { get; set; }
        public Group? Group { get; set; }
    }
}
