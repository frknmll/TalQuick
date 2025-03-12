using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TalQuickAPI.Models
{
    public class GroupUser
    {
        [Key] // ✅ Composite Key (Birincil Anahtar) tanımı için kullanılacak
        [Column(Order = 1)]
        public int UserId { get; set; }
        public User? User { get; set; }

        [Key] // ✅ İkinci birincil anahtar
        [Column(Order = 2)]
        public int GroupId { get; set; }
        public Group? Group { get; set; }
    }
}
