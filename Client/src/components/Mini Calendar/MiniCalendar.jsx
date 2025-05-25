import React, { useState, useEffect } from "react";
import "./mini_calendar.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MiniCalendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [animationDirection, setAnimationDirection] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

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
    isCurrent: false,
  }));

  const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrent: true,
  }));

  const nextDays = Array.from({ length: emptyCellsEnd }, (_, i) => ({
    day: i + 1,
    isCurrent: false,
  }));

  const allDays = [...prevDays, ...currentDays, ...nextDays];

  const changeMonth = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationDirection(direction);
  
    setTimeout(() => {
      setCurrentMonth((prev) => {
        let newMonth = direction === "left" ? prev - 1 : prev + 1;
        if (newMonth < 0) {
          setCurrentYear((y) => y - 1);
          return 11;
        }
        if (newMonth > 11) {
          setCurrentYear((y) => y + 1);
          return 0;
        }
        return newMonth;
      });
      setIsAnimating(false);
      setAnimationDirection("");
    }, 300);
  };
  
  

  const resetToToday = () => {
    const nowMonth = today.getMonth();
    const nowYear = today.getFullYear();
  
    const totalCurrent = currentYear * 12 + currentMonth;
    const totalTarget = nowYear * 12 + nowMonth;
    const diff = totalTarget - totalCurrent;
  
    if (diff === 0) {
      setSelectedDate(today.getDate());
      return;
    }
  
    let step = 0;
    const direction = diff > 0 ? "right" : "left";
    const steps = Math.abs(diff);
  
    const fastAnimationInterval = 60; 
    let animating = false;
  
    const fastInterval = setInterval(() => {
      if (animating) return;
  
      animating = true;
      setAnimationDirection(direction);
      setTimeout(() => {
        setCurrentMonth((prev) => {
          let newMonth = direction === "left" ? prev - 1 : prev + 1;
          if (newMonth < 0) {
            setCurrentYear((y) => y - 1);
            animating = false;
            return 11;
          }
          if (newMonth > 11) {
            setCurrentYear((y) => y + 1);
            animating = false;
            return 0;
          }
          animating = false;
          return newMonth;
        });
      }, 50); 
      step++;
  
      if (step >= steps) {
        clearInterval(fastInterval);
        setTimeout(() => {
          setAnimationDirection("");
          setCurrentMonth(nowMonth);
          setCurrentYear(nowYear);
          setSelectedDate(today.getDate());
        }, 100);
      }
    }, fastAnimationInterval);
  };
  

  return (
    <div className="calendar-container">
      <div className="header">
        <FaChevronLeft className="arrow" onClick={() => changeMonth("left")} />
        <p onClick={resetToToday} style={{ cursor: "pointer" }}>
          {months[currentMonth]} {currentYear}
        </p>
        <FaChevronRight className="arrow" onClick={() => changeMonth("right")} />
      </div>

      <div className="weekdays">
        {["пн", "вт", "ср", "чт", "пт", "сб", "нд"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className={`days slide-${animationDirection}`}>
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
  );
};

export default MiniCalendar;
