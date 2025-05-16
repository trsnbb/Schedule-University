import React, { useRef, useState } from "react";
import "./AddPare.css";
import "../../CustomRadio.css";
import plus from "./../../../image/plus.svg";

// Додаємо кастомний дропдаун прямо тут
const CustomDropdown = ({
  name,
  value,
  options,
  onChange,
  placeholder,
  minWidth = 120,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  React.useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className='custom-dropdown' ref={ref} style={{ minWidth }}>
      <div className='dropdown-selected' onClick={() => setOpen((o) => !o)}>
        {options.find((opt) => opt.value === value)?.label || placeholder}
        <span className='dropdown-arrow'>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className='dropdown-list'>
          {options.map((opt, idx) => (
            <div
              className='dropdown-item'
              key={opt.value}
              onClick={() => {
                onChange({ target: { name, value: opt.value } });
                setOpen(false);
              }}
              style={{
                borderBottom:
                  idx !== options.length - 1 ? "1px solid #353835" : "none",
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AddEvent = ({ onClose }) => {
  const modalRef = useRef();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    time: "",
    priority: "normal",
    mode: "online",
    specialization: "",
    course: "",
    group: "",
  });

  const textareaRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Варіанти для списків
  const specializationOptions = [
    { value: "", label: "Всі" },
    { value: "ІПЗ", label: "ІПЗ" },
    { value: "КН", label: "КН" },
    { value: "ФІЗ", label: "ФІЗ" },
  ];
  const courseOptions = [
    { value: "", label: "Всі" },
    { value: "1", label: "1 курс" },
    { value: "2", label: "2 курс" },
    { value: "3", label: "3 курс" },
    { value: "4", label: "4 курс" },
  ];
  const groupOptions = [
    { value: "", label: "Всі" },
    { value: "1", label: "1 група" },
    { value: "2", label: "2 група" },
    { value: "3", label: "3 група" },
    { value: "4", label: "4 група" },
  ];

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
          <div
            className='form-group row-inputs'
          >
            <div>
              <label style={{ display: "block" }}>Спеціальність</label>
              <CustomDropdown
                name='specialization'
                value={eventData.specialization}
                options={specializationOptions}
                onChange={handleInputChange}
                placeholder='Всі'
                minWidth={120}
              />
            </div>
            <div>
              <label style={{ display: "block" }}>Курс</label>
              <CustomDropdown
                name='course'
                value={eventData.course}
                options={courseOptions}
                onChange={handleInputChange}
                placeholder='Всі'
                minWidth={80}
              />
            </div>
            <div>
              <label style={{ display: "block" }}>Група</label>
              <CustomDropdown
                name='group'
                value={eventData.group}
                options={groupOptions}
                onChange={handleInputChange}
                placeholder='Всі'
                minWidth={80}
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
