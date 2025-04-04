import React from "react";
import "./sidebar_style.css";
import MiniCalendar from "./MiniCalendar.jsx";
const Sidebar = () => {
  return (
    <>
      <div className='sidebar_background'>
        <div className='sidebar_mini_kalendar'>
          <MiniCalendar />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
