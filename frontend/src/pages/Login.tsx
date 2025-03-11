import { useState } from "react";
import { loginUser } from "../services/api"; // ✅ API çağrısı için
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ AuthContext'i kullanıyoruz

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // ✅ Hata / Başarı mesajları için
  const navigate = useNavigate();
  const auth = useAuth(); // ✅ Kullanıcı oturum yönetimi için AuthContext

  const handleLogin = async () => {
    try {
      console.log("📤 Giriş isteği gönderiliyor...");
      const response = await loginUser(email, password);
      console.log("✅ Giriş başarılı, yanıt:", response);

      await auth.login(response.data.token); // ✅ Token'ı kaydet ve kullanıcı bilgilerini güncelle
      console.log("🔑 Kullanıcı bilgisi alındı, yönlendirme yapılıyor...");

      navigate("/dashboard"); // ✅ Kullanıcıyı yönlendir
      console.log("➡ Yönlendirme çalıştı!");
    } catch (error) {
      setMessage("Giriş başarısız! Hatalı email veya şifre.");
      console.error("❌ Giriş başarısız, hata:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Giriş Yap</button>
      {message && <p>{message}</p>} {/* ✅ Eğer mesaj varsa ekrana bas */}
    </div>
  );
};

export default Login;
