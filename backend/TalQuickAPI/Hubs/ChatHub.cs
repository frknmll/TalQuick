using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace TalQuickAPI.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string username, string message, string time)
        {
            await Clients.All.SendAsync("ReceiveMessage", username, message, time);
        }
    }
}
