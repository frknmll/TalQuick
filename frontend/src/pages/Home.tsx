import { useEffect, useState } from "react";
import { getGroups } from "../services/api";
import { joinGroup, leaveGroup } from "../services/signalR";
import Chat from "../components/Chat";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Home = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  // ✅ Mevcut grupları getir
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
    if (selectedGroup) await leaveGroup(selectedGroup);
    setSelectedGroup(groupId);
    await joinGroup(groupId);
  };

  return (
    <div className="home-container">
      {/* ✅ Sol Sidebar */}
      <aside className="sidebar">
        <h2>TalQuick</h2>
        <button onClick={createGroup}>+ Yeni Grup</button>
        <ul>
          <li onClick={() => setSelectedGroup(null)}>🏠 Dashboard</li>
          {groups.map((group) => (
            <li key={group.id} onClick={() => handleGroupSelection(group.id)}>
              {group.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* ✅ Sağ Sohbet Alanı */}
      <main className="chat-area">
        {selectedGroup ? (
          <Chat groupId={selectedGroup} />
        ) : (
          <div className="welcome">
            <h1>Welcome to TalQuick</h1>
            <p>Bir sohbet grubuna katılarak konuşmaya başlayabilirsiniz.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
