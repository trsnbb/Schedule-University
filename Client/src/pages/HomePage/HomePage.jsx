import React from "react";
import "./../../layouts/backround.css";
import Sidebar from "./../../components/Side bar/Sidebar.jsx";
import Calendar from "./../../components/Calendar/Сalendar.jsx";
import "./../../layouts/home_style.css";
import { useAuth } from "../../AuthContext.jsx";
import { useState, useEffect } from "react";
import axios from "./../../axios.js";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/user");
        console.log("Дані користувача:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error(
          "Користувач не авторизований:",
          error.response?.data || error.message
        );
      }
    };

    fetchUser();
  }, []);

  const handleAuth = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className='backround'>
      <Sidebar />
      <div className='main_content'>
        <div className='calendar_container'>
          {isAuthenticated ? (
            <Calendar />
          ) : (
            <div className='authText'>
              <p>Авторизуйтесь, щоб побачити розклад</p>
              <button className='button_auth' onClick={handleAuth}>
                Авторизація
              </button>
              <p className='note_auth'>
                *увага! для авторизації використовуйте корпоративну пошту
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
