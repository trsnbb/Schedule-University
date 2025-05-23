import React, { useRef, useState, useEffect } from "react";
import "./../../CustomRadio.css";
import close from "./../../../image/close.svg";
import dzyobik from "./../../../image/dzyobik.svg";
import back from "./../../../image/Vector.svg";
import axios from "axios";
import { fetchAllTeachers } from "../../../axios";
import CustomDropdown from "./../../CustomDropdown/CustomDropdown.jsx";
import { postSchedule } from "../../../axios";
import EditGeneralScheduleModal from "./EditGeneralScheduleModal.jsx";

const EditScheduleModal = ({
  onClose,
  onBack,
  initialSubjectsData = [],
  specializationName,
  courseNumber,
  groupNumber,
  format,
  weekType,
}) => {
  const modalRef = useRef();
  const accordionRef = useRef();
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [subjectCounts, setSubjectCounts] = useState({});
  const [subjectTeacherLinks, setSubjectTeacherLinks] = useState({});
  const [subjectLinks, setSubjectLinks] = useState({});

  useEffect(() => {
    const counts = {};
    const links = {};
    const teachersMap = {};

    initialSubjectsData.forEach((subject) => {
      counts[subject._id] = {
        lectures: subject.countLec || 0,
        labs: subject.countLab || 0,
        practices: subject.countPrac || 0,
      };
      links[subject._id] = subject.link || "";
      teachersMap[subject._id] = subject.teacherId || "";
    });

    setSubjectCounts(counts);
    setSubjectLinks(links);
    setSubjectTeacherLinks(teachersMap);
  }, [initialSubjectsData]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await fetchAllTeachers();
        setTeachers(data);
      } catch (error) {
        console.error("Помилка при завантаженні викладачів:", error);
      }
    };
    fetchTeachers();
  }, []);

  const handleCountChange = (subjectId, type) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSubjectCounts((prev) => ({
        ...prev,
        [subjectId]: {
          ...prev[subjectId],
          [type]: value === "" ? "" : parseInt(value),
        },
      }));
    }
  };

  const handleLinkChange = (subjectId) => (e) => {
    setSubjectLinks((prev) => ({
      ...prev,
      [subjectId]: e.target.value,
    }));
  };

  const handleTeacherChange = (subjectId) => (e) => {
    setSubjectTeacherLinks((prev) => ({
      ...prev,
      [subjectId]: e.target.value,
    }));
  };

  const toggleAccordion = (index) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenAccordionIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSubmit = async () => {
    const weeksInSemester = 18;

    const groupedLessons = initialSubjectsData.reduce((acc, subject) => {
      const counts = subjectCounts[subject._id] || {};
      const teacherId = subjectTeacherLinks[subject._id];

      if (!teacherId) return acc;

      const existingLesson = acc.find(
        (lesson) =>
          lesson.predmetId === subject._id && lesson.teacherId === teacherId
      );

      const lessonCounts = {
        countLec: counts.lectures || 0,
        countLab: counts.labs || 0,
        countPrac: counts.practices || 0,
      };

      if (existingLesson) {
        existingLesson.countLec += lessonCounts.countLec;
        existingLesson.countLab += lessonCounts.countLab;
        existingLesson.countPrac += lessonCounts.countPrac;
      } else {
        acc.push({
          predmetId: subject._id,
          teacherId,
          format,
          weekType,
          link: subjectLinks[subject._id] || "",
          ...lessonCounts,
        });
      }

      return acc;
    }, []);

    const payload = {
      specializationName,
      courseNumber,
      groupNumber,
      format,
      weekType,
      lessons: groupedLessons,
    };

    try {
      await postSchedule(payload);
      onClose();
    } catch (error) {
      console.error("❌ Помилка при оновленні розкладу:", error);
    }
  };

  const weeksInSemester = 18;
  console.log("initialSubjectsData", initialSubjectsData);

  const totalWeeklyLessons = Object.values(subjectCounts).reduce(
    (acc, curr) => {
      const lec = curr.lectures
        ? Math.max(1, Math.floor(curr.lectures / weeksInSemester))
        : 0;
      const lab = curr.labs
        ? Math.max(1, Math.floor(curr.labs / weeksInSemester))
        : 0;
      const prac = curr.practices
        ? Math.max(1, Math.floor(curr.practices / weeksInSemester))
        : 0;
      return acc + lec + lab + prac;
    },
    0
  );

  const totalCounts = Object.values(subjectCounts).reduce(
    (acc, curr) => {
      acc.lectures += curr.lectures || 0;
      acc.labs += curr.labs || 0;
      acc.practices += curr.practices || 0;
      return acc;
    },
    { lectures: 0, labs: 0, practices: 0 }
  );

  const teacherOptions = teachers.map((t) => ({
    value: t._id,
    label: `${t.teacherName} (${t.teacherEmail})`,
  }));

  return (
    <div className='create_schedule-modal'>
      <div className='create_schedule-modal-content' ref={modalRef}>
        <div className='button_icon'>
          <button className='back-icon' onClick={onBack}>
            <img src={back} alt='back' />
          </button>
          <h2>Редагування розкладу</h2>
          <button className='close-icon' onClick={onClose}>
            <img src={close} alt='close' />
          </button>
        </div>

        <form>
          <div className='accordion' ref={accordionRef}>
            {initialSubjectsData.map((subject, index) => (
              <div key={subject._id}>
                <button
                  className='accordion-header'
                  onClick={toggleAccordion(index)}
                >
                  <img
                    src={dzyobik}
                    className={`dzyobikAcc ${
                      openAccordionIndex === index ? "rotate" : ""
                    }`}
                    alt='>'
                  />
                  {subject.name}
                </button>
                {openAccordionIndex === index && (
                  <>
                    <div className='accordion-body_count'>
                      <div className='input_group_accordion'>
                        <label>Кількість лекцій</label>
                        <input
                          type='text'
                          value={subjectCounts[subject._id]?.lectures || ""}
                          onChange={handleCountChange(subject._id, "lectures")}
                        />
                      </div>
                      <div className='input_group_accordion'>
                        <label>Кількість практик</label>
                        <input
                          type='text'
                          value={subjectCounts[subject._id]?.practices || ""}
                          onChange={handleCountChange(subject._id, "practices")}
                        />
                      </div>
                      <div className='input_group_accordion'>
                        <label>Кількість лабораторних</label>
                        <input
                          type='text'
                          value={subjectCounts[subject._id]?.labs || ""}
                          onChange={handleCountChange(subject._id, "labs")}
                        />
                      </div>
                    </div>
                    <div className='accordion-body_name'>
                      <div className='input_group_accordion'>
                        <label>Оберіть викладача</label>
                        <CustomDropdown
                          name='teacher'
                          value={
                            teacherOptions.find(
                              (opt) =>
                                opt.value ===
                                (subjectTeacherLinks[subject._id]?._id ||
                                  subjectTeacherLinks[subject._id])
                            ) || null
                          }
                          options={teacherOptions}
                          onChange={handleTeacherChange(subject._id)}
                          placeholder='Оберіть викладача'
                          minWidth={200}
                        />
                      </div>
                      <div className='input_group_accordion'>
                        <label>Введіть посилання</label>
                        <input
                          type='text'
                          value={subjectLinks[subject._id] || ""}
                          onChange={handleLinkChange(subject._id)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className='input_count_content'>
            <div className='input_count_schedule'>
              <label>Загальна кількість пар на тиждень</label>
              <input type='text' value={totalWeeklyLessons} disabled />
            </div>
            <div className='input_count_schedule'>
              <label>Загальна кількість предметів</label>
              <input type='text' value={initialSubjectsData.length} disabled />
            </div>
            <div className='input_count_schedule'>
              <label>Всього в тиждень:</label>
              <div className='input_count_type'>
                <div className='input_group_accordion'>
                  <label>Лекцій</label>
                  <input type='text' value={totalCounts.lectures} disabled />
                </div>
                <div className='input_group_accordion'>
                  <label>Лабораторних</label>
                  <input type='text' value={totalCounts.labs} disabled />
                </div>
                <div className='input_group_accordion'>
                  <label>Практик</label>
                  <input type='text' value={totalCounts.practices} disabled />
                </div>
              </div>
            </div>
          </div>

          <div className='button_from_modal'>
            <button type='button' onClick={handleSubmit}>
              Зберегти зміни
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScheduleModal;
