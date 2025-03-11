import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Chat from "./components/Chat"; // ✅ Yeni eklediğimiz Chat bileşenini dahil edelim




// Korumalı Rota: Kullanıcı giriş yapmamışsa `/login` sayfasına yönlendir
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth(); // ✅ Yüklenme durumunu aldık

  if (isLoading) {
    return <p>Yükleniyor...</p>; // ✅ Kullanıcı bilgisi çekilene kadar "Yükleniyor..." göster
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
          
          {/* ❌ Geçersiz bir rota girildiğinde dashboard'a yönlendirme */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

          {/* 📌 Yeni Sohbet Sayfası */}
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
