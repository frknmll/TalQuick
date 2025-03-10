import { useEffect, useState } from "react";
import { getUserProfile } from "../services/api";

const Profile = () => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile(); // API çağrısı
        setUser(response.data); // 🔥 Burada response içindeki data'yı aldık
      } catch (error) {
        console.error("Profil alınamadı:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>Profil Bilgileri</h2>
      <p><strong>Kullanıcı Adı:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Profile;
