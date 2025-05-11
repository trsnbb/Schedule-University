import React from "react";
import "./lesson.css";
import { useAuth } from "../../AuthContext.jsx"; // Імпортуємо контекст авторизації

const LessonBlock = ({
  title,
  type = "Лекція",
  mode = "Онлайн",
  time = "08.00 – 09.20",
  groupInfo,
  onClick,
}) => {
  const { user } = useAuth(); // Отримуємо роль користувача

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

  // Рендеринг для студента
  const renderStudentView = () => (
    <div
      className={`lesson_block ${typeClass}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className='lesson_tags'>
        <div className={`lesson_tag ${typeClass}`}>{type}</div>
        <div className='lesson_tag green'>{mode}</div>
      </div>
      <div className={`lesson_time ${typeClass}`}>{time}</div>
      <div className={`lesson_title ${typeClass}`}>{title}</div>
    </div>
  );

  // Рендеринг для викладача
  const renderTeacherView = () => (
    <div
      className={`lesson_block teacher_view ${typeClass}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={`lesson_group ${typeClass}`}>
        {groupInfo?.specialization} {groupInfo?.course} курс {groupInfo?.group}{" "}
        група
      </div>
      <div className='lesson_tags'>
        <div className={`lesson_tag ${typeClass}`}>{type}</div>
        <div className='lesson_tag green'>{mode}</div>
      </div>
      <div className={`lesson_time ${typeClass}`}>{time}</div>
      <div className={`lesson_title ${typeClass}`}>{title}</div>
    </div>
  );

  // Умовний рендеринг залежно від ролі
  if (user?.role === "teacher") {
    return renderTeacherView();
  } else {
    return renderStudentView(); // За замовчуванням для студента
  }
};

export default LessonBlock;
