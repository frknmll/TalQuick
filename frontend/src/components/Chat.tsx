import { useEffect, useState } from "react";
import hubConnection, { startConnection } from "../services/signalR";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user } = useAuth(); // ✅ Kullanıcı bilgilerini al
  const [messages, setMessages] = useState<{ user: string; text: string; time: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    startConnection(); // ✅ SignalR bağlantısını başlat

    // ✅ Gelen mesajları al ve ekrana yazdır
    hubConnection.on("ReceiveMessage", (username: string, message: string, time: string) => {
      setMessages((prevMessages) => [...prevMessages, { user: username, text: message, time }]);
    });

    return () => {
      hubConnection.off("ReceiveMessage"); // ✅ Sayfa kapatılırsa dinleyiciyi kaldır
    };
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const time = new Date().toLocaleTimeString(); // ✅ Gönderilen mesajın saatini ekleyelim
        await hubConnection.invoke("SendMessage", user?.username || "Anonim", newMessage, time);
        setNewMessage(""); // ✅ Mesaj gönderildikten sonra input'u temizle
      } catch (error) {
        console.error("❌ Mesaj gönderilemedi:", error);
      }
    }
  };

  return (
    <div>
      <h2>🔵 Canlı Sohbet</h2>
      <div style={{ maxHeight: "400px", overflowY: "auto", padding: "10px", border: "1px solid #ccc" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.user === user?.username ? "right" : "left", margin: "10px 0" }}>
            <p style={{ 
              display: "inline-block",
              padding: "10px",
              borderRadius: "10px",
              background: msg.user === user?.username ? "#4CAF50" : "#ddd",
              color: msg.user === user?.username ? "white" : "black"
            }}>
              <strong>{msg.user}</strong>: {msg.text}
              <br />
              <span style={{ fontSize: "0.8em", opacity: 0.7 }}>{msg.time}</span>
            </p>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Mesajınızı yazın..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Gönder</button>
    </div>
  );
};

export default Chat;
