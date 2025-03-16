import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Chat from "./components/Chat";
import GroupChat from "./pages/GroupChat";
import Home from "./pages/Home";  // ✅ Yeni Home.tsx bileşenini dahil ettik

// Korumalı Rota: Kullanıcı giriş yapmamışsa `/login` sayfasına yönlendir
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p>Yükleniyor...</p>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ✅ Kullanıcı girişi gerektiren sayfalar */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* ✅ Yeni Ana Sayfa */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* 📌 Eski Sohbet Sayfası */}
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/groupchat" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />

          {/* ❌ Geçersiz bir rota girildiğinde anasayfaya yönlendirme */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
