import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileMenu.css";
import avatarStudent from "./../../image/avatarStudent.jpg";
import message from "./../../image/message.svg";
import setting from "./../../image/setting-2.svg";
import logOut from "./../../image/Log out.png";
import ExitProfile from "../Modal/ExitProfile/ExitProfile.jsx";

const ProfileMenu = ({ isOpen, onClose, disableAnimation = false }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false); // Стан модального вікна

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

  const handleLogoutClick = () => {
    setLogoutModalOpen(true); // Відкриваємо модалку
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false); // Закриваємо модалку
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
            <img className='avatar' src={avatarStudent} alt='Avatar' />
            <div>
              <h3>Беата Янчов</h3>
              <p className='role'>Учень</p>
            </div>
          </div>
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
        </div>
      </div>

      <ExitProfile isOpen={isLogoutModalOpen} onCancel={handleCancelLogout} />
    </>
  );
};

export default ProfileMenu;
