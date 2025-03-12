using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TalQuickAPI.Models
{
    public class Group
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public List<GroupUser> GroupUsers { get; set; } = new List<GroupUser>();
        public List<GroupMessage> Messages { get; set; } = new List<GroupMessage>();
    }
}
