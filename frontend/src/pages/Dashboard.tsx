import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? <p>Hoş geldin, {user.username}!</p> : <p>Yükleniyor...</p>}
    </div>
  );
};

export default Dashboard;
