import React from "react";
import "./sidebar_style.css";
import MiniCalendar from "./../Mini Calendar/MiniCalendar.jsx";
import Notes from "./../Notes/Notes.jsx";
const Sidebar = () => {
  return (
    <>
      <div className='sidebar_background'>
        <div className='sidebar_mini_kalendar'>
          <MiniCalendar />
        </div>
        <div className='notes_sidebar'>
          <Notes />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
