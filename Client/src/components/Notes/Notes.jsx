import React from "react";
import "./note.css";

const notesFromDatabase = [
  {
    date: "2025-04-08",
    subject: "Розробка інтернет клієнт-серверних систем",
    note: "Зробити лабораторні 1 - 3",
  },
  {
    date: "2025-04-09",
    subject: "Веб-технології та веб-дизайн",
    note: "Переглянути презентацію на тему Вплив",
  },
  {
    date: "2025-04-09",
    subject: "Проєктування баз даних і ІС",
    note: "Доробити лаб 2",
  },
  {
    date: "2025-04-11",
    subject: "Основи психології та педагогіки",
    note: "Підготувати презентацію на тему Вплив",
  },
];

const getLabel = (dateStr) => {
  const inputDate = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const format = (date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  if (format(inputDate) === format(today)) return "Сьогодні";
  if (format(inputDate) === format(tomorrow)) return "Завтра";

  const daysOfWeek = [
    "Неділя",
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "П’ятниця",
    "Субота",
  ];
  return daysOfWeek[inputDate.getDay()];
};

const formatDateDisplay = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};

const groupByDate = (notes) => {
  const grouped = {};
  notes.forEach((note) => {
    if (!grouped[note.date]) grouped[note.date] = [];
    grouped[note.date].push(note);
  });
  return grouped;
};

const Notes = () => {
  const groupedNotes = groupByDate(notesFromDatabase);
  const sortedDates = Object.keys(groupedNotes).sort();

  return (
    <div className='notes_sidebar'>
      {sortedDates.map((date) => (
        <div key={date} className='notes_day'>
          <div className='day_header'>
            <p className='day_label'>{getLabel(date)}</p>
            <p className='day_date'>{formatDateDisplay(date)}</p>
          </div>
          <div className='notes_day_info'>
            {groupedNotes[date].map((item, index) => (
              <div className='note' key={index}>
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
  );
};

export default Notes;
