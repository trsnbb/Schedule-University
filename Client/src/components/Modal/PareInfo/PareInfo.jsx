import React, { useEffect, useRef } from "react";
import "./PareInfo.css";
import { useAuth } from "../../../AuthContext.jsx"; // Імпортуємо контекст авторизації

const PareInfo = ({ data, position, onClose }) => {
  const modalRef = useRef(null);
  const { user } = useAuth(); // Отримуємо дані користувача з контексту

  useEffect(() => {
    if (modalRef.current) {
      const modal = modalRef.current;
      const modalRect = modal.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const clickedElementHeight = 30;

      let top = position.top;
      let left = position.left;

      const spaceBelow = viewportHeight - position.top - clickedElementHeight;
      const spaceAbove = position.top;

      if (spaceBelow >= modalRect.height + 10) {
        top = position.top + clickedElementHeight + 10;
      } else if (spaceAbove >= modalRect.height + 10) {
        top = position.top - modalRect.height - 10;
      } else {
        top = Math.max(
          10,
          Math.min(viewportHeight - modalRect.height - 10, position.top)
        );
      }

      if (position.left + modalRect.width > viewportWidth - 10) {
        left = position.left - modalRect.width - 10;
      }

      if (left < 10) {
        left = 10;
      }

      modal.style.top = `${top}px`;
      modal.style.left = `${left}px`;
    }
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const formatTime = (time) => {
    if (user?.timeFormat === 12) {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Перетворюємо 0 на 12
      return `${formattedHours}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;
    }
    return time; // Якщо формат 24-годинний, повертаємо час без змін
  };

  const getModalBackground = () => {
    const type = data?.type?.toLowerCase();
    if (type === "лекція") return "rgba(3, 105, 161, 0.4)";
    if (type === "практика") return "rgba(109, 40, 217, 0.4)";
    return "rgba(16, 185, 129, 0.4)"; // дефолтний варіант
  };

  const getHeaderBackground = () => {
    const type = data?.type?.toLowerCase();
    if (type === "лекція") return "#0369A1"; // для лекції
    if (type === "практика") return "#6D28D9"; // для практики
    return "#1BAF23"; // дефолтний варіант
  };

  return (
    <>
      <div className='modal-overlay' onClick={onClose} />
      <div
        ref={modalRef}
        className='modal-content'
        style={{
          position: "fixed",
          background: getModalBackground(),
        }}
      >
        <div
          className='modal-header'
          style={{ background: getHeaderBackground() }}
        >
          {data?.title || "Без назви"}
        </div>
        <div className='modal-body'>
          {data?.type && (
            <div className='modal-row'>
              {data.type}
              {data.time && (
                <span className='modal_time'>
                  {data.time
                    .split("–")
                    .map((t) => formatTime(t.trim()))
                    .join(" – ")}
                </span>
              )}
            </div>
          )}
          {data?.mode && (
            <div className='modal-row'>
              <span className='label'>Формат:</span> {data.mode}
            </div>
          )}
          {data?.group && (
            <div className='modal-row'>
              <span className='label'>Група:</span> {data.group}
            </div>
          )}
          {data?.teacher && (
            <div className='modal-row'>
              <span className='label'>Викладач:</span> {data.teacher}
            </div>
          )}
          {data?.link && (
            <div className='modal-row'>
              <span className='label'>Посилання:</span>
              <a
                href={data.link}
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: "#fff" }}
              >
                {data.link}
              </a>
            </div>
          )}
          {data?.teacherNotes && (
            <>
              <span>Нотатки від викладача:</span>
              <div className='teacher-notes'>{data.teacherNotes}</div>
            </>
          )}
          {data?.studentNotes && (
            <>
              <span>Мої нотатки:</span>
              <div className='student-notes'>{data.studentNotes}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PareInfo;