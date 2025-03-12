import { useEffect, useState } from "react";
import hubConnection, { startConnection } from "../services/signalR";
import { useAuth } from "../context/AuthContext";

interface ChatProps {
  groupId?: number; // ✅ Opsiyonel olarak grup sohbeti destekleyelim
}

const Chat = ({ groupId }: ChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ user: string; text: string; time: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    startConnection();

    if (groupId) {
      // ✅ Grup sohbeti için dinleyici ekleyelim
      hubConnection.on("ReceiveGroupMessage", (receivedGroupId: number, username: string, message: string, time: string) => {
        if (receivedGroupId === groupId) {
          setMessages((prevMessages) => [...prevMessages, { user: username, text: message, time }]);
        }
      });
    } else {
      // ✅ Bireysel sohbet için dinleyici ekleyelim
      hubConnection.on("ReceiveMessage", (username: string, message: string, time: string) => {
        setMessages((prevMessages) => [...prevMessages, { user: username, text: message, time }]);
      });
    }

    return () => {
      hubConnection.off("ReceiveMessage");
      hubConnection.off("ReceiveGroupMessage");
    };
  }, [groupId]); // ✅ Grup değişirse dinleyiciyi güncelle

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const time = new Date().toLocaleTimeString();

      if (groupId) {
        // ✅ Grup mesajı gönderme
        await hubConnection.invoke("SendMessageToGroup", groupId.toString(), user?.username || "Anonim", newMessage);
      } else {
        // ✅ Bireysel mesaj gönderme
        await hubConnection.invoke("SendMessage", user?.username || "Anonim", newMessage, time);
      }

      setNewMessage("");
    } catch (error) {
      console.error("❌ Mesaj gönderilemedi:", error);
    }
  };

  return (
    <div>
      <h2>{groupId ? "📢 Grup Sohbeti" : "🔵 Canlı Sohbet"}</h2>
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
