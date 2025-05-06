import React from "react";
import "./../../layouts/backround.css";
import Sidebar from "./../../components/Side bar/Sidebar.jsx";
import "./settings.css"; // створимо окремий CSS файл для стилів

const Settings = () => {
  return (
    <div className='backround'>
      <Sidebar />
      <div className='settings_container'>
        <div className='settings_form'>
          <div className='form_inputs'>
            <label>Імʼя</label>
            <input type='text' />
            <label>Пароль</label>
            <input type='password' />
            <input type='password' />

            <div className='time_format'>
              <p>Часовий формат</p>
              <label className='custom_radio'>
                <input type='radio' name='time' defaultChecked />
                <span className='radio_mark'></span>
                24-годинний
              </label>
              <label className='custom_radio'>
                <input type='radio' name='time' />
                <span className='radio_mark'></span>
                12-годинний
              </label>
            </div>

            <label className='custom_checkbox'>
              <input type='checkbox' defaultChecked />
              <span className='checkmark'></span>
              Відображати події від деканату
            </label>

            <button className='delete_btn'>Видалити аккаунт</button>
            <button className='report_btn'>Повідомити про помилку</button>
          </div>

          <div className='profile_section'>
            <img
              className='avatar_large'
              src={require("./../../image/avatarStudent.jpg")}
              alt='Avatar'
            />
            <button className='change_avatar_btn'>Змінити аватар</button>
            <div className='user_info_box'>
              <h3>Особиста інформація</h3>
              <p>Ім’я: Янчов Беата</p>
              <p>Статус: Учень</p>
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

export default Settings;
