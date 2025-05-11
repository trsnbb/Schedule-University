import React, { useEffect, useState } from "react";
import "./calendar.css";
import dzyobik from "./../../image/dzyobik.svg";
import LessonBlock from "./../LessonBlock/LessonBlock.jsx";
import Modal from "../Modal/PareInfo/PareInfo.jsx";
import CreateSchedule from "../Modal/AddShedule/CreateSchedule.jsx"; // Імпорт компонента AddPareModal
import { useAuth } from "../../AuthContext.jsx"; // Імпортуємо контекст авторизації

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
  const { user } = useAuth(); // Отримуємо дані користувача з контексту
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

  const formatTime = (time) => {
    if (user?.timeFormat === 12) {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Перетворюємо 0 на 12
      return `${formattedHours}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;
    }
    return time; // Якщо формат 24-годинний, повертаємо час без змін
  };

  const handleLessonClick = (e, data, index) => {
    if (index === 5) {
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
        <div className='group_calendar'>
          <p className='style_group'>ІПЗ</p>
          <p className='style_group'>3 курс</p>
          <p className='style_group'>4 група</p>
          <p className='style_group'>2 підгрупа</p>
        </div>

        <div className='date_change'>
          <div className='style_group'>
            <img
              src={dzyobik}
              onClick={goToPrevWeek}
              alt='prev'
              style={{ cursor: "pointer" }}
            />
            <p onClick={goToToday} style={{ cursor: "pointer" }}>
              {getMonday().toDateString() === weekStartDate.toDateString()
                ? "Сьогодні"
                : getWeekRangeText(weekStartDate)}
            </p>
            <img
              src={dzyobik}
              alt='next'
              className='flipped'
              onClick={goToNextWeek}
              style={{ cursor: "pointer" }}
            />
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
                  <div key={index} className='cell'>
                    {index === 0 && (
                      <LessonBlock
                        title='Операційні системи'
                        type='Лекція'
                        mode='Онлайн'
                        time={`${formatTime("08:00")} – ${formatTime("09:20")}`}
                        groupInfo={{
                          specialization: "ІПЗ",
                          course: 3,
                          group: 4,
                        }}
                        onClick={(e) =>
                          handleLessonClick(
                            e,
                            {
                              title: "Операційні системи",
                              type: "Лекція",
                              mode: "Онлайн",
                              time: `${formatTime("08:00")} – ${formatTime(
                                "09:20"
                              )}`,
                              teacher: "Петренко Іван",
                              link: "https://meet.google.com/example",
                              teacherNotes:
                                "Виконати лабораторну 1 - 3. Зробити звіт.",
                              studentNotes: "",
                            },
                            0
                          )
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
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

      {isAddPareModalOpen && <CreateSchedule onClose={closeAddPareModal} />}
    </>
  );
};

export default Calendar;
