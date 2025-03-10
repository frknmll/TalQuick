import axios from "axios";

const API_BASE_URL = "http://localhost:5063/api"; // Backend portunu kontrol et!

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Kullanıcı kayıt fonksiyonu
export const registerUser = async (email: string, username: string, password: string) => {
  return api.post("/user/register", { email, username, password });
};

// Kullanıcı giriş fonksiyonu
export const loginUser = async (email: string, password: string) => {
  return api.post("/user/login", { email, password });
};

// ✅ Kullanıcı profil bilgilerini almak için fonksiyon EKLENDİ!
export const getUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token bulunamadı, giriş yapmanız gerekiyor.");
  
    return api.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
