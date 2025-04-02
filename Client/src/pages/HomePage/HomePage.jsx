import React from "react";
import "./../../layouts/backround.css";
import Sidebar from "./../../components/Sidebar.jsx";
import Calendar from "././../../components/Сalendar.jsx";
import "./../../layouts/home_style.css";

const HomePage = () => {
  return (
    <div className='backround'>
      <Sidebar />
      <div className='main_content'>
        VVVVV
        <div className='calendar_container'>
          
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
