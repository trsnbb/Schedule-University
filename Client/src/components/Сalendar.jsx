import React, { useEffect, useState } from "react";
import "./calendar.css";
import dzyobik from "./../image/dzyobik.svg";

const getWeekDays = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const diffToMonday = (currentDay + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  const dayNames = ["пн", "вт", "ср", "чт", "пт", "сб"];
  const days = [];

  for (let i = 0; i < 6; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    days.push({
      number: day.getDate().toString(),
      name: dayNames[i],
      isToday:
        day.getDate() === today.getDate() &&
        day.getMonth() === today.getMonth() &&
        day.getFullYear() === today.getFullYear(),
    });
  }

  return days;
};

// Розклад пар
const lessonsSchedule = [
  { start: "08:00", end: "09:20" },
  { start: "09:40", end: "11:00" },
  { start: "11:20", end: "12:40" },
  { start: "13:00", end: "14:20" },
  { start: "14:40", end: "16:00" },
];

const Calendar = () => {
  const [lessonStatus, setLessonStatus] = useState({
    current: null,
    next: null,
  });
  const days = getWeekDays();

  useEffect(() => {
    const checkLessonTime = () => {
      const now = new Date().toLocaleTimeString("uk-UA", {
        timeZone: "Europe/Kyiv",
        hour12: false,
      });
      const [nowHours, nowMinutes] = now.split(":").map(Number);
      const nowMinutesTotal = nowHours * 60 + nowMinutes;

      let current = null;
      let next = null;

      for (let i = 0; i < lessonsSchedule.length; i++) {
        const start = lessonsSchedule[i].start.split(":").map(Number);
        const end = lessonsSchedule[i].end.split(":").map(Number);

        const startMinutes = start[0] * 60 + start[1];
        const endMinutes = end[0] * 60 + end[1];

        if (nowMinutesTotal >= startMinutes && nowMinutesTotal <= endMinutes) {
          current = i;
          break;
        }

        if (
          i < lessonsSchedule.length - 1 &&
          nowMinutesTotal > endMinutes &&
          nowMinutesTotal <
            lessonsSchedule[i + 1].start.split(":").map(Number)[0] * 60 +
              lessonsSchedule[i + 1].start.split(":").map(Number)[1]
        ) {
          next = i + 1;
          break;
        }
      }

      setLessonStatus({ current, next });
    };

    checkLessonTime();
    const interval = setInterval(checkLessonTime, 30000); // оновлюємо кожні 30 сек
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className='header_calendar'>
        <div className='group_calendar'>
          <p className='style_group'>ІПЗ</p>
          <p className='style_group'>3 курс</p>
          <p className='style_group'>4 група</p>
          <p className='style_group'>2 підгрупа</p>
        </div>
        <div className='date_change'>
          <div className='style_group '>
            <img src={dzyobik} alt='dzyobik'></img>
            <p>Сьогодні</p>
            <img src={dzyobik} alt='dzyobik' className='flipped'></img>
          </div>
        </div>
      </div>

      <div className='calendar'>
        <div className='calendar_container'>
          <div className='days_wrapper'>
            <div className='count_day'>
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`day_cell ${day.isToday ? "today" : "not-today"}`}
                >
                  <div className='day_number'>{day.number}</div>
                  <div className='day_name'>{day.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className='schedule_wrapper'>
            <div className='count_lesson'>
              {["1 пара", "2 пара", "3 пара", "4 пара", "5 пара"].map(
                (text, index) => {
                  let lessonClass = "lesson_number";
                  if (lessonStatus.current === index) {
                    lessonClass += " active-lesson";
                  } else if (lessonStatus.next === index) {
                    lessonClass += " next-lesson";
                  }

                  return (
                    <div key={index} className={lessonClass}>
                      {text}
                    </div>
                  );
                }
              )}
            </div>

            <div className='calendar_grid'>
              <div className='grid'>
                {Array.from({ length: 30 }).map((_, index) => (
                  <div key={index} className='cell'></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
