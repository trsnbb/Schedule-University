import React from "react";
import "./calendar.css";

const Calendar = () => {
  return (
    <div className="calendar">
      <div className="grid">
        {Array.from({ length: 30 }).map((_, index) => (
          <div key={index} className="cell"></div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
