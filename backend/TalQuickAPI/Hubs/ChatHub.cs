using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace TalQuickAPI.Hubs
{
    public class ChatHub : Hub
    {
        // ✅ Kullanıcı mesaj gönderdiğinde çalışacak metod
        public async Task SendMessage(string username, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", username, message); // ✅ Kullanıcı adını da ilet
        }
    }
}
