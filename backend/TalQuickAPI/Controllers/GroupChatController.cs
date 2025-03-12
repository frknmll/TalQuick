using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TalQuickAPI.Data;
using TalQuickAPI.Hubs;
using TalQuickAPI.Models;
using System.Security.Claims;

namespace TalQuickAPI.Controllers
{
    [Route("api/groupchat")]
    [ApiController]
    [Authorize]
    public class GroupChatController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public GroupChatController(AppDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // ✅ 1️⃣ Yeni grup oluşturma
        [HttpPost("create")]
        public async Task<IActionResult> CreateGroup([FromBody] Group group)
        {
            _context.Groups.Add(group);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Grup oluşturuldu!", group });
        }

        // ✅ 2️⃣ Mevcut grupları listeleme
        [HttpGet("groups")]
        public async Task<IActionResult> GetGroups()
        {
            var groups = await _context.Groups.ToListAsync();
            return Ok(groups);
        }

        // ✅ 3️⃣ Kullanıcıyı gruba ekleme
        [HttpPost("addUser")]
        public async Task<IActionResult> AddUserToGroup([FromBody] GroupUser groupUser)
        {
            _context.GroupUsers.Add(groupUser);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Kullanıcı gruba eklendi!" });
        }

        // ✅ 4️⃣ Gruba mesaj gönderme
        [HttpPost("sendMessage")]
        public async Task<IActionResult> SendMessageToGroup([FromBody] GroupMessage groupMessage)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (userId == null || username == null) return Unauthorized("Geçersiz kullanıcı.");

            groupMessage.UserId = int.Parse(userId);
            groupMessage.SenderUsername = username;
            groupMessage.Timestamp = DateTime.UtcNow;

            _context.GroupMessages.Add(groupMessage);
            await _context.SaveChangesAsync();

            // ✅ SignalR ile gruba mesaj gönderme
            await _hubContext.Clients.Group(groupMessage.GroupId.ToString())
                .SendAsync("ReceiveGroupMessage", groupMessage.GroupId, username, groupMessage.Message, groupMessage.Timestamp);

            return Ok(new { message = "Mesaj gönderildi!", groupMessage });
        }

        // ✅ 5️⃣ Grup mesajlarını getirme
        [HttpGet("messages/{groupId}")]
        public async Task<IActionResult> GetGroupMessages(int groupId)
        {
            var messages = await _context.GroupMessages
                .Where(m => m.GroupId == groupId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();

            return Ok(messages);
        }
    }
}
