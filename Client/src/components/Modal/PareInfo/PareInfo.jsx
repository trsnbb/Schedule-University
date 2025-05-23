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

  const pairTimes = {
    1: "08:30 – 09:50",
    2: "10:00 – 11:20",
    3: "11:40 – 13:00",
    4: "13:30 – 14:50",
    5: "15:00 – 16:20",
    6: "16:30 – 17:50",
    7: "18:00 – 19:20",
  };

  const getTimeFromPairNumber = (number) => {
    const timeRange = pairTimes[number];
    if (!timeRange) return "—";
    const [start, end] = timeRange.split("–").map((t) => t.trim());
    return `${formatTime(start)} – ${formatTime(end)}`;
  };

  const pairNum = Array.isArray(lesson?.pairNumber)
    ? lesson.pairNumber[0]
    : lesson?.pairNumber;

  const normalizedLesson = lesson?.isEvent
    ? {
        title: lesson.eventTitle || "Подія",
        type: "Подія",
        time: getTimeFromPairNumber(pairNum),
        mode: lesson.format || "—",
        link: lesson.link || null,
        descriptionEvent: lesson.descriptionEvent || "Опис відсутній",
      }
    : {
        title: lesson?.predmetId?.predmet || "Без назви",
        type:
          lesson?.type === "prac"
            ? "Практика"
            : lesson?.type === "lec"
            ? "Лекція"
            : lesson?.type === "lab"
            ? "Лабораторна"
            : "Інше",
        time: getTimeFromPairNumber(pairNum),
        mode: lesson?.format || "—",
        teacher: lesson?.teacherId?.name || "—",
        group: lesson?.group || "—",
        link: lesson?.link || null,
        teacherNotes: lesson?.teacherNotes || "Немає нотаток від викладача",
        studentNotes: lesson?.studentNotes || "Немає особистих нотаток",
      };

  const getModalBackground = (type) => {
    if (type === "Лекція") return "rgba(3, 105, 161, 0.4)";
    if (type === "Практика") return "rgba(109, 40, 217, 0.4)";
    if (type === "Подія") return "rgba(191, 189, 41, 0.4)";
    return "rgba(16, 185, 129, 0.4)";
  };

  const getHeaderBackground = (type) => {
    if (type === "Лекція") return "#0369A1";
    if (type === "Практика") return "#6D28D9";
    if (type === "Подія") return "#BFBD29";
    return "#1BAF23";
  };

  return (
    <>
      <div className='modal-overlay' onClick={onClose} />
      <div
        ref={modalRef}
        className='modal-content-pareinfo'
        style={{
          position: "fixed",
          background: getModalBackground(normalizedLesson.type),
        }}
      >
        <div
          className='modal-header'
          style={{ background: getHeaderBackground(normalizedLesson.type) }}
        >
          {normalizedLesson.title}
        </div>
        <div className='modal-body'>
          <div className='modal-row'>
            {normalizedLesson.type}
            <span className='modal_time'>{normalizedLesson.time}</span>
          </div>

          <div className='modal-row'>
            <span className='label'>Формат:</span> {normalizedLesson.mode}
          </div>

          <div className='modal-row'>
            <span className='label'>Посилання:</span>{" "}
            {normalizedLesson.link ? (
              <a
                href={normalizedLesson.link}
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: "#fff" }}
              >
                {normalizedLesson.link}
              </a>
            ) : (
              "—"
            )}
          </div>

          {lesson?.isEvent ? (
            <div className='modal-row'>
              <span>Опис:</span>
              <div className='teacher-notes'>{normalizedLesson.descriptionEvent}</div>
            </div>
          ) : (
            <>
              <div className='modal-row'>
                <span className='label'>Викладач:</span> {normalizedLesson.teacher}
              </div>
              <div className='modal-row'>
                <span>Нотатки від викладача:</span>
                <div className='teacher-notes'>{normalizedLesson.teacherNotes}</div>
              </div>
              <div className='modal-row'>
                <span>Мої нотатки:</span>
                <div className='student-notes'>{normalizedLesson.studentNotes}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PareInfo;
