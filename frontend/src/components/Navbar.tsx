import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Çıkış yaptıktan sonra login sayfasına yönlendir
  };

  return (
    <nav>
      <h2>TalQuick</h2>
      {user ? (
        <>
          <span>Hoş geldin, {user.username}!</span>
          <button onClick={handleLogout}>Çıkış Yap</button>
        </>
      ) : (
        <button onClick={() => navigate("/login")}>Giriş Yap</button>
      )}
    </nav>
  );
};

export default Navbar;
