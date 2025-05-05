import React, { useState } from "react";
import "./mini_calendar.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MiniCalendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [animationDirection, setAnimationDirection] = useState(""); // 👈

  const months = [
    "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень",
  ];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );

  const emptyCellsStart = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const totalCells = emptyCellsStart + daysInMonth;
  const emptyCellsEnd = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;
  const prevMonthLabel = months[prevMonthIndex];
  const nextMonthLabel = months[nextMonthIndex];

  const prevDays = Array.from({ length: emptyCellsStart }, (_, i) => ({
    day: prevMonthDays - emptyCellsStart + i + 1,
    month: prevMonthLabel,
    year: prevMonthYear,
    isCurrent: false,
  }));

  const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    month: months[currentMonth],
    year: currentYear,
    isCurrent: true,
  }));

  const nextDays = Array.from({ length: emptyCellsEnd }, (_, i) => ({
    day: i + 1,
    month: nextMonthLabel,
    year: nextMonthYear,
    isCurrent: false,
  }));

  const allDays = [...prevDays, ...currentDays, ...nextDays];

  const handleMonthChange = (direction) => {
    setAnimationDirection(direction);
    setTimeout(() => {
      if (direction === "left") {
        setCurrentMonth((prev) => {
          if (prev === 0) {
            setCurrentYear((year) => year - 1);
            return 11;
          }
          return prev - 1;
        });
      } else {
        setCurrentMonth((prev) => {
          if (prev === 11) {
            setCurrentYear((year) => year + 1);
            return 0;
          }
          return prev + 1;
        });
      }
      setAnimationDirection("");
    }, 200); // Duration of animation
  };

  const resetToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today.getDate());
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <FaChevronLeft className="arrow" onClick={() => handleMonthChange("left")} />
        <p onClick={resetToToday}>
          {months[currentMonth]} {currentYear}
        </p>
        <FaChevronRight className="arrow" onClick={() => handleMonthChange("right")} />
      </div>
      <div className={`day_grid animated ${animationDirection}`}>
        <div className="weekdays">
          {["пн", "вт", "ср", "чт", "пт", "сб", "нд"].map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="days">
          {allDays.map(({ day, isCurrent }, i) => (
            <div
              key={i}
              className={`day ${isCurrent ? "" : "gray"} ${
                day === selectedDate &&
                isCurrent &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear()
                  ? "selected"
                  : ""
              }`}
              onClick={() => isCurrent && setSelectedDate(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
