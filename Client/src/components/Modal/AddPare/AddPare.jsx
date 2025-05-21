import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AddPare.css";
import "./../../CustomRadio.css";
import plus from "./../../../image/plus.svg";
import { fetchAllTeachers } from "../../../axios";
import CustomDropdown from "./../../CustomDropdown/CustomDropdown.jsx";
import axiosInstance from "../../../axios";

const AddPare = ({
  onClose,
  groupId,
  dayOfWeek = 1,
  pairNumber = 1,
  specializationId = null,
}) => {
  const modalRef = useRef();

  const [day, setDay] = useState(dayOfWeek);
  const [pair, setPair] = useState(pairNumber);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [lessonData, setLessonData] = useState({
    title: "",
    type: "",
    mode: "",
    lessonType: "single",
    variant: "",
    teacher: "",
    link: "",
    date: "",
  });

  const teacherOptions = teachers.map((teacher) => ({
    value: teacher._id,
    label: `${teacher.teacherName} (${teacher.teacherId})`,
  }));

  useEffect(() => {
    setDay(dayOfWeek);
    setPair(pairNumber);
  }, [dayOfWeek, pairNumber]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get("/predmet");
        setSubjects(response.data);
      } catch (err) {
        console.error("Помилка при завантаженні предметів:", err);
      }
    };
    fetchSubjects();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name, value) => {
    setLessonData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLesson = {
      predmetId: lessonData.title,
      teacherId: lessonData.teacher,
      type: lessonData.type,
      format: lessonData.mode,
      link: lessonData.link,
      date: lessonData.lessonType === "single" ? lessonData.date : null,
    };

    try {
      await axios.post("http://localhost:5000/addLesson", {
        groupId,
        day,
        pairNumber: pair, // <- назва має бути 'pairNumber'
        lesson: newLesson,
      });
      onClose();
    } catch (error) {
      console.error("Не вдалося додати пару", error);
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div className='add-schedule-modal' onClick={handleClickOutside}>
      <div className='add-schedule-modal-content' ref={modalRef}>
        <button className='close-plus-icon' onClick={onClose}>
          <img src={plus} alt='Закрити' />
        </button>
        <h2>Додати пару</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Оберіть предмет</label>
            <CustomDropdown
              name='title'
              value={lessonData.title}
              options={subjects.map((subject) => ({
                label: subject.name,
                value: subject._id,
              }))}
              onChange={(e) => handleDropdownChange("title", e.target.value)}
              placeholder='Оберіть предмет'
              minWidth={250}
            />

            <label className='teacher_input'>Оберіть викладача</label>
            <CustomDropdown
              name='teacher'
              value={lessonData.teacher}
              options={teacherOptions}
              onChange={(e) => handleDropdownChange("teacher", e.target.value)}
              placeholder='Оберіть Викладача'
            />
          </div>

          <div className='form-group'>
            <label>Оберіть тип</label>
            <div className='radio_button_modal_format'>
              {["lec", "prac", "lab"].map((type) => (
                <label className='custom_radio_modal' key={type}>
                  <input
                    type='radio'
                    name='type'
                    value={type}
                    checked={lessonData.type === type}
                    onChange={handleInputChange}
                  />
                  <span className='radio_mark_modal'></span>
                  {
                    { lec: "Лекція", prac: "Практика", lab: "Лабораторна" }[
                      type
                    ]
                  }
                </label>
              ))}
            </div>
          </div>

          <div className='form-group'>
            <label>Оберіть формат</label>
            <div className='radio_button_modal_format'>
              {["online", "offline"].map((mode) => (
                <label className='custom_radio_modal' key={mode}>
                  <input
                    type='radio'
                    name='mode'
                    value={mode}
                    checked={lessonData.mode === mode}
                    onChange={handleInputChange}
                  />
                  <span className='radio_mark_modal'></span>
                  {mode === "online" ? "Онлайн" : "Очно"}
                </label>
              ))}
            </div>
          </div>

          <div className='form-group'>
            <label>Посилання</label>
            <input
              type='text'
              name='link'
              value={lessonData.link}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className='form-group'>
            <label>Тип заняття</label>
            <div className='radio_button_modal_format'>
              {["single", "permanent"].map((val) => (
                <label className='custom_radio_modal' key={val}>
                  <input
                    type='radio'
                    name='lessonType'
                    value={val}
                    checked={lessonData.lessonType === val}
                    onChange={handleInputChange}
                  />
                  <span className='radio_mark_modal'></span>
                  {val === "single" ? "Разова" : "Постійна"}
                </label>
              ))}
            </div>
          </div>
          {lessonData.lessonType === "single" && (
            <div className='form-group'>
              <label>Оберіть дату</label>
              <input
                type='date'
                name='date'
                value={lessonData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div>
            <label>День тижня:</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
            >
              <option value={1}>Понеділок</option>
              <option value={2}>Вівторок</option>
              <option value={3}>Середа</option>
              <option value={4}>Четвер</option>
              <option value={5}>П’ятниця</option>
              <option value={6}>Субота</option>
            </select>

            <label>Номер пари:</label>
            <select
              value={pairNumber}
              onChange={(e) => setPairNumber(Number(e.target.value))}
            >
              <option value={1}>1 пара</option>
              <option value={2}>2 пара</option>
              <option value={3}>3 пара</option>
              <option value={4}>4 пара</option>
              <option value={5}>5 пара</option>
            </select>
          </div>

          <div className='button_from_modal'>
            <button type='submit'>Підтвердити</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPare;
