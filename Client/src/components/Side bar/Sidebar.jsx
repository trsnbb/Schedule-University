import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./sidebar_style.css";
import MiniCalendar from "./../Mini Calendar/MiniCalendar.jsx";
import Notes from "./../Notes/Notes.jsx";
import ProfileMenu from "./../Burger/ProfileMenu.jsx";
import { useAuth } from "../../AuthContext.jsx"; // Імпортуємо контекст авторизації
import CreateSchedule from "../Modal/AddShedule/CreateSchedule.jsx";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Додаємо user до деструктуризації
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  useEffect(() => {
    if (
      location.pathname === "/settings" ||
      location.pathname === "/feedback"
    ) {
      setMenuOpen(true);
    }
  }, [location.pathname]);

  const handleCloseMenu = (navigateHome = true) => {
    // Не закриваємо меню, якщо ми вже на сторінці settings або feedback і не хочемо редиректу
    if (
      !navigateHome &&
      (location.pathname === "/settings" || location.pathname === "/feedback")
    ) {
      return;
    }

    setMenuOpen(false);

    if (
      navigateHome &&
      (location.pathname === "/settings" || location.pathname === "/feedback")
    ) {
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
        {isAuthenticated &&
          user &&
          (user.user?.role === "deanery" ? (
            <div className='deanery_buttons'>
              <button className='deanery_btn'>
                Редагувати загальний розклад
              </button>
              <button className='deanery_btn'>
                Переглянути розклад викладача
              </button>
              <button className='deanery_btn'>Експортувати розклад</button>
              <button
                className='deanery_btn'
                onClick={() => setIsCreateScheduleOpen(true)}
              >
                Створити розклад автоматично
              </button>
            </div>
          ) : (
            user.user?.role !== "deanery" && (
              <div className='notes_sidebar'>
                <Notes />
              </div>
            )
          ))}
      </div>

      {/* Додаємо модалку */}
      {isCreateScheduleOpen && (
        <CreateSchedule onClose={() => setIsCreateScheduleOpen(false)} />
      )}

      <ProfileMenu
        isOpen={menuOpen}
        onClose={handleCloseMenu}
        disableAnimation={
          location.pathname === "/settings" || location.pathname === "/feedback"
        }
      />
    </>
  );
};

export default Sidebar;
