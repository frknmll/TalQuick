import { useState } from "react";
import { loginUser } from "../services/api"; // ✅ API servisimizden loginUser fonksiyonunu alıyoruz
import { saveToken } from "../services/authService"; // ✅ Token'ı localStorage'a kaydetmek için
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // ✅ Mesaj state'i
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password); // ✅ API çağrısını merkezileştirdik
      saveToken(response.data.token); // ✅ Token'ı kaydet
      setMessage("Giriş başarılı!"); // ✅ Kullanıcıya başarılı giriş mesajı göster
      console.log("Giriş başarılı, token:", response.data.token);
      navigate("/dashboard"); // ✅ Kullanıcıyı yönlendir
    } catch (error) {
      console.error("Giriş başarısız:", error);
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
