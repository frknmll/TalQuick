import { useAuth } from "../context/AuthContext";
import Chat from "../components/Chat";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? <p>Hoş geldin, {user.username}!</p> : <p>Yükleniyor...</p>}
      <Chat />
    </div>
  );
};

export default Dashboard;
