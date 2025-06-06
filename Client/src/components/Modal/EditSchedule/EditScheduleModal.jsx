import React, { useRef, useState, useEffect } from "react";
import "./../../CustomRadio.css";
import close from "./../../../image/close.svg";
import dzyobik from "./../../../image/dzyobik.svg";
import back from "./../../../image/Vector.svg";
import axios from "axios";
import { fetchAllTeachers } from "../../../axios";
import CustomDropdown from "./../../CustomDropdown/CustomDropdown.jsx";
import { updateSchedule, fetchSchedule } from "../../../axios";
import EditGeneralScheduleModal from "./EditGeneralScheduleModal.jsx";

const EditScheduleModal = ({
  onClose,
  onBack,
  initialSubjectsData = [],
  specializationId,
  courseId,
  groupId,
  format,
  weekType,
  shift,
}) => {
  const modalRef = useRef();
  const accordionRef = useRef();
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [subjectCounts, setSubjectCounts] = useState({});
  const [subjectTeacherLinks, setSubjectTeacherLinks] = useState({});
  const [subjectLinks, setSubjectLinks] = useState({});
  const [subjectRooms, setSubjectRooms] = useState({});

  const handleRoomChange = (subjectId) => (e) => {
    const { value } = e.target;
    setSubjectRooms((prev) => ({
      ...prev,
      [subjectId]: value,
    }));
  };
  useEffect(() => {
    const counts = {};
    const links = {};
    const teacherLinks = {};
    const auditorium = {};

    initialSubjectsData.forEach((subject) => {
      counts[subject._id] = {
        lectures: subject.countLec || 0,
        labs: subject.countLab || 0,
        practices: subject.countPrac || 0,
      };
      links[subject._id] = subject.link || "";
      teacherLinks[subject._id] =
        subject.teacherId?._id || subject.teacherId || "";
      auditorium[subject._id] = subject.auditorium || "";
    });

    setSubjectCounts(counts);
    setSubjectLinks(links);
    setSubjectTeacherLinks(teacherLinks);
    setSubjectRooms(auditorium);
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

  const teacherOptions = teachers.map((teacher) => ({
    value: teacher._id,
    label: `${teacher.teacherName} (${teacher.teacherEmail})`,
  }));

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
  const selectedSubject = initialSubjectsData[openAccordionIndex];

  const handleSubmit = async () => {
    try {
      const updatedLessons = initialSubjectsData.map((subject) => {
        const subjectId = subject._id;
        const teacherId = subjectTeacherLinks[subjectId] || "";
        const counts = subjectCounts[subjectId] || {};

        const isOnline = format === "online";
        const link = isOnline ? subjectLinks[subjectId] || "" : "";
        const auditorium = !isOnline ? subjectRooms[subjectId] || "" : "";

        return {
          predmetId: subjectId,
          teacherId,
          format,
          weekType,
          countLec: counts.lectures || 0,
          countLab: counts.labs || 0,
          countPrac: counts.practices || 0,
          link,
          auditorium,
        };
      });

      const payload = {
        groupId,
        lessons: updatedLessons,
        shift,
      };

      await updateSchedule(payload);
      onClose();
    } catch (error) {
      console.error("Помилка при оновленні розкладу:", error);
    }
  };

  const weeksInSemester = 18;

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
  const weeklyCounts = Object.values(subjectCounts).reduce(
    (acc, curr) => {
      acc.lectures += curr.lectures
        ? Math.max(1, Math.floor(curr.lectures / weeksInSemester))
        : 0;
      acc.labs += curr.labs
        ? Math.max(1, Math.floor(curr.labs / weeksInSemester))
        : 0;
      acc.practices += curr.practices
        ? Math.max(1, Math.floor(curr.practices / weeksInSemester))
        : 0;
      return acc;
    },
    { lectures: 0, labs: 0, practices: 0 }
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
                          type='number'
                          min='0'
                          placeholder='0'
                          value={subjectCounts[subject._id]?.lectures || ""}
                          onChange={handleCountChange(subject._id, "lectures")}
                        />
                      </div>
                      <div className='input_group_accordion'>
                        <label>Кількість практик</label>
                        <input
                          type='number'
                          min='0'
                          placeholder='0'
                          value={subjectCounts[subject._id]?.practices || ""}
                          onChange={handleCountChange(subject._id, "practices")}
                        />
                      </div>
                      <div className='input_group_accordion'>
                        <label>Кількість лабораторних</label>
                        <input
                          type='number'
                          min='0'
                          placeholder='0'
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
                          options={teachers.map((t) => ({
                            label: t.teacherName,
                            value: t.teacherId,
                          }))}
                          value={subjectTeacherLinks[subject._id] || ""}
                          onChange={handleTeacherChange(subject._id)}
                          placeholder='Оберіть викладача'
                          minWidth={200}
                        />
                      </div>
                      <div className='input_group_accordion'>
                        <label>
                          {" "}
                          {format === "online"
                            ? "Введіть посилання"
                            : "Введіть авдиторію"}
                        </label>
                        <input
                          type='text'
                          value={
                            format === "online"
                              ? subjectLinks[subject._id] || ""
                              : subjectRooms[subject._id] || ""
                          }
                          onChange={
                            format === "online"
                              ? handleLinkChange(subject._id)
                              : handleRoomChange(subject._id)
                          }
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
                  <input type='text' value={weeklyCounts.lectures} disabled />
                </div>
                <div className='input_group_accordion'>
                  <label>Лабораторних</label>
                  <input type='text' value={weeklyCounts.labs} disabled />
                </div>
                <div className='input_group_accordion'>
                  <label>Практик</label>
                  <input type='text' value={weeklyCounts.practices} disabled />
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
