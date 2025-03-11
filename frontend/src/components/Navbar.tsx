import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#007bff", color: "white" }}>
      <div>
        <Link to="/dashboard" style={{ color: "white", marginRight: "10px" }}>Dashboard</Link>
        <Link to="/chat" style={{ color: "white", marginRight: "10px" }}>Sohbet</Link> {/* ✅ Sohbet Linki Eklendi */}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>Hoş geldin, {user.username}!</span>
            <button onClick={logout} style={{ background: "red", padding: "5px 10px", borderRadius: "5px", color: "white" }}>Çıkış Yap</button>
          </>
        ) : (
          <Link to="/login" style={{ color: "white" }}>Giriş Yap</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
