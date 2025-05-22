import React, { useRef, useState, useEffect } from "react";
import "./AddPare.css";
import "../../CustomRadio.css";
import plus from "./../../../image/plus.svg";
import CustomDropdown from "./../../CustomDropdown/CustomDropdown.jsx";
import axiosInstance from "../../../axios.js";
import {
  fetchAllSpecializations,
  fetchCoursesBySpecialization,
  fetchGroupsByCourse,
} from "./../../../axios.js";

const AddEvent = ({
  onClose,
  groupId,
  dayOfWeek = 1,
  pairNumber = 1,
  specializationId = null,
}) => {
  const modalRef = useRef();
  const textareaRef = useRef(null);

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    time: "",
    priority: "normal",
    mode: "online",
    specialization: "",
    course: "",
    group: "",
    isEvent: true,
  });

  const [specializations, setSpecializations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchAllSpecializations().then(setSpecializations);
  }, []);

  useEffect(() => {
    if (eventData.specialization) {
      fetchCoursesBySpecialization(eventData.specialization).then((data) => {
        setCourses(data);
        setEventData((prev) => ({
          ...prev,
          course: "",
          group: "",
        }));
        setGroups([]);
      });
    }
  }, [eventData.specialization]);

  useEffect(() => {
    if (eventData.course) {
      fetchGroupsByCourse(eventData.course).then((data) => {
        setGroups(data);
        setEventData((prev) => ({
          ...prev,
          group: "",
        }));
      });
    }
  }, [eventData.course]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "description" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      isEvent: true,
      eventTitle: eventData.title,
      descriptionEvent: eventData.description,
      time: eventData.time,
      priority: eventData.priority,
      format: eventData.mode,
    };

    try {
      await axiosInstance.post("http://localhost:5000/addLesson", {
        groupId: eventData.group || groupId,
        day: dayOfWeek,
        pairNumber: pairNumber,
        lesson: newEvent,
      });

      onClose();
    } catch (error) {
      console.error("Не вдалося додати подію:", error);
    }
  };

  return (
    <div className='add-schedule-modal'>
      <div
        className='add-schedule-modal-content add-event-modal-content'
        ref={modalRef}
      >
        <button className='close-plus-icon' onClick={onClose}>
          <img src={plus} alt='close' />
        </button>
        <h2>Додати подію</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group row-inputs'>
            <div>
              <label>Спеціальність</label>
              <CustomDropdown
                name='specialization'
                value={eventData.specialization}
                onChange={handleInputChange}
                placeholder='Всі'
                minWidth={120}
                options={specializations.map((s) => ({
                  value: s._id,
                  label: s.name,
                }))}
              />
            </div>
            <div>
              <label>Курс</label>
              <CustomDropdown
                name='course'
                value={eventData.course}
                onChange={handleInputChange}
                placeholder='Всі'
                minWidth={80}
                options={courses.map((c) => ({
                  value: c._id,
                  label: `${c.courseNumber} курс`,
                }))}
              />
            </div>
            <div>
              <label>Група</label>
              <CustomDropdown
                name='group'
                value={eventData.group}
                onChange={handleInputChange}
                placeholder='Всі'
                minWidth={80}
                options={groups.map((g) => ({
                  value: g._id,
                  label: `${g.groupNumber} група`,
                }))}
              />
            </div>
          </div>

          <div className='form-group'>
            <label>Назва події</label>
            <input
              type='text'
              name='title'
              value={eventData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Напишіть опис</label>
            <textarea
              ref={textareaRef}
              name='description'
              value={eventData.description}
              onChange={handleInputChange}
              placeholder="(Необов'язково)"
              rows={4}
            />
          </div>
          <div className='form-group'>
            <label>Напишіть години</label>
            <input
              type='text'
              name='time'
              value={eventData.time}
              onChange={handleInputChange}
              placeholder='Напр. 14:00–16:00'
              required
            />
          </div>
          <div className='form-group'>
            <label>Оберіть формат</label>
            <div className='radio_button_modal_format'>
              <label className='custom_radio_modal'>
                <input
                  type='radio'
                  name='mode'
                  value='online'
                  checked={eventData.mode === "online"}
                  onChange={handleInputChange}
                />
                <span className='radio_mark_modal'></span>
                Онлайн
              </label>
              <label className='custom_radio_modal'>
                <input
                  type='radio'
                  name='mode'
                  value='offline'
                  checked={eventData.mode === "offline"}
                  onChange={handleInputChange}
                />
                <span className='radio_mark_modal'></span>
                Очно
              </label>
            </div>
          </div>
          <div className='form-group'>
            <label>Оберіть пріоритет</label>
            <div className='radio_button_modal_format'>
              <label className='custom_radio_modal'>
                <input
                  type='radio'
                  name='priority'
                  value='low'
                  checked={eventData.priority === "low"}
                  onChange={handleInputChange}
                />
                <span className='radio_mark_modal'></span>
                Низький
              </label>
              <label className='custom_radio_modal'>
                <input
                  type='radio'
                  name='priority'
                  value='normal'
                  checked={eventData.priority === "normal"}
                  onChange={handleInputChange}
                />
                <span className='radio_mark_modal'></span>
                Звичайний
              </label>
              <label className='custom_radio_modal'>
                <input
                  type='radio'
                  name='priority'
                  value='high'
                  checked={eventData.priority === "high"}
                  onChange={handleInputChange}
                />
                <span className='radio_mark_modal'></span>
                Високий
              </label>
            </div>
          </div>
          <div className='button_from_modal'>
            <button type='submit'>Додати подію</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
