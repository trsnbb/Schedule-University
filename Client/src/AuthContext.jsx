import { createContext, useContext, useState, useEffect } from "react";
import axios from "./axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/user");

        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }

        setIsAuthenticated(true);
        setUser(response.data); 
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null); 
        console.error(
          "Помилка авторизації:",
          error.response?.data || error.message
        );
      }
    };

    checkAuth();
  }, []);
  useEffect(() => {
  }, [user]);
 return (
  <AuthContext.Provider value={{ isAuthenticated, user, setUser }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
