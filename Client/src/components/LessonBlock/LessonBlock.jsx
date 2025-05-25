import React from "react";
import "./lesson.css";
import { useAuth } from "../../AuthContext.jsx";

const typeLabelMap = {
  lec: "Лекція",
  lab: "Лаб",
  prac: "Практика",
  лекція: "Лекція",
  лабораторна: "Лабораторна",
  практика: "Практика",
  event: "Подія",
};
const getModeClass = (mode) => {
  if (mode?.toLowerCase() === "офлайн" || mode?.toLowerCase() === "offline") {
    return "offline";
  }
  return "green";
};

const getModeLabel = (mode) => {
  const lower = mode?.toLowerCase();
  if (lower === "online" || lower === "онлайн") return "Онлайн";
  if (lower === "offline" || lower === "офлайн") return "Офлайн";
  return mode;
};

const LessonBlock = ({
  title,
  type = "Лекція",
  mode = "Онлайн",
  time = "08.00 – 09.20",
  groupInfo,
  onClick,
  isEvent = false,
  eventTime = "",
}) => {
  const { user } = useAuth(); 

 if (isEvent && user?.user?.eventVision === false) {
    return null;
  }
  const formatTime = (timeStr, format) => {
    if (!timeStr || String(format) == "24") return timeStr;

    const parts = timeStr.split(/–|-/).map((part) => part.trim());

    const to12Hour = (time) => {
      const [hourStr, minute] = time.split(":");
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${ampm}`;
    };

    if (parts.length === 2) {
      return `${to12Hour(parts[0])} – ${to12Hour(parts[1])}`;
    }

    return to12Hour(timeStr);
  };
  const getTypeClass = (type, isEvent) => {
    if (isEvent) return "event";
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
        return "lab";
    }
  };

  const typeClass = getTypeClass(type, isEvent);
  const typeLabel = typeLabelMap[type?.toLowerCase()] || type;
  const modeClass = getModeClass(mode);

  const displayTime =
    isEvent && eventTime ? formatTime(eventTime, user?.user?.timeFormat) : time;

  const renderStudentView = () => (
    <div
      className={`lesson_block ${typeClass}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className='lesson_tags'>
        <div className={`lesson_tag ${typeClass}`}>{typeLabel}</div>
        <div className={`lesson_tag ${modeClass}`}>{getModeLabel(mode)}</div>
      </div>
      <div className={`lesson_time ${typeClass}`}>{displayTime}</div>

      <div className={`lesson_title ${typeClass}`}>
        {title.length > 35 ? title.slice(0, 35) + "..." : title}
      </div>
    </div>
  );

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
      <div className={`lesson_time ${typeClass}`}>{displayTime}</div>

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
      <div className={`lesson_time ${typeClass}`}>{displayTime}</div>

      <div className={`lesson_title ${typeClass}`}>
        {title.length > 35 ? title.slice(0, 35) + "..." : title}
      </div>
    </div>
  );

  if (user?.role === "teacher") {
    return renderTeacherView();
  } else if (user?.role === "deanery") {
    return renderDeaneryView();
  } else {
    return renderStudentView();
  }
};

export default LessonBlock;
