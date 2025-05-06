import React, { useEffect, useState } from "react";
import "./calendar.css";
import dzyobik from "./../../image/dzyobik.svg";
import LessonBlock from "./../LessonBlock/LessonBlock.jsx";
import Modal from "../Modal/PareInfo/PareInfo.jsx";
import AddPare from "./../Modal/AddPare/AddPare.jsx"; // Імпорт компонента AddPareModal

const getMonday = (date = new Date()) => {
  const currentDay = date.getDay();
  const diffToMonday = (currentDay + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diffToMonday);
  return monday;
};

const getWeekDays = (startDate) => {
  const today = new Date();
  const dayNames = ["пн", "вт", "ср", "чт", "пт", "сб"];
  const days = [];

  for (let i = 0; i < 6; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
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

const getWeekRangeText = (monday) => {
  const start = new Date(monday);
  const end = new Date(monday);
  end.setDate(start.getDate() + 5);

  const format = (d) =>
    `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

  return `${format(start)}–${format(end)}`;
};

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
  const [weekStartDate, setWeekStartDate] = useState(getMonday());
  const [days, setDays] = useState(getWeekDays(getMonday()));
  const [modalData, setModalData] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isAddPareModalOpen, setAddPareModalOpen] = useState(false); // Додано стан для відкриття AddPareModal

  useEffect(() => {
    setDays(getWeekDays(weekStartDate));
  }, [weekStartDate]);

  const goToToday = () => setWeekStartDate(getMonday(new Date()));
  const goToPrevWeek = () => {
    const prev = new Date(weekStartDate);
    prev.setDate(prev.getDate() - 7);
    setWeekStartDate(prev);
  };
  const goToNextWeek = () => {
    const next = new Date(weekStartDate);
    next.setDate(next.getDate() + 7);
    setWeekStartDate(next);
  };

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
    const interval = setInterval(checkLessonTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLessonClick = (e, data, index) => {
    if (index === 5) { // Перевіряємо, чи натиснута шоста клітинка (index 5)
      setAddPareModalOpen(true); // Відкриваємо модальне вікно AddPare
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const modalWidth = 320;
      const screenWidth = window.innerWidth;

      let left = rect.right + 10;
      if (rect.right + modalWidth > screenWidth) {
        left = rect.left - modalWidth - 10;
      }

      setModalPosition({
        top: rect.top + rect.height / 2,
        left,
      });

      setModalData(data);
    }
  };

  const closeAddPareModal = () => {
    setAddPareModalOpen(false); // Закриваємо модальне вікно AddPare
  };

  return (
    <>
      <div className='header_calendar'>
        {/* Попередній код */}
      </div>

      <div className='calendar'>
        <div className='calendar_container'>
          {/* Дні тижня та інші елементи */}
          <div className='calendar_grid'>
            <div className='grid'>
              {Array.from({ length: 30 }).map((_, index) => (
                <div key={index} className='cell'>
                  {index === 0 && (
                    <LessonBlock
                      title='Операційні системи'
                      type='Лекція'
                      mode='Онлайн'
                      time='08:00 – 09:20'
                      onClick={(e) =>
                        handleLessonClick(e, {
                          title: "Операційні системи",
                          type: "Лекція",
                          mode: "Онлайн",
                          time: "08:00 – 09:20",
                          teacher: "Петренко Іван",
                          link: "https://meet.google.com/example",
                          teacherNotes: "Виконати лабораторну 1 - 3. Зробити звіт.",
                          studentNotes: "",
                        }, 0) // додано індекс 0
                      }
                    />
                  )}
                  {index === 14 && (
                    <LessonBlock
                      title='Бази даних'
                      type='Лаб'
                      mode='Онлайн'
                      time='08:00 – 09:20'
                      onClick={(e) =>
                        handleLessonClick(e, {
                          title: "Бази даних",
                          type: "Лабораторна робота",
                          mode: "Онлайн",
                          time: "08:00 – 09:20",
                          teacher: "Нелюбов Володимир Олександрович",
                          link: "https://meet.google.com/example",
                          teacherNotes: "Виконати лабораторну 1 - 3. Зробити звіт.",
                          studentNotes: "",
                        }, 14) // додано індекс 14
                      }
                    />
                  )}
                  {index === 5 && ( // Перевірка на шосту клітинку
                    <LessonBlock
                      title="Додати пару"
                      type="Нова пара"
                      mode="Не визначено"
                      time="Не визначено"
                      onClick={(e) => handleLessonClick(e, {}, 5)} // Викликаємо для шостої клітинки
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalData && (
        <Modal
          data={modalData}
          position={modalPosition}
          onClose={() => setModalData(null)}
        />
      )}

      {isAddPareModalOpen && (
        <AddPare onClose={closeAddPareModal} />
      )}
    </>
  );
};

export default Calendar;