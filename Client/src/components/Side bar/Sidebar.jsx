import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./sidebar_style.css";
import MiniCalendar from "./../Mini Calendar/MiniCalendar.jsx";
import Notes from "./../Notes/Notes.jsx";
import ProfileMenu from "./../Burger/ProfileMenu.jsx";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/settings") {
      setMenuOpen(true);
    }
  }, [location.pathname]);

  const handleCloseMenu = () => {
    setMenuOpen(false);

    if (location.pathname === "/settings") {
      navigate("/");
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <div className='sidebar_background'>
        <div className='burger_wrapper'>
          <div className='burger_icon' onClick={toggleMenu}>
            <div className='line'></div>
            <div className='line'></div>
            <div className='line'></div>
          </div>
        </div>

        <div className='sidebar_mini_kalendar'>
          <MiniCalendar />
        </div>
        <div className='notes_sidebar'>
          <Notes />
        </div>
      </div>

      <ProfileMenu
        isOpen={menuOpen}
        onClose={handleCloseMenu}
        disableAnimation={location.pathname === "/settings"}
      />
    </>
  );
};

export default Sidebar;
