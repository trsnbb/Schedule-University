import React, { useState, useEffect } from "react";
import "./../../layouts/backround.css";
import Sidebar from "./../../components/Side bar/Sidebar.jsx";
import "./settings.css";
import { useAuth } from "../../AuthContext.jsx";
import axios from "./../../axios.js";
import ExitProfile from "../../components/Modal/ExitProfile/ExitProfile.jsx";


const Settings = () => {
  const { user, setUser } = useAuth();
  const [newName, setNewName] = useState(user?.user?.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [timeFormat, setTimeFormat] = useState(user?.user?.timeFormat || 24);
  const [eventVision, setEventVision] = useState(
    user?.user?.eventVision || true
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    if (user?.user) {
      setTimeFormat(user.user.timeFormat);
      setEventVision(user.user.eventVision);
    }
  }, [user]);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleTimeFormatChange = async (format) => {
    setTimeFormat(format);
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
          user: {
            ...prevUser.user,
            timeFormat: format,
          },
        }));
      }
    } catch (error) {
      console.error(
        "Помилка при оновленні формату часу:",
        error.response?.data || error.message
      );
      alert("Не вдалося оновити формат часу.");
    }
  };

  const handleEventVisionChange = async () => {
    const newEventVision = !eventVision; // Перемикаємо значення
    setEventVision(newEventVision); // Оновлюємо локальний стан
    try {
      const response = await axios.patch(
        "/updateUserProfile",
        { eventVision: newEventVision },
        { withCredentials: true }
      );

      console.log("Відображення подій оновлено:", response.data);

      if (response.data.success) {
        setUser((prevUser) => ({
          ...prevUser,
          user: {
            ...prevUser.user,
            eventVision: newEventVision,
          },
        }));
      }
    } catch (error) {
      console.error(
        "Помилка при оновленні відображення подій:",
        error.response?.data || error.message
      );
      alert("Не вдалося оновити відображення подій.");
    }
  };

  const handleSaveName = async () => {
    try {
      console.log("Відправка запиту:", { name: newName });
      setIsSaving(true);
      const response = await axios.patch(
        "/updateUserProfile",
        { name: newName },
        { withCredentials: true }
      );

      console.log("Відповідь сервера:", response.data);

      if (response.data.success) {
        setUser((prevUser) => ({
          ...prevUser,
          user: {
            ...prevUser.user,
            name: newName,
          },
        }));
        alert("Ім'я успішно змінено!");
        return;
      }

      throw new Error("Сервер не повернув успішний статус");
    } catch (error) {
      console.error(
        "Помилка при зміні імені:",
        error.response?.data || error.message
      );

      if (error.response?.status && error.response.status !== 200) {
        alert("Не вдалося змінити ім'я.");
      }
    } finally {
      setIsSaving(false);
    }
  };
 const handleDeleteAccount = async () => {
    try {
      await axios.delete("/deleteUser");
      alert("Ваш профіль було успішно видалено.");
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Помилка при видаленні профілю:", error.response?.data || error.message);
      alert("Не вдалося видалити профіль.");
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  const handleModalConfirm = () => {
    if (modalType === "delete") {
      handleDeleteAccount();
    }
    closeModal();
  };

  const handleReportIssue = () => {
    alert("Функціонал повідомлення про помилку ще не реалізовано.");
  };

  return (
    <div className='backround'>
      <Sidebar />
      <div className='settings_container'>
        <div className='settings_form'>
          <div className='form_inputs'>
            <label>Імʼя</label>
            <input
              type='text'
              value={newName}
              onChange={handleNameChange}
              placeholder="Введіть нове ім'я"
            />
            <button
              className='save_btn'
              onClick={handleSaveName}
              disabled={
                isSaving || newName.length < 3 || newName === user?.user?.name
              }
            >
              {isSaving ? "Збереження..." : "Зберегти"}
            </button>

            <div className='time_format'>
              <p>Часовий формат</p>
              <label className='custom_radio'>
                <input
                  type='radio'
                  name='time'
                  checked={user?.user?.timeFormat === 24}
                  onChange={() => handleTimeFormatChange(24)}
                />
                <span className='radio_mark'></span>
                24-годинний
              </label>
              <label className='custom_radio'>
                <input
                  type='radio'
                  name='time'
                  checked={user?.user?.timeFormat === 12}
                  onChange={() => handleTimeFormatChange(12)}
                />
                <span className='radio_mark'></span>
                12-годинний
              </label>
            </div>
            <label className='custom_checkbox'>
              <input
                type='checkbox'
                checked={eventVision} // Відображаємо стан
                onChange={handleEventVisionChange} // Викликаємо обробник
              />
              <span className='checkmark'></span>
              Відображати події від деканату
            </label>
           <button
              className="delete_btn"
              onClick={() => openModal("delete")}
            >
              Видалити аккаунт
            </button>
            <button className='report_btn' onClick={handleReportIssue}>
              Повідомити про помилку
            </button>
          </div>
            <ExitProfile
        isOpen={isModalOpen}
        onConfirm={handleModalConfirm}
        onCancel={closeModal}
        modalType={modalType}
      />
          <div className='profile_section'>
            <img
              className='avatar_large'
              src={
                user?.user?.avatarUrl ||
                require("./../../image/avatarStudent.jpg")
              }
              alt='Avatar'
              crossOrigin='anonymous'
              referrerPolicy='no-referrer'
            />
            <div className='user_info_box'>
              <h3>Особиста інформація</h3>
              <p>Ім’я: {user?.user?.name || "Невідомо"}</p>
              <p>
                Статус:{" "}
                {user?.user?.role ? translateRole(user.user.role) : "Невідомо"}
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
