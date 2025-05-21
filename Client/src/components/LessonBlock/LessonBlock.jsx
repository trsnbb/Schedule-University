import React from "react";
import "./lesson.css";
import { useAuth } from "../../AuthContext.jsx"; // Імпортуємо контекст авторизації

// Мапа для відображення українських назв
const typeLabelMap = {
  lec: "Лекція",
  lab: "Лабораторна",
  prac: "Практика",
  лекція: "Лекція",
  лабораторна: "Лабораторна",
  практика: "Практика",
};
const getModeClass = (mode) => {
  if (mode?.toLowerCase() === "офлайн" || mode?.toLowerCase() === "offline") {
    return "offline";
  }
  return "green";
};
const LessonBlock = ({
  title,
  type = "Лекція",
  mode = "Онлайн",
  time = "08.00 – 09.20",
  groupInfo,
  onClick,
}) => {
  const { user } = useAuth(); // Отримуємо роль користувача

  // Визначаємо клас для кольору
  const getTypeClass = (type) => {
    switch (type?.toLowerCase()) {
      case "lec":
      case "лекція":
        return "lec";
      case "lab":
      case "лабораторна":
      case "лаб":
        return "lab";
      case "prac":
      case "практика":
        return "prac";
      default:
        return "lec";
    }
  };

  const typeClass = getTypeClass(type);
  const typeLabel = typeLabelMap[type?.toLowerCase()] || type;
  const modeClass = getModeClass(mode);
  // Рендеринг для студента
  const renderStudentView = () => (
    <div
      className={`lesson_block ${typeClass}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className='lesson_tags'>
        <div className={`lesson_tag ${typeClass}`}>{typeLabel}</div>
        <div className={`lesson_tag ${modeClass}`}>{mode}</div>
      </div>
      <div className={`lesson_time ${typeClass}`}>{time}</div>
      <div className={`lesson_title ${typeClass}`}>
        {title.length > 35 ? title.slice(0, 35) + "..." : title}
      </div>
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
        <div className={`lesson_tag ${typeClass}`}>{typeLabel}</div>
        <div className={`lesson_tag ${modeClass}`}>{mode}</div>
      </div>
      <div className={`lesson_time ${typeClass}`}>{time}</div>
      <div className={`lesson_title ${typeClass}`}>
        {title.length > 35 ? title.slice(0, 35) + "..." : title}
      </div>
    </div>
  );
  const renderDeaneryView = () => (
    <div
      className={`lesson_block ${typeClass}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className='lesson_tags'>
        <div className={`lesson_tag ${typeClass}`}>{typeLabel}</div>
        <div className={`lesson_tag ${modeClass}`}>{mode}</div>
      </div>
      <div className={`lesson_time ${typeClass}`}>{time}</div>
      <div className={`lesson_title ${typeClass}`}>
        {title.length > 35 ? title.slice(0, 35) + "..." : title}
      </div>
    </div>
  );

  // Умовний рендеринг залежно від ролі
  if (user?.role === "teacher") {
    return renderTeacherView();
  } else if (user?.role === "deanery") {
    return renderDeaneryView();
  } else {
    return renderStudentView(); // За замовчуванням для студента
  }
};

export default LessonBlock;
