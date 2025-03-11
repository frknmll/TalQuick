import { useEffect, useState } from "react";
import hubConnection, { startConnection } from "../services/signalR";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user } = useAuth(); // ✅ Kullanıcı bilgilerini alalım
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    startConnection(); // ✅ SignalR bağlantısını başlat

    // ✅ Gelen mesajları al ve ekrana yazdır
    hubConnection.on("ReceiveMessage", (username: string, message: string) => {
      setMessages((prevMessages) => [...prevMessages, { user: username, text: message }]);
    });

    return () => {
      hubConnection.off("ReceiveMessage"); // ✅ Sayfa kapatılırsa dinleyiciyi kaldır
    };
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await hubConnection.invoke("SendMessage", user?.username || "Anonim", newMessage); // ✅ Kullanıcı adı eklendi!
        setNewMessage(""); // ✅ Mesaj gönderildikten sonra input'u temizle
      } catch (error) {
        console.error("❌ Mesaj gönderilemedi:", error);
      }
    }
  };

  return (
    <div>
      <h2>🔵 Canlı Sohbet</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.user}:</strong> {msg.text}
          </p>
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
