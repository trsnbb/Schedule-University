import React from "react";
import "./../../layouts/backround.css";
import Sidebar from "../../components/Side bar/Sidebar.jsx";
import "./feedback.css";

const Feedback = () => {
  return (
    <div className='backround'>
      <Sidebar />
      <div className='feedback_container'>
        <div className='feedback_form'>
        <h2>Зворотній зв'язок</h2>
          <div className='feedback_inputs'>
            <label>З ким ви хочете зв'язатися?</label>
            <input type='text' name='feedback_name'/>
            <label>Тема</label>
            <input type='text' name='feedback_theme'/>
            <label>Опишіть ваше питання</label>
            <input type='text'name='feedback_text' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
