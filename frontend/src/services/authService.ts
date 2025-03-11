// Token'ı localStorage'a kaydet
export const saveToken = (token: string) => {
    localStorage.setItem("token", token);
  };
  
  // Token'ı localStorage'dan al
  export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  // Token'ı localStorage'dan sil
  export const removeToken = () => {
    localStorage.removeItem("token");
  };
  