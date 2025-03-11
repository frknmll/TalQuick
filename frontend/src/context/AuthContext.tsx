import { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../services/api";
import { saveToken, getToken, removeToken } from "../services/authService";

interface AuthContextType {
  user: { username: string; email: string } | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token: string) => {
    saveToken(token);
    try {
      const response = await getUserProfile();
      setUser(response.data);
      console.log("🔓 Kullanıcı giriş yaptı:", response.data);
    } catch (error) {
      console.error("❌ Profil alınamadı, çıkış yapılıyor:", error);
      logout();
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      (async () => {
        await login(token);
      })();
    }
    // ✅ Kullanıcı bilgisi geldikten SONRA yüklenme durumunu false yap!
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Küçük bir gecikme ekleyerek ani sıçramaları önlüyoruz
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth hook'u AuthProvider içinde kullanılmalıdır.");
  }
  return context;
};
