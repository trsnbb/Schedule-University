import React, { useEffect, useState } from "react";
import "./calendar.css";
import dzyobik from "./../../image/dzyobik.svg";
import LessonBlock from "./../LessonBlock/LessonBlock.jsx";
import PareInfo from "../Modal/PareInfo/PareInfo.jsx";
import CreateSchedule from "../Modal/AddShedule/CreateSchedule.jsx"; 
import { useAuth } from "../../AuthContext.jsx";
import { fetchSchedule } from "./../../axios.js";
import { useRef } from "react";
import AddPare from "../Modal/AddPare/AddPare.jsx";
import ChooseType from "../Modal/AddPare/ChooseType.jsx";
import AddEvent from "../Modal/AddPare/AddEvent.jsx";
import SelectGroupForm from "./SelectGroupForm.jsx";
import axios from "axios";
import CustomDropdown from "../CustomDropdown/CustomDropdown.jsx";

const firstShiftSchedule = [
  { start: "08:00", end: "09:20" },
  { start: "09:40", end: "11:00" },
  { start: "11:20", end: "12:40" },
  { start: "13:00", end: "14:20" },
  { start: "14:40", end: "16:00" },
];

const secondShiftSchedule = [
  { start: "13:00", end: "14:20" },
  { start: "14:40", end: "16:00" },
  { start: "16:20", end: "17:40" },
  { start: "18:00", end: "19:20" },
  { start: "19:40", end: "21:00" },
];

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

