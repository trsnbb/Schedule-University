import React, { useState, useRef } from "react";
import "./AddPare.css";
import "./../../CustomRadio.css";

const AddPare = ({ onClose }) => {
  const modalRef = useRef();

  const [lessonData, setLessonData] = useState({
    title: "",
    type: "",
    mode: "",
    time: "",
    teacher: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Lesson Added:", lessonData);
    // Додаємо нову пару в систему
    onClose(); // Закриваємо модальне вікно після додавання
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div className='add-pare-modal' onClick={handleClickOutside}>
      <div className='add-pare-modal-content' ref={modalRef}>
        <h2>Додати пару</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Введіть назву предмету</label>
            <input
              type='text'
              name='title'
              value={lessonData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Введіть викладача</label>
            <input
              type='text'
              name='type'
              value={lessonData.type}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Оберіть вид</label>
            <div className='radio_button_modal_format'>
              <label className='custom_radio_modal'>
                <input type='radio' name='format' defaultChecked />
                <span className='radio_mark_modal'></span>
                Лекція
              </label>
              <label className='custom_radio_modal'>
                <input type='radio' name='format' />
                <span className='radio_mark_modal'></span>
                Практика
              </label>
              <label className='custom_radio_modal'>
                <input type='radio' name='format' />
                <span className='radio_mark_modal'></span>
                Лабораторна робота
              </label>
            </div>
          </div>
          <div className='form-group'>
            <label>Оберіть формат</label>
            <div className='radio_button_modal_format'>
              <label className='custom_radio_modal'>
                <input type='radio' name='format' defaultChecked />
                <span className='radio_mark_modal'></span>
                Онлайн
              </label>
              <label className='custom_radio_modal'>
                <input type='radio' name='format' />
                <span className='radio_mark_modal'></span>
                Очно
              </label>
            </div>
          </div>
          <div className='form-group'>
            <label>Введіть посилання</label>
            <input
              type='text'
              name='teacher'
              value={lessonData.teacher}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-group'>
            <label>Оберіть тип</label>
            <div className='radio_button_modal_format'>
              <label className='custom_radio_modal'>
                <input type='radio' name='format' defaultChecked />
                <span className='radio_mark_modal'></span>
                Разова
              </label>
              <label className='custom_radio_modal'>
                <input type='radio' name='format' />
                <span className='radio_mark_modal'></span>
                Постійна
              </label>
            </div>
          </div>
          <div className='form-group'>
            <label>Варіант</label>
            <div className='radio_button_modal_format'>
              <label className='custom_radio_modal'>
                <input type='radio' name='format' defaultChecked />
                <span className='radio_mark_modal'></span>
                Перший
              </label>
              <label className='custom_radio_modal'>
                <input type='radio' name='format' />
                <span className='radio_mark_modal'></span>
                Другий
              </label>
              <label className='custom_radio_modal'>
                <input type='radio' name='format' />
                <span className='radio_mark_modal'></span>
                Оба варіанти
              </label>
            </div>
          </div>
          <div className='button_form'>
            <button type='submit'>Додати</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPare;
