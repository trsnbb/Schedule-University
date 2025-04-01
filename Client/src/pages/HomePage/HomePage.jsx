import React from "react";
import "./../../layouts/backround.css";
import Sidebar from "./../../components/Sidebar.jsx";
import Calendar from "./../../components/Сalendar.jsx";

const HomePage = () => {
  return (
    <>
      <div className='backround'>
        <Sidebar />
        <div className="calendar_container">
        </div>

        
      </div>
    </>
  );
};

export default HomePage;
