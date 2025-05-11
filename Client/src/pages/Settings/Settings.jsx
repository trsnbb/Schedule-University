import React, { useState, useEffect } from "react";
import "./../../layouts/backround.css";
import Sidebar from "./../../components/Side bar/Sidebar.jsx";
import "./settings.css"; // створимо окремий CSS файл для стилів
import { useAuth } from "../../AuthContext.jsx"; // Імпортуємо контекст авторизації
import axios from "./../../axios.js";

const Settings = () => {
  const { user, setUser } = useAuth(); // Отримуємо дані користувача з контексту
  const [newName, setNewName] = useState(user?.name || ""); // Локальний стан для нового імені
  const [timeFormat, setTimeFormat] = useState(user?.timeFormat || 24); // Локальний стан для формату часу

  useEffect(() => {
    // Оновлюємо стан, якщо дані користувача змінюються
    if (user) {
      setNewName(user.name || "");
      setTimeFormat(user.timeFormat || 24);
    }
  }, [user]);

  const handleNameChange = (e) => {
    setNewName(e.target.value); // Оновлюємо локальний стан
  };

  const handleTimeFormatChange = async (format) => {
    setTimeFormat(format); // Оновлюємо локальний стан
    try {
      const response = await axios.patch(
        "/updateUserProfile",
        { timeFormat: format },
        { withCredentials: true }
      );

      console.log("Формат часу оновлено:", response.data);

      if (response.data.success) {
        setUser((prevUser) => ({
          ...prevUser,
          timeFormat: format,
        }));
      }
    } catch (error) {
      console.error(
        "Помилка при оновленні формату часу:",
        error.response?.data || error.message
      );
    }
  };

  const handleSaveName = async () => {
    try {
      console.log("Відправка запиту:", { name: newName });
      const response = await axios.patch(
        "/updateUserProfile",
        { name: newName },
        { withCredentials: true }
      );

      console.log("Відповідь сервера:", response.data);

      if (response.data.success) {
        setUser((prevUser) => ({ ...prevUser, name: newName }));
        alert("Ім'я успішно змінено!");
      }
    } catch (error) {
      console.error(
        "Помилка при зміні імені:",
        error.response?.data || error.message
      );
      alert("Не вдалося змінити ім'я.");
    }
  };

  return (
    <div className="backround">
      <Sidebar />
      <div className="settings_container">
        <div className="settings_form">
          <div className="form_inputs">
            <label>Імʼя</label>
            <input
              type="text"
              value={newName}
              onChange={handleNameChange}
              placeholder="Введіть нове ім'я"
            />
            <button
              className="save_btn"
              onClick={handleSaveName}
              disabled={newName.length < 3 || newName === user?.name}
            >
              Зберегти
            </button>

            <div className="time_format">
              <p>Часовий формат</p>
              <label className="custom_radio">
                <input
                  type="radio"
                  name="time"
                  checked={timeFormat === 24}
                  onChange={() => handleTimeFormatChange(24)}
                />
                <span className="radio_mark"></span>
                24-годинний
              </label>
              <label className="custom_radio">
                <input
                  type="radio"
                  name="time"
                  checked={timeFormat === 12}
                  onChange={() => handleTimeFormatChange(12)}
                />
                <span className="radio_mark"></span>
                12-годинний
              </label>
            </div>
          </div>

          <div className="profile_section">
            <img
              className="avatar_large"
              src={
                user?.avatarUrl || require("./../../image/avatarStudent.jpg")
              }
              alt="Avatar"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <div className="user_info_box">
              <h3>Особиста інформація</h3>
              <p>Ім’я: {user?.name || "Невідомо"}</p>
              <p>
                Статус: {user?.role ? translateRole(user.role) : "Невідомо"}
              </p>
              <p>Спеціальність: Інженерія програмного забезпечення</p>
              <p>Курс: 3</p>
              <p>Група: 4</p>
              <p>Підгрупа: 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Функція для перекладу ролей
const translateRole = (role) => {
  switch (role) {
    case "student":
      return "Студент";
    case "teacher":
      return "Викладач";
    case "deanery":
      return "Деканат";
    default:
      return "Роль не визначена";
  }
};

export default Settings;