const Calendar = () => {
  const { user } = useAuth(); 
  const [hoveredCell, setHoveredCell] = useState(null);
  const [lessonStatus, setLessonStatus] = useState({
    current: null,
    next: null,
  });
  const [weekStartDate, setWeekStartDate] = useState(getMonday());
  const [days, setDays] = useState(getWeekDays(getMonday()));
  const [modalData, setModalData] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const [isAddPareModalOpen, setAddPareModalOpen] = useState(false);
  const [isChooseTypeOpen, setChooseTypeOpen] = useState(false);
  const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [shift, setShift] = useState(null);
  const [selectedShift, setSelectedShift] = useState("1");

  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupChange = (groupData) => {
    setSelectedGroup(groupData);
  };
  useEffect(() => {
    loadSchedule();
  }, [selectedGroup, weekStartDate, selectedShift]);

  const [schedule, setSchedule] = useState([]); 

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

  const formatTime = (timeStr, format) => {
    if (format === 24) return timeStr;

    const [hourStr, minute] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM " : "AM ";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  };

  const closeAddPareModal = () => {
    setAddPareModalOpen(false);
  };
  const closeAddEventModal = () => setAddEventModalOpen(false);

  const handleLessonClick = (e, lesson) => {
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

    setModalData(lesson);
  };
  const lessonsSchedule =
    user?.user?.role === "teacher"
      ? selectedShift === "1"
        ? firstShiftSchedule
        : secondShiftSchedule
      : shift === "1"
      ? firstShiftSchedule
      : secondShiftSchedule;

  const handleChooseType = (type) => {
    setChooseTypeOpen(false);
    if (type === "lesson") {
      setAddPareModalOpen(true);
    }
    if (type === "event") {
      setAddEventModalOpen(true);
    }
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
  const loadSchedule = async () => {
    try {
      const monday = new Date(weekStartDate);
      const sunday = new Date(weekStartDate);
      sunday.setDate(monday.getDate() + 6);

      if (user?.user?.role === "teacher") {
        if (user?.user?.role === "teacher") {
          const teacherId = user.user._id;
          const formattedDate = monday.toISOString().split("T")[0];

     
          const res = await axios.get(
            "http://localhost:5000/getScheduleByTeacher",
            {
              params: {
                teacherId,
                date: formattedDate,
              },
            }
          );


          const filteredSchedules = res.data.filter(
            (schedule) => schedule.shift === String(selectedShift)
          );

          

          const allLessons = filteredSchedules.flatMap(
            (schedule) => schedule.lessons
          );

          const filteredLessons = allLessons.filter((lesson) => {
            if (lesson.date) {
              const d = new Date(lesson.date);
              return d >= monday && d <= sunday;
            }
            return true;
          });

        

          setSchedule(filteredLessons);
        }
      } else if (selectedGroup) {
        const scheduleData = await fetchSchedule({
          specializationId: selectedGroup.specializationId,
          courseId: selectedGroup.courseId,
          groupId: selectedGroup.groupId,
        });

        const filteredLessons = scheduleData.lessons.filter((lesson) => {
          if (lesson.date) {
            const d = new Date(lesson.date);
            return d >= monday && d <= sunday;
          }
          return true;
        });

        setSchedule(filteredLessons);
        setShift(scheduleData.shift);
      }
    } catch (error) {
      console.error("Помилка завантаження розкладу:", error);
    }
  };

  return (
    <>
      <div className='header_calendar'>
        <div className='group_calendar'>
          {user?.user?.role === "teacher" ? (
            <>
              <p
                className='style_group teacher_name'
                style={{ whiteSpace: "nowrap" }}
              >
                {user?.user?.name || "Ім'я викладача"}
              </p>
              <CustomDropdown
                name='shift'
                value={selectedShift}
                options={[
                  { value: "1", label: "1 зміна" },
                  { value: "2", label: "2 зміна" },
                ]}
                onChange={(e) => {
                  const shiftValue = e?.target?.value;
                  setSelectedShift(shiftValue);
                }}
                placeholder='Виберіть зміну'
                minWidth={250}
                isTeacher={true}
              />
            </>
          ) : (
            <>
              <SelectGroupForm onChange={handleGroupChange} />
            </>
          )}
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
                    lessonClass += " active_lesson";
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
                {Array.from({ length: 30 }).map((_, index) => {
                  const column = index % 6;
                  const row = Math.floor(index / 6);
                  const selectedDate = new Date(weekStartDate);
                  selectedDate.setDate(weekStartDate.getDate() + column);
                  const dayOfWeek =
                    selectedDate.getDay() === 0 ? 7 : selectedDate.getDay();
                  const pairNumber = row + 1;

                  const lesson = schedule.find((lesson) => {
                    const isCorrectDay =
                      lesson.day?.[0] === dayOfWeek &&
                      lesson.pairNumber?.[0] === pairNumber;

                    if (!isCorrectDay) return false;

                    if (!lesson.week || lesson.week === "") {
                      return true;
                    }

                    const lessonWeekStart = new Date(lesson.week);
                    return (
                      lessonWeekStart.toDateString() ===
                      weekStartDate.toDateString()
                    );
                  });

                  const pairTime = lessonsSchedule[pairNumber - 1]
                    ? `${formatTime(
                        lessonsSchedule[pairNumber - 1].start,
                        user?.user?.timeFormat
                      )}–${formatTime(
                        lessonsSchedule[pairNumber - 1].end,
                        user?.user?.timeFormat
                      )}`
                    : "";

                  return (
                    <div
                      key={index}
                      className='cell'
                      onMouseEnter={() => setHoveredCell(index)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {lesson ? (
                        <LessonBlock
                          title={lesson.predmetId?.predmet || lesson.eventTitle}
                          type={lesson.type || "event"}
                          mode={lesson.format || "Offline"}
                          time={pairTime}
                          eventTime={lesson.time}
                          groupInfo={{
                            specialization: "ІПЗ",
                            course: 3,
                            group: 3,
                          }}
                          onClick={(e) => handleLessonClick(e, lesson)}
                          isEvent={lesson.isEvent}
                        />
                      ) : user.user?.role === "deanery" &&
                        hoveredCell === index ? (
                        <button
                          className='add-lesson-btn'
                          onClick={() => {
                            const column = index % 6;
                            const row = Math.floor(index / 6);
                            const selectedDate = new Date(weekStartDate);
                            selectedDate.setDate(
                              weekStartDate.getDate() + column
                            );
                            const dayOfWeek =
                              selectedDate.getDay() === 0
                                ? 7
                                : selectedDate.getDay();
                            setSelectedCell({ dayOfWeek, pairNumber: row + 1 });
                            setChooseTypeOpen(true);
                          }}
                          title='Додати пару'
                        >
                          +
                        </button>
                      ) : (
                        <div className='empty-cell'></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalData && (
        <PareInfo
          lesson={modalData}
          position={modalPosition}
          onClose={() => setModalData(null)}
        />
      )}

      {isChooseTypeOpen && (
        <ChooseType
          isOpen={isChooseTypeOpen}
          onChoose={handleChooseType}
          onCancel={() => setChooseTypeOpen(false)}
        />
      )}
      {isAddPareModalOpen && (
        <AddPare
          onClose={closeAddPareModal}
          groupId={selectedGroup?.groupId}
          specializationId={selectedGroup?.specializationId}
          dayOfWeek={selectedCell?.dayOfWeek}
          pairNumber={selectedCell?.pairNumber}
        />
      )}
      {isAddEventModalOpen && (
        <AddEvent
          onClose={closeAddEventModal}
          groupId={selectedGroup?.groupId}
          specializationId={selectedGroup?.specializationId}
          dayOfWeek={selectedCell?.dayOfWeek}
          pairNumber={selectedCell?.pairNumber}
        />
      )}
    </>
  );
};

export default Calendar;
