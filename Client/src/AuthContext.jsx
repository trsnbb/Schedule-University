import { createContext, useContext, useState, useEffect } from "react";
import axios from "./axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/user");
        console.log("Користувач авторизований:", response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error(
          "Помилка авторизації:",
          error.response?.data || error.message
        );
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
