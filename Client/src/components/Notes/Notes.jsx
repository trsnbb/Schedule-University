import React from "react";
import "./note.css";

const Sidebar = () => {
  const notes = [
    {
      label: "Сьогодні",
      date: "21/01",
      items: [
        {
          subject: "Розробка інтернет клієнт-серверних систем",
          note: "Зробити лабораторні 1 - 3",
        },
      ],
    },
    {
      label: "Завтра",
      date: "22/01",
      items: [
        {
          subject: "Веб-технології та веб-дизайн",
          note: "Переглянути презентацію на тему Вплив",
        },
        { subject: "Проєктування баз даних і ІС", note: "Доробити лаб 2" },
        {
          subject: "Основи психології та педагогіки",
          note: "Підготувати презентацію на тему Вплив",
        },
      ],
    },{
      label: "Четвер",
      date: "22/01",
      items: [
        {
          subject: "Веб-технології та веб-дизайн",
          note: "Переглянути презентацію на тему Вплив",
        },
      ],
    },
  ];

  return (
    <>
      <div className='notes_sidebar'>
        {notes.map((day) => (
          <div key={day.date} className='notes_day'>
            <p>{day.label}</p>
            <div className="notes_day_info">
              {day.items.map((item, index) => (
                <div className="note" key={index}>
                  <div className='circle_note'></div>
                  <div className='note_info'>
                    <div className='subject'>{item.subject}</div>
                    <div className='note'>{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
