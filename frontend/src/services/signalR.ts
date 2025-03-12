import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5063/chatHub", {
    withCredentials: true,
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

// ✅ SignalR bağlantısını başlat veya tekrar bağlan
export const startConnection = async () => {
  try {
    if (hubConnection.state !== signalR.HubConnectionState.Connected) {
      await hubConnection.start();
      console.log("🚀 SignalR bağlantısı kuruldu!");

      // ✅ Eksik Event Dinleyicileri Ekleyelim
      hubConnection.on("ReceiveSystemMessage", (message) => {
        console.log("🔔 Sistem Mesajı:", message);
      });

      hubConnection.on("ReceiveGroupMessage", (groupId, senderUsername, message, timestamp) => {
        console.log("📥 Grup Mesajı Alındı:", { groupId, senderUsername, message, timestamp });
      });
    }
  } catch (error) {
    console.error("❌ SignalR bağlantısı başarısız:", error);
    setTimeout(startConnection, 5000);
  }
};

// ✅ Kullanıcıyı bir gruba katılmaya zorla
export const joinGroup = async (groupId: number) => {
  try {
    await hubConnection.invoke("JoinGroup", groupId.toString());
    console.log(`✅ Gruba katıldınız: ${groupId}`);
  } catch (error) {
    console.error("❌ Gruba katılamadı:", error);
  }
};

// ✅ Kullanıcıyı bir gruptan çıkarmaya zorla
export const leaveGroup = async (groupId: number) => {
  try {
    await hubConnection.invoke("LeaveGroup", groupId.toString());
    console.log(`🚪 Gruptan ayrıldınız: ${groupId}`);
  } catch (error) {
    console.error("❌ Gruptan ayrılamadı:", error);
  }
};

// ✅ Gruba mesaj gönderme fonksiyonu (Eksikti, ekledim)
export const sendGroupMessage = async (groupId: number, username: string, message: string) => {
  try {
    await hubConnection.invoke("SendMessageToGroup", groupId.toString(), username, message);
    console.log(`📤 Mesaj gönderildi: [${groupId}] ${username}: ${message}`);
  } catch (error) {
    console.error("❌ Mesaj gönderilemedi:", error);
  }
};

// ✅ Bağlantıyı başlat
startConnection();

export default hubConnection;
