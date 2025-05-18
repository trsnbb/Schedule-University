import React, { useRef, useState, useEffect } from "react";
import "./scheduleModal.css";
import "./../../CustomRadio.css";
import close from "./../../../image/close.svg";
import dzyobik from "./../../../image/dzyobik.svg";
import back from "./../../../image/Vector.svg";
import axios from "axios"; // додай axios, якщо ще не використовується
import { fetchAllTeachers } from "../../../axios"; 
import CustomDropdown from "./../AddPare/AddEvent.jsx"; // Імпортуй кастомний дропдаун, якщо він у тебе є

const ScheduleModal = ({ onClose, onBack, selectedSubjects }) => {
  const modalRef = useRef();
  const accordionRef = useRef();
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [teachers, setTeachers] = useState([]);
  

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
console.log("teachers:", teachers);
console.log("тип teachers:", typeof teachers, Array.isArray(teachers));

  // ✅ Отримання викладачів
 useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const data = await fetchAllTeachers();
      console.log("Викладачі:", data);
      setTeachers(data); // якщо треба в стейт
    } catch (error) {
      console.error("Помилка при завантаженні викладачів:", error);
    }
  };

  fetchTeachers();
}, []);


  const toggleAccordion = (index) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenAccordionIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const subjects = selectedSubjects || [];

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
                          <input type='text' />
                        </div>
                        <div className='input_group_accordion'>
                          <label>Кількість практик</label>
                          <input type='text' />
                        </div>
                        <div className='input_group_accordion'>
                          <label>Кількість лабораторних</label>
                          <input type='text' />
                        </div>
                      </div>
                      <div className='accordion-body_name'>
                        <div className='input_group_accordion'>
                          <label>Оберіть викладача</label>
                          <select>
                            {teachers.map((teacher, i) => (
                              <option key={i} value={teacher.teacherEmail}>
                                {teacher.teacherName} ({teacher.teacherEmail})
                              </option>
                            ))}
                          </select>
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
              <label>
                Загальна кількість пар на тиждень для однієї групи
              </label>
              <input type='text' disabled />
            </div>
            <div className='input_count_schedule'>
              <label>Загальна кількість предметів</label>
              <input type='text' disabled />
            </div>
            <div className='input_count_schedule'>
              <label>Всього в тиждень:</label>
              <div className='input_count_type'>
                <div className='input_group_accordion'>
                  <label>Лекцій</label>
                  <input type='text' disabled />
                </div>
                <div className='input_group_accordion'>
                  <label>Лабораторних</label>
                  <input type='text' disabled />
                </div>
                <div className='input_group_accordion'>
                  <label>Практик</label>
                  <input type='text' disabled />
                </div>
              </div>
            </div>
          </div>

          <div className='button_from_modal'>
            <button type='button'>Підтвердити</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
