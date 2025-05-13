import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileMenu.css";
import avatarPlaceholder from "./../../image/User-avatar.png"; // Дефолтний аватар
import message from "./../../image/message.svg";
import setting from "./../../image/setting-2.svg";
import logOut from "./../../image/Log out.png";
import ExitProfile from "../Modal/ExitProfile/ExitProfile.jsx";
import { logout } from "../../axios.js";
import { useAuth } from "../../AuthContext.jsx"; // Імпортуємо контекст авторизації

const ProfileMenu = ({ isOpen, onClose, disableAnimation = false }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user } = useAuth();
  const userData = user?.user; // Отримуємо вкладений об'єкт user
  console.log("Дані користувача в ProfileMenu:", user); // Логування даних користувача
  const handleSettingsClick = () => {
    if (window.location.pathname !== "/settings") {
      navigate("/settings");
    }
    onClose(false);
  };

  const handleFeedbackClick = () => {
    if (window.location.pathname !== "/feedback") {
      navigate("/feedback");
    }
    onClose(false);
  };

  const handleLogoutClick = async () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
      setLogoutModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Помилка при виході:", error);
    }
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
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

  return (
    <>
      <div
        className={`profile_menu_overlay ${isOpen ? "open" : ""} ${
          disableAnimation ? "no_animation" : ""
        }`}
      >
        <div className='profile_menu_content'>
          <button className='close_button' onClick={onClose}>
            ×
          </button>
          <div className='profile_info'>
            <img
              className='avatar'
              src={
                userData?.avatarUrl
                  ? `${userData?.avatarUrl}?sz=200`
                  : avatarPlaceholder
              }
              alt='Avatar'
              crossOrigin='anonymous'
              referrerPolicy='no-referrer'
            />

            <div>
              <h3>
                {userData?.name
                  ? (() => {
                      const nameParts = userData?.name.split(" ");
                      return nameParts.length > 1
                        ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}` // Беремо перше і останнє слово
                        : nameParts[0];
                    })()
                  : "Гість"}
              </h3>
              <p className='role'>{translateRole(userData?.role)}</p>
            </div>
          </div>
           {userData && (
          <div className='menu_items'>
            <button className='button_menu' onClick={handleFeedbackClick}>
              <img className='imgBurger message' src={message} alt='message' />
              Зворотній зв'язок
            </button>
            <line className='lineMenu'></line>
            <button className='button_menu' onClick={handleSettingsClick}>
              <img className='imgBurger setting' src={setting} alt='setting' />
              Налаштування
            </button>
            <line className='lineMenu'></line>
            <button className='button_menu' onClick={handleLogoutClick}>
              <img className='imgBurger logOut' src={logOut} alt='logOut' />
              Вихід
            </button>
          </div>
        )}
      </div>
    </div>

      <ExitProfile
        isOpen={isLogoutModalOpen}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default ProfileMenu;
