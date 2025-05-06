import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileMenu.css";
import avatarStudent from "./../../image/avatarStudent.jpg";
import message from "./../../image/message.svg";
import setting from "./../../image/setting-2.svg";
import logOut from "./../../image/Log out.png";

const ProfileMenu = ({ isOpen, onClose, disableAnimation = false }) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/settings");
    onClose(); // закрити меню після переходу
  };

  return (
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
          <button>
            <img className='imgBurger message' src={message} alt='message' />
            Зворотній зв'язок
          </button>
          <line className='lineMenu'></line>
          <button onClick={handleSettingsClick}>
            <img className='imgBurger setting' src={setting} alt='setting' />
            Налаштування
          </button>
          <line className='lineMenu'></line>
          <button>
            <img className='imgBurger logOut' src={logOut} alt='logOut' />
            Вихід
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
