import React, { useState, useRef } from "react";
import "./createSchedule2.css";
import "./../../CustomRadio.css";
import plus from "./../../../image/plus.svg";

const CreateSchedule2 = ({ onClose }) => {

  const modalRef = useRef();

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

 
  return (
    <div className='create_schedule-modal' onClick={handleClickOutside}>
      <div className='create_schedule-modal-content' ref={modalRef}>
        <button className='close-plus-icon' onClick={onClose}>
          <img src={plus} alt='close' />
        </button>
        <h2>Автоматичне створення розкладу</h2>

        <form>
          укукук
        </form>
      </div>

     
    </div>
  );
};

export default CreateSchedule2;
