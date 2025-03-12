using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace TalQuickAPI.Hubs
{
    public class ChatHub : Hub
    {
        // ✅ Bireysel mesaj gönderme (Mevcut sistem için bırakıldı)
        public async Task SendMessage(string username, string message, string time)
        {
            await Clients.All.SendAsync("ReceiveMessage", username, message, time);
        }

        // ✅ Kullanıcı belirli bir gruba katılacak
        public async Task JoinGroup(string groupId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
            Console.WriteLine($"🔵 {Context.ConnectionId} kullanıcısı {groupId} grubuna katıldı.");
            await Clients.Group(groupId).SendAsync("ReceiveSystemMessage", $"{Context.ConnectionId} gruba katıldı.");
        }

        // ✅ Kullanıcı belirli bir gruptan ayrılacak
        public async Task LeaveGroup(string groupId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
            Console.WriteLine($"🔴 {Context.ConnectionId} kullanıcısı {groupId} grubundan ayrıldı.");
            await Clients.Group(groupId).SendAsync("ReceiveSystemMessage", $"{Context.ConnectionId} gruptan ayrıldı.");
        }

        // ✅ Kullanıcı belirli bir gruba mesaj gönderecek
        public async Task SendMessageToGroup(string groupId, string username, string message)
        {
            // 🔍 **Kullanıcının gerçekten grupta olup olmadığını kontrol et**
            if (!int.TryParse(groupId, out int parsedGroupId))
            {
                Console.WriteLine("❌ Hatalı grup ID");
                return;
            }

            string timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
            
            Console.WriteLine($"📩 Mesaj Alındı -> Grup: {groupId}, Kullanıcı: {username}, Mesaj: {message}, Saat: {timestamp}");

            await Clients.Group(groupId).SendAsync("ReceiveGroupMessage", groupId, username, message, timestamp);
        }
    }
}
