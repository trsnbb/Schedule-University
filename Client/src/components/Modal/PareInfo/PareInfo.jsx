import React, { useEffect, useRef } from "react";
import "./PareInfo.css";
import { useAuth } from "../../../AuthContext.jsx";

const PareInfo = ({ lesson, position, onClose }) => {
  const modalRef = useRef(null);
  const { user } = useAuth();

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
    if (!time) return "—";
    if (user?.timeFormat === 12) {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    }
    return time;
  };

  const getModalBackground = (type) => {
    if (type === "лекція") return "rgba(3, 105, 161, 0.4)";
    if (type === "практика") return "rgba(109, 40, 217, 0.4)";
    return "rgba(16, 185, 129, 0.4)";
  };

  const getHeaderBackground = (type) => {
    if (type === "лекція") return "#0369A1";
    if (type === "практика") return "#6D28D9";
    return "#1BAF23";
  };

  const normalizedLesson = {
    title: lesson?.predmetId?.predmet || "Без назви",
    type:
      lesson?.type === "prac"
        ? "практика"
        : lesson?.type === "lec"
        ? "лекція"
        : "інше",
    mode: lesson?.format || "—",
    teacher: lesson?.teacherId?.name || "—",
    group: lesson?.group || "—",
    link: lesson?.link || null,
    time: lesson?.time || null,
    teacherNotes: lesson?.teacherNotes || "Немає нотаток від викладача",
    studentNotes: lesson?.studentNotes || "Немає особистих нотаток",
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div
        ref={modalRef}
        className="modal-content-pareinfo"
        style={{
          position: "fixed",
          background: getModalBackground(normalizedLesson.type),
        }}
      >
        <div
          className="modal-header"
          style={{ background: getHeaderBackground(normalizedLesson.type) }}
        >
          {normalizedLesson.title}
        </div>
        <div className="modal-body">
          <div className="modal-row">
            {normalizedLesson.type}
            {normalizedLesson.time && (
              <span className="modal_time">
                {normalizedLesson.time
                  .split("–")
                  .map((t) => formatTime(t.trim()))
                  .join(" – ")}
              </span>
            )}
          </div>

          <div className="modal-row">
            <span className="label">Формат:</span> {normalizedLesson.mode}
          </div>
          
          <div className="modal-row">
            <span className="label">Викладач:</span> {normalizedLesson.teacher}
          </div>
          <div className="modal-row">
            <span className="label">Посилання:</span>{" "}
            {normalizedLesson.link ? (
              <a
                href={normalizedLesson.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fff" }}
              >
                {normalizedLesson.link}
              </a>
            ) : (
              "—"
            )}
          </div>
          <div className="modal-row">
            <span>Нотатки від викладача:</span>
            <div className="teacher-notes">{normalizedLesson.teacherNotes}</div>
          </div>
          <div className="modal-row">
            <span>Мої нотатки:</span>
            <div className="student-notes">{normalizedLesson.studentNotes}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PareInfo;
