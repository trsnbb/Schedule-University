import React, { useState, useEffect, useRef } from "react";
import plus from "./../../../image/plus.svg";
import ScheduleModal from "./../AddShedule/ScheduleModal.jsx";
import axiosInstance from "../../../axios.js";
import SelectGroupForm from "../../Calendar/SelectGroupForm.jsx";
import Fuse from "fuse.js";
import "./../AddShedule/createSchedule.css";
import "./../../CustomRadio.css";

const EditGeneralScheduleModal = ({ onClose }) => {
  const [groupData, setGroupData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef();
  const extractUniqueSubjects = (lessons) => {
    const subjects = lessons
      .map((lesson) => lesson.predmetId?._id || lesson.predmetId)
      .filter(Boolean)
      .map(String);

    return [...new Set(subjects)];
  };

  // Завантаження предметів + розкладу
  useEffect(() => {
    const fetchData = async () => {
      if (
        !groupData?.specializationId ||
        !groupData?.courseId ||
        !groupData?.groupId
      )
        return;

      try {
        const [predmetRes, scheduleRes] = await Promise.all([
          axiosInstance.get("/predmet", {
            params: { specializationId: groupData.specializationId },
          }),
          axiosInstance.get("/getScheduleByGroup", {
            params: {
              specializationId: groupData.specializationId,
              courseId: groupData.courseId,
              groupId: groupData.groupId,
            },
          }),
        ]);

        const allSubjects = predmetRes.data;
        const lessons = scheduleRes.data.lessons || [];

        console.log("Отримані предмети:", allSubjects);
        console.log("Отримані пари:", lessons);

        const usedSubjectIds = extractUniqueSubjects(lessons);

        console.log("Унікальні предмети з розкладу:", usedSubjectIds);

        setSubjects(allSubjects);
        setSelectedSubjects(usedSubjectIds);
      } catch (err) {
        console.error("Помилка при завантаженні:", err);
        setError("Не вдалося завантажити дані");
      }
    };

    fetchData();
  }, [groupData?.specializationId, groupData?.courseId, groupData?.groupId]);

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
    const idStr = String(subjectId);
    setSelectedSubjects((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr]
    );
  };

  const fuse = new Fuse(subjects, { keys: ["name"], threshold: 0.4 });
  const fuzzyResults = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : subjects;

  const filteredSubjects = fuzzyResults.concat(
    subjects.filter((subject) => !fuzzyResults.includes(subject))
  );

  const displayedSubjects = showAllSubjects
    ? filteredSubjects
    : filteredSubjects.slice(0, 4);

  const handleConfirm = () => {
    if (
      !groupData?.specializationId ||
      !groupData?.courseId ||
      !groupData?.groupId
    ) {
      setError("Будь ласка, оберіть спеціальність, курс і групу");
      return;
    }
    setScheduleModalOpen(true);
  };

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
            selectedSubjects.includes(String(s._id))
          )}
          specializationId={groupData.specializationId}
          courseId={groupData.courseId}
          groupId={groupData.groupId}
        />
      ) : (
        <div className='add-schedule-modal' onClick={handleClickOutside}>
          <div className='add-schedule-modal-content' ref={modalRef}>
            <button className='close-plus-icon' onClick={onClose}>
              <img src={plus} alt='close' />
            </button>
            <h2>Редагувати загальний розклад</h2>
            {error && <div className='error-message'>{error}</div>}

            <form>
              <div className='form-group'>
                <label>Виберіть спеціальність, курс і групу</label>
                <SelectGroupForm onChange={setGroupData} />
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
                        value={subject._id}
                        checked={selectedSubjects.includes(String(subject._id))}
                        onChange={() => handleSubjectToggle(subject._id)}
                      />
                      <span className='checkmark'></span>
                      {subject.name}
                    </label>
                  ))}
                  {subjects.length > 4 && (
                    <span
                      className='more-subjects'
                      onClick={() => setShowAllSubjects((prev) => !prev)}
                    >
                      {showAllSubjects ? "Менше..." : "Ще..."}
                    </span>
                  )}
                </div>
              </div>

              <div className='button_from_modal button_create'>
                <button type='button' onClick={handleConfirm}>
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

export default EditGeneralScheduleModal;
