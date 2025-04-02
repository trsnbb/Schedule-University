import React from "react";
import "./calendar.css";

const Calendar = () => {
  return (
    <>
      <div className='calendar'>
        <div className='count_lesson'>
          {["1 пара", "2 пара", "3 пара", "4 пара", "5 пара"].map(
            (text, index) => (
              <div key={index} className='lesson_number'>
                {text}
              </div>
            )
          )}
        </div>
        {/* <div className='count_day'>
          {["21", "22", "23", "24", "25"].map(
            (text, index) => (
              <div key={index} className='lesson_number'>
                {text}
              </div>
            )
          )}
        </div> */}
        <div className='calendar_grid'>
          <div className='grid'>
            {Array.from({ length: 30 }).map((_, index) => (
              <div key={index} className='cell'></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
