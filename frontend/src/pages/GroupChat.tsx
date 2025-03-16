import { useEffect, useState } from "react";
import { getGroups } from "../services/api";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { joinGroup, leaveGroup } from "../services/signalR";
import hubConnection from "../services/signalR";

const GroupChat = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [messages, setMessages] = useState<{ senderUsername: string; message: string; timestamp: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  // ✅ Mevcut grupları API'den çek
  const fetchGroups = async () => {
    try {
      const response = await getGroups();
      setGroups(response.data);
    } catch (error) {
      console.error("❌ Grup listesi alınamadı:", error);
    }
  };

  // ✅ Grup oluşturma
  const createGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5063/api/groupchat/create",
        { name: newGroupName },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log("✅ Grup oluşturuldu:", response.data);
      setNewGroupName("");
      fetchGroups();
    } catch (error) {
      console.error("❌ Grup oluşturulamadı:", error);
    }
  };

  // ✅ Grup seçildiğinde SignalR'a bağlan
  const handleGroupSelection = async (groupId: number) => {
    if (selectedGroup) {
      await leaveGroup(selectedGroup); // ✅ Önce önceki gruptan ayrıl
    }
    setSelectedGroup(groupId);
    setMessages([]); // ✅ Seçili grup değiştiğinde mesajları temizle!
    await joinGroup(groupId); // ✅ Yeni gruba bağlan
  };

  // ✅ Mesaj gönderme fonksiyonu (SignalR üzerinden mesaj gönderme)
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    try {
      await hubConnection.invoke("SendMessageToGroup", selectedGroup.toString(), user?.username, newMessage);
      setNewMessage(""); // ✅ Mesaj gönderildikten sonra input'u temizle
    } catch (error) {
      console.error("❌ Mesaj gönderilemedi:", error);
    }
  };

  // ✅ Gelen mesajları dinleme (messages bağımlılığı kaldırıldı!)
  useEffect(() => {
    if (selectedGroup) {
      console.log("🎧 Grup mesajları dinleniyor...", selectedGroup);

      const messageHandler = (groupId: string, senderUsername: string, message: string, timestamp: string) => {
        if (groupId.toString() === selectedGroup.toString()) {
          console.log("📥 Mesaj alındı:", { groupId, senderUsername, message, timestamp });
          setMessages((prevMessages) => [...prevMessages, { senderUsername, message, timestamp }]);
        }
      };

      hubConnection.on("ReceiveGroupMessage", messageHandler);

      return () => {
        hubConnection.off("ReceiveGroupMessage", messageHandler);
      };
    }
  }, [selectedGroup]); // ✅ `messages` bağımlılığı kaldırıldı

  return (
    <div>
      <h2>📢 Grup Sohbetleri</h2>

      {/* ✅ Yeni Grup Oluşturma Formu */}
      <div>
        <input
          type="text"
          placeholder="Yeni Grup Adı"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button onClick={createGroup}>Grup Oluştur</button>
      </div>

      {/* ✅ Grup listesi */}
      <h3>Mevcut Gruplar</h3>
      <ul>
        {groups.length > 0 ? (
          groups.map((group) => (
            <li key={group.id}>
              <button onClick={() => handleGroupSelection(group.id)}>
                {group.name}
              </button>
            </li>
          ))
        ) : (
          <p>Henüz bir grup yok!</p>
        )}
      </ul>

      {/* ✅ Seçilen grupta mesajlaşma */}
      {selectedGroup && (
        <div>
          <h3>{groups.find((g) => g.id === selectedGroup)?.name} Grubu</h3>

          {/* ✅ Mesajları göster */}
          <div style={{ maxHeight: "300px", overflowY: "auto", padding: "10px", border: "1px solid #ccc" }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.senderUsername === user?.username ? "right" : "left", margin: "10px 0" }}>
                <p style={{ 
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "10px",
                  background: msg.senderUsername === user?.username ? "#4CAF50" : "#ddd",
                  color: msg.senderUsername === user?.username ? "white" : "black"
                }}>
                  <strong>{msg.senderUsername}</strong>: {msg.message}
                  <br />
                  <span style={{ fontSize: "0.8em", opacity: 0.7 }}>{msg.timestamp}</span>
                </p>
              </div>
            ))}
          </div>

          {/* ✅ Mesaj gönderme alanı */}
          <input
            type="text"
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Gönder</button>
          <button onClick={() => leaveGroup(selectedGroup)}>Gruptan Çık</button>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
