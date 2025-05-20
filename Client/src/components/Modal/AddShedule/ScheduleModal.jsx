import React, { useRef, useState, useEffect } from "react";
import "./scheduleModal.css";
import "./../../CustomRadio.css";
import close from "./../../../image/close.svg";
import dzyobik from "./../../../image/dzyobik.svg";
import back from "./../../../image/Vector.svg";
import axios from "axios";
import { fetchAllTeachers } from "../../../axios";
import CustomDropdown from "./../../CustomDropdown/CustomDropdown.jsx";
import { postSchedule } from "../../../axios";

const ScheduleModal = ({
  onClose,
  onBack,
  selectedSubjectObjects,
  specializationName,
  courseNumber,
  groupNumber,
  format,
  weekType,
}) => {
  const modalRef = useRef();
  const accordionRef = useRef();
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [subjectCounts, setSubjectCounts] = useState({});
  const [subjectTeacherLinks, setSubjectTeacherLinks] = useState({});
  const handleSubmit = async () => {
    const weeksInSemester = 18;

    // Групуємо предмети, щоб вони містили окремі поля countLec, countLab, countPrac
    const groupedLessons = subjects.reduce((acc, subject) => {
      const counts = subjectCounts[subject._id] || {};
      const teacherId = subjectTeacherLinks[subject._id];

      if (!teacherId) return acc;

      // Якщо предмет уже є в acc, оновлюємо його значення
      const existingLesson = acc.find(
        (lesson) =>
          lesson.predmetId === subject._id && lesson.teacherId === teacherId
      );

      const lessonCounts = {
        countLec: counts.lectures || 0,
        countLab: counts.labs || 0,
        countPrac: counts.practices || 0,
      };

      if (existingLesson) {
        existingLesson.countLec += lessonCounts.countLec;
        existingLesson.countLab += lessonCounts.countLab;
        existingLesson.countPrac += lessonCounts.countPrac;
      } else {
        acc.push({
          predmetId: subject._id,
          teacherId: teacherId,
          format,
          weekType,
          ...lessonCounts,
        });
      }

      return acc;
    }, []);

    const payload = {
      specializationName,
      courseNumber,
      groupNumber,
      format,
      weekType,
      lessons: groupedLessons,
    };

    console.log("📤 Payload для створення:", payload);
    console.log("📤 Відправляється JSON:", JSON.stringify(payload, null, 2));

    try {
      const result = await postSchedule(payload);
      console.log("✅ Розклад створено:", result);
      onClose(); // Закриваємо модалку після успіху
    } catch (error) {
      console.error("❌ Помилка при створенні розкладу:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        (!accordionRef.current || !accordionRef.current.contains(e.target))
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await fetchAllTeachers();
        setTeachers(data);
      } catch (error) {
        console.error("Помилка при завантаженні викладачів:", error);
      }
    };
    fetchTeachers();
  }, []);

  const handleCountChange = (subjectId, type) => (e) => {
    const value = e.target.value;

    // Дозволити лише цифри або порожнє значення
    if (/^\d*$/.test(value)) {
      setSubjectCounts((prev) => ({
        ...prev,
        [subjectId]: {
          ...prev[subjectId],
          [type]: value === "" ? "" : parseInt(value),
        },
      }));
    }
  };

  const weeksInSemester = 18;

  const totalWeeklyLessons = Object.values(subjectCounts).reduce(
    (acc, curr) => {
      const lecPerWeek = curr.lectures
        ? Math.max(1, Math.floor(curr.lectures / weeksInSemester))
        : 0;
      const labPerWeek = curr.labs
        ? Math.max(1, Math.floor(curr.labs / weeksInSemester))
        : 0;
      const pracPerWeek = curr.practices
        ? Math.max(1, Math.floor(curr.practices / weeksInSemester))
        : 0;
      return acc + lecPerWeek + labPerWeek + pracPerWeek;
    },
    0
  );

  const totalCounts = Object.values(subjectCounts).reduce(
    (acc, curr) => {
      const lec = curr.lectures || 0;
      const labs = curr.labs || 0;
      const prac = curr.practices || 0;

      acc.lectures +=
        lec > 0 ? Math.max(1, Math.floor(lec / weeksInSemester)) : 0;
      acc.labs +=
        labs > 0 ? Math.max(1, Math.floor(labs / weeksInSemester)) : 0;
      acc.practices +=
        prac > 0 ? Math.max(1, Math.floor(prac / weeksInSemester)) : 0;
      return acc;
    },
    { lectures: 0, labs: 0, practices: 0 }
  );

  const toggleAccordion = (index) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenAccordionIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleTeacherChange = (subjectId) => (e) => {
    const { value } = e.target;
    setSubjectTeacherLinks((prev) => ({
      ...prev,
      [subjectId]: value,
    }));
  };

  const subjects = selectedSubjectObjects || [];

  const teacherOptions = teachers.map((teacher) => ({
    value: teacher._id, // тепер відправляється ID
    label: `${teacher.teacherName} (${teacher.teacherId})`,
  }));

  return (
    <div className='create_schedule-modal'>
      <div className='create_schedule-modal-content' ref={modalRef}>
        <div className='button_icon'>
          <button className='back-icon' onClick={onBack}>
            <img src={back} alt='back' />
          </button>
          <h2>Автоматичне створення розкладу</h2>
          <button className='close-icon' onClick={onClose}>
            <img src={close} alt='close' />
          </button>
        </div>

        <form>
          <div className='accordion' ref={accordionRef}>
            {subjects.length === 0 ? (
              <p>Предмети не вибрані</p>
            ) : (
              subjects.map((subject, index) => (
                <div key={subject._id}>
                  <button
                    className='accordion-header'
                    onClick={toggleAccordion(index)}
                  >
                    <img
                      src={dzyobik}
                      className={`dzyobikAcc ${
                        openAccordionIndex === index ? "rotate" : ""
                      }`}
                      alt='>'
                    />
                    {subject.name}
                  </button>
                  {openAccordionIndex === index && (
                    <>
                      <div className='accordion-body_count'>
                        <div className='input_group_accordion'>
                          <label>Кількість лекцій</label>
                          <input
                            type='text'
                            value={subjectCounts[subject._id]?.lectures || ""}
                            onChange={handleCountChange(
                              subject._id,
                              "lectures"
                            )}
                          />
                        </div>
                        <div className='input_group_accordion'>
                          <label>Кількість практик</label>
                          <input
                            type='text'
                            value={subjectCounts[subject._id]?.practices || ""}
                            onChange={handleCountChange(
                              subject._id,
                              "practices"
                            )}
                          />
                        </div>
                        <div className='input_group_accordion'>
                          <label>Кількість лабораторних</label>
                          <input
                            type='text'
                            value={subjectCounts[subject._id]?.labs || ""}
                            onChange={handleCountChange(subject._id, "labs")}
                          />
                        </div>
                      </div>
                      <div className='accordion-body_name'>
                        <div className='input_group_accordion'>
                          <label>Оберіть викладача</label>
                          <CustomDropdown
                            name='teacher'
                            value={subjectTeacherLinks[subject._id] || ""}
                            options={teacherOptions}
                            onChange={handleTeacherChange(subject._id)}
                            placeholder='Оберіть викладача'
                            minWidth={200}
                          />
                        </div>
                        <div className='input_group_accordion'>
                          <label>Введіть посилання</label>
                          <input type='text' />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <div className='input_count_content'>
            <div className='input_count_schedule'>
              <label>Загальна кількість пар на тиждень для однієї групи</label>
              <input type='text' value={totalWeeklyLessons} disabled />
            </div>

            <div className='input_count_schedule'>
              <label>Загальна кількість предметів</label>
              <input type='text' value={subjects.length} disabled />
            </div>

            <div className='input_count_schedule'>
              <label>Всього в тиждень:</label>
              <div className='input_count_type'>
                <div className='input_group_accordion'>
                  <label>Лекцій</label>
                  <input type='text' value={totalCounts.lectures} disabled />
                </div>
                <div className='input_group_accordion'>
                  <label>Лабораторних</label>
                  <input type='text' value={totalCounts.labs} disabled />
                </div>
                <div className='input_group_accordion'>
                  <label>Практик</label>
                  <input type='text' value={totalCounts.practices} disabled />
                </div>
              </div>
            </div>
          </div>

          <div className='button_from_modal'>
            <button type='button' onClick={handleSubmit}>
              Підтвердити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
