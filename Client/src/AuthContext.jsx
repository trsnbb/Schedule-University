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

        // Зберігаємо токен у localStorage
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          console.log("Токен збережено в localStorage:", response.data.token);
        }
        console.log("Отриманий токен від сервера:", response.data.token);

        setIsAuthenticated(true);
        setUser(response.data); // Зберігаємо дані користувача
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null); // Очищаємо дані користувача
        console.error(
          "Помилка авторизації:",
          error.response?.data || error.message
        );
      }
    };

    checkAuth();
  }, []);
  useEffect(() => {
    console.log("Оновлений користувач у контексті:", user);
  }, [user]);
 return (
  <AuthContext.Provider value={{ isAuthenticated, user, setUser }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
