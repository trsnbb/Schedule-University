import { createContext, useContext, useState, useEffect } from "react";
import axios from "./axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Додаємо стан для збереження даних користувача

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/user");
        console.log("Користувач авторизований:", response.data);
        setIsAuthenticated(true);
        setUser(response.data); // Зберігаємо дані користувача
      } catch (error) {
        console.error(
          "Помилка авторизації:",
          error.response?.data || error.message
        );
        setIsAuthenticated(false);
        setUser(null); // Очищаємо дані користувача
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);