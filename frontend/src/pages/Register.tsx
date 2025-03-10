import { useState } from "react";
import { registerUser } from "../services/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(email, username, password);
      setMessage("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
    } catch (error) {
      setMessage("Kayıt başarısız! E-posta zaten kullanılıyor.");
    }
  };

  return (
    <div>
      <h2>Kayıt Ol</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Kayıt Ol</button>
      <p>{message}</p>
    </div>
  );
};

export default Register;
