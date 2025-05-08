import React, { useState, useRef } from "react";
import "./createSchedule.css";
import "./../../CustomRadio.css";
import plus from "./../../../image/plus.svg";
import ScheduleModal from "./ScheduleModal"; // Імпорт компонента CreateSchedule2

const CreateSchedule = ({ onClose }) => {
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);

  const modalRef = useRef();

  const handleClickOutside = (e) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target) &&
      !isScheduleModalOpen
    ) {
      onClose();
    }
  };

  const handleConfirmClick = () => {
    setScheduleModalOpen(true); // Відкриваємо ScheduleModal
  };

  return (
    <>
      {isScheduleModalOpen ? (
        <ScheduleModal
          onClose={() => {
            setScheduleModalOpen(false);
            onClose(); // Закриваємо все
          }}
          onBack={() => setScheduleModalOpen(false)} // Повертаємося до CreateSchedule
        />
      ) : (
        <div className='add-schedule-modal' onClick={handleClickOutside}>
          <div className='add-schedule-modal-content' ref={modalRef}>
            <button className='close-plus-icon' onClick={onClose}>
              <img src={plus} alt='close' />
            </button>
            <h2>Автоматичне створення розкладу</h2>

            <form>
              <div className='form-group'>
                <label>Спеціальність</label>
                <input type='text' />
              </div>

              <div className='row-inputs'>
                <div className='form-group'>
                  <label>Курс</label>
                  <input type='text' />
                </div>
                <div className='form-group'>
                  <label>Група*</label>
                  <input type='text' />
                </div>
                <div className='form-group'>
                  <label>Підгрупа*</label>
                  <input type='text' />
                </div>
              </div>

              <div className='form-group'>
                <label>Предмети</label>
                <input type='text' />
                <div className='checkbox-group'>
                  <label className='custom-checkbox'>
                    <input type='checkbox' />
                    <span className='checkmark'></span>
                    Розробка інтернет клієнт-серверних систем
                  </label>
                  <label className='custom-checkbox'>
                    <input type='checkbox' />
                    <span className='checkmark'></span>
                    Основи психології та педагогіки
                  </label>
                  <label className='custom-checkbox'>
                    <input type='checkbox' />
                    <span className='checkmark'></span>
                    Філософія
                  </label>
                  <label className='custom-checkbox'>
                    <input type='checkbox' />
                    <span className='checkmark'></span>
                    Проєктування баз даних і знань
                  </label>

                  <span className='more-subjects'>Ще...</span>
                </div>
              </div>

              <div className='form-group'>
                <label>Формат</label>
                <div className='radio-button-row'>
                  <label className='custom_radio_modal'>
                    <input type='radio' name='format' />
                    <span className='radio_mark_modal'></span>
                    Аудиторно
                  </label>
                  <label className='custom_radio_modal'>
                    <input type='radio' name='format' />
                    <span className='radio_mark_modal'></span>
                    Дистанційно
                  </label>
                </div>
              </div>

              <div className='form-group'>
                <label>Варіант</label>
                <div className='radio-button-row'>
                  <label className='custom_radio_modal'>
                    <input type='radio' name='variant' />
                    <span className='radio_mark_modal'></span>
                    Перший
                  </label>
                  <label className='custom_radio_modal'>
                    <input type='radio' name='variant' />
                    <span className='radio_mark_modal'></span>
                    Другий
                  </label>
                  <label className='custom_radio_modal'>
                    <input type='radio' name='variant' />
                    <span className='radio_mark_modal'></span>
                    Обa варіанти
                  </label>
                </div>
              </div>

              <div className='form-group'>
                <label>Зміна</label>
                <div className='radio-button-row'>
                  <label className='custom_radio_modal'>
                    <input type='radio' name='shift' />
                    <span className='radio_mark_modal'></span>
                    Перша
                  </label>
                  <label className='custom_radio_modal'>
                    <input type='radio' name='shift' />
                    <span className='radio_mark_modal'></span>
                    Друга
                  </label>
                </div>
              </div>
              <div className='button_from_modal button_create'>
                <button type='button' onClick={handleConfirmClick}>
                  Підтвердити
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateSchedule;
