import React, { useRef, useState, useEffect } from "react";
import "./scheduleModal.css";
import "./../../CustomRadio.css";
import close from "./../../../image/close.svg";
import dzyobik from "./../../../image/dzyobik.svg";
import back from "./../../../image/Vector.svg";

const ScheduleModal = ({ onClose, onBack }) => {
  const modalRef = useRef();
  const accordionRef = useRef();
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

  const toggleAccordion = (index) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenAccordionIndex((prevIndex) => (prevIndex === index ? null : index));
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

  const subjects = [
    "Розробка інтернет клієнт серверних систем",
    "Комп'ютерна графіка",
  ];

  return (
    <div className='create_schedule-modal'>
      <div className='create_schedule-modal-content' ref={modalRef}>
        <div className='button_icon'>
          <button className='back-icon' onClick={onBack}>
            {" "}
            <img src={back} alt='back' />
          </button>
          <h2>Автоматичне створення розкладу</h2>
          <button className='close-icon' onClick={onClose}>
            <img src={close} alt='close' />
          </button>
        </div>

        
        <form>
          <div className='accordion' ref={accordionRef}>
            {subjects.map((subject, index) => (
              <div key={index}>
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
                  {subject}
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
                        <label>Кількість лекцій</label>
                        <input type='text' />
                      </div>
                      <div className='input_group_accordion'>
                        <label>Кількість практик</label>
                        <input type='text' />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className='input_count_content'>
            <div className='input_count_schedule'>
              <label>
                Загальна кількість пар на тиждень для однієї прідгрупи
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
