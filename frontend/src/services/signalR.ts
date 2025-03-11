import * as signalR from "@microsoft/signalr";

// ✅ SignalR bağlantısını oluştur
const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5063/chatHub") // Backend SignalR URL’si
  .withAutomaticReconnect() // Bağlantı koparsa tekrar bağlan
  .configureLogging(signalR.LogLevel.Information) // Konsolda debug mesajlarını gör
  .build();

// ✅ Bağlantıyı başlatan fonksiyon
export const startConnection = async () => {
  try {
    await hubConnection.start();
    console.log("🚀 SignalR bağlantısı kuruldu!");
  } catch (error) {
    console.error("❌ SignalR bağlantısı başarısız:", error);
    setTimeout(startConnection, 5000); // 5 saniye sonra tekrar dene
  }
};

// Bağlantıyı başlatmayı dene
startConnection();

export default hubConnection;
