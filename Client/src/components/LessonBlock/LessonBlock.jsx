import React from "react";
import "./lesson.css";

const LessonBlock = ({ title, type = "Лекція", mode = "Онлайн", time = "08.00 – 09.20", onClick }) => {
  const getTypeClass = (type) => {
    switch (type.toLowerCase()) {
      case "лаб":
      case "лабораторна":
        return "lab";
      case "практика":
        return "practice";
      default:
        return "lecture";
    }
  };

  const typeClass = getTypeClass(type);

  return (
    <div className={`lesson_block ${typeClass}`} onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="lesson_tags">
        <div className={`lesson_tag ${typeClass}`}>{type}</div>
        <div className="lesson_tag green">{mode}</div>
      </div>
      <div className={`lesson_time ${typeClass}`}>{time}</div>
      <div className={`lesson_title ${typeClass}`}>{title}</div>
    </div>
  );
};

export default LessonBlock;
