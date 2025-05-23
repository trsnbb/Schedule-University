// CreateSchedule.jsx

import React, { useState, useRef, useEffect } from "react";
import "./createSchedule.css";
import "./../../CustomRadio.css";
import plus from "./../../../image/plus.svg";
import ScheduleModal from "./ScheduleModal";
import axios from "axios";
import axiosInstance from "../../../axios";
import Fuse from "fuse.js";

const CreateSchedule = ({ onClose }) => {
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [specializationName, setSpecializationName] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [format, setFormat] = useState("");
  const [weekType, setWeekType] = useState("");
  const [shift, setShift] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const modalRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get("/predmet");
        setSubjects(response.data);
      } catch (err) {
        setError("Не вдалося завантажити список предметів");
        console.error("Error fetching subjects:", err);
      }
    };

    fetchSubjects();
  }, []);

  const handleClickOutside = (e) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target) &&
      !isScheduleModalOpen
    ) {
      onClose();
    }
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  const fuse = new Fuse(subjects, {
    keys: ["name"],
    threshold: 0.4,
  });

  const fuzzyResults = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : subjects;

  const filteredSubjects = fuzzyResults.concat(
    subjects.filter((subject) => !fuzzyResults.includes(subject))
  );

  const displayedSubjects = showAllSubjects
    ? filteredSubjects
    : filteredSubjects.slice(0, 4);

  return (
    <>
      {isScheduleModalOpen ? (
        <ScheduleModal
          onClose={() => {
            setScheduleModalOpen(false);
            onClose();
          }}
          onBack={() => setScheduleModalOpen(false)}
          selectedSubjectObjects={subjects.filter((s) =>
            selectedSubjects.includes(s._id)
          )}
          specializationName={specializationName}
          courseNumber={courseNumber}
          groupNumber={groupNumber}
          format={format}
          weekType={weekType}
          shift={shift}
        />
      ) : (
        <div className='add-schedule-modal' onClick={handleClickOutside}>
          <div className='add-schedule-modal-content' ref={modalRef}>
            <button className='close-plus-icon' onClick={onClose}>
              <img src={plus} alt='close' />
            </button>
            <h2>Автоматичне створення розкладу</h2>

            {error && <div className='error-message'>{error}</div>}

            <form>
              <div className='form-group'>
                <label>Спеціальність</label>
                <input
                  type='text'
                  value={specializationName}
                  onChange={(e) => setSpecializationName(e.target.value)}
                />
              </div>

              <div className='row-inputs'>
                <div className='form-group'>
                  <label>Курс</label>
                  <input
                    type='text'
                    value={courseNumber}
                    onChange={(e) =>
                      setCourseNumber(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </div>
                <div className='form-group'>
                  <label>Група*</label>
                  <input
                    type='text'
                    value={groupNumber}
                    onChange={(e) =>
                      setGroupNumber(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </div>
              </div>

              <div className='form-group'>
                <label>Предмети</label>
                <input
                  type='text'
                  placeholder='Пошук предметів...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className='checkbox-group'>
                  {displayedSubjects.map((subject) => (
                    <label key={subject._id} className='custom-checkbox'>
                      <input
                        type='checkbox'
                        checked={selectedSubjects.includes(subject._id)}
                        onChange={() => handleSubjectToggle(subject._id)}
                      />
                      <span className='checkmark'></span>
                      {subject.name}
                    </label>
                  ))}
                  {subjects.length > 4 && (
                    <span
                      className='more-subjects'
                      onClick={() => setShowAllSubjects(!showAllSubjects)}
                    >
                      {showAllSubjects ? "Менше..." : "Ще..."}
                    </span>
                  )}
                </div>
              </div>

              <div className='form-group'>
                <label>Формат</label>
                <div className='radio-button-row'>
                  <label className='custom_radio_modal'>
                    <input
                      type='radio'
                      name='format'
                      value='Offline'
                      checked={format === "Offline"}
                      onChange={() => setFormat("Offline")}
                    />
                    <span className='radio_mark_modal'></span>
                    Аудиторно
                  </label>
                  <label className='custom_radio_modal'>
                    <input
                      type='radio'
                      name='format'
                      value='Online'
                      checked={format === "Online"}
                      onChange={() => setFormat("Online")}
                    />
                    <span className='radio_mark_modal'></span>
                    Дистанційно
                  </label>
                </div>
              </div>

              <div className='form-group'>
                <label>Варіант</label>
                <div className='radio-button-row'>
                  <label className='custom_radio_modal'>
                    <input
                      type='radio'
                      name='variant'
                      value='1'
                      checked={weekType === "1"}
                      onChange={() => setWeekType("1")}
                    />
                    <span className='radio_mark_modal'></span>
                    Перший
                  </label>
                  <label className='custom_radio_modal'>
                    <input
                      type='radio'
                      name='variant'
                      value='2'
                      checked={weekType === "2"}
                      onChange={() => setWeekType("2")}
                    />
                    <span className='radio_mark_modal'></span>
                    Другий
                  </label>
                  <label className='custom_radio_modal'>
                    <input
                      type='radio'
                      name='variant'
                      value='both'
                      checked={weekType === "both"}
                      onChange={() => setWeekType("both")}
                    />
                    <span className='radio_mark_modal'></span>
                    Обa варіанти
                  </label>
                </div>
              </div>

              <div className='form-group'>
                <label>Зміна</label>
                <div className='radio-button-row'>
                  <label className='custom_radio_modal'>
                    <input
                      type='radio'
                      name='shift'
                      value='1'
                      checked={shift === "1"}
                      onChange={() => setShift("1")}
                    />
                    <span className='radio_mark_modal'></span>
                    Перша
                  </label>
                  <label className='custom_radio_modal'>
                    <input
                      type='radio'
                      name='shift'
                      value='2'
                      checked={shift === "2"}
                      onChange={() => setShift("2")}
                    />
                    <span className='radio_mark_modal'></span>
                    Друга
                  </label>
                </div>
              </div>

              <div className='button_from_modal button_create'>
                <button
                  type='button'
                  onClick={() => setScheduleModalOpen(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "Обробка..." : "Підтвердити"}
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
