import { useEffect, useState } from "react";
import {
  fetchAllSpecializations,
  fetchCoursesBySpecialization,
  fetchGroupsByCourse,
} from "./../../axios.js";
import CustomDropdown from "./../CustomDropdown/CustomDropdown.jsx";

const SelectGroupForm = ({ onChange }) => {
  const [specializations, setSpecializations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);

  const [selectedSpec, setSelectedSpec] = useState(localStorage.getItem("selectedSpec") || null);
  const [selectedCourse, setSelectedCourse] = useState(localStorage.getItem("selectedCourse") || null);
  const [selectedGroup, setSelectedGroup] = useState(localStorage.getItem("selectedGroup") || null);

  useEffect(() => {
    const loadSpecializations = async () => {
      const specs = await fetchAllSpecializations();
      setSpecializations(specs);
    };
    loadSpecializations();
  }, []);

  useEffect(() => {
    if (selectedSpec) {
      fetchCoursesBySpecialization(selectedSpec).then((courses) => {
        setCourses(courses);

        // якщо є збережений курс, перевірити чи він належить до цієї спеціальності
        const storedCourse = localStorage.getItem("selectedCourse");
        if (storedCourse && courses.some((c) => c._id === storedCourse)) {
          setSelectedCourse(storedCourse);
        } else {
          setSelectedCourse(null);
          localStorage.removeItem("selectedCourse");
        }
        setGroups([]);
      });
    }
  }, [selectedSpec]);

  useEffect(() => {
    if (selectedCourse) {
      fetchGroupsByCourse(selectedCourse).then((groups) => {
        setGroups(groups);

        const storedGroup = localStorage.getItem("selectedGroup");
        if (storedGroup && groups.some((g) => g._id === storedGroup)) {
          setSelectedGroup(storedGroup);
        } else {
          setSelectedGroup(null);
          localStorage.removeItem("selectedGroup");
        }
      });
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedGroup) {
      const groupData = {
        specializationId: selectedSpec,
        courseId: selectedCourse,
        groupId: selectedGroup,
      };
      onChange?.(groupData);
    }
  }, [selectedGroup]);

  return (
    <>
      <CustomDropdown
        name="specialization"
        value={selectedSpec}
        options={specializations.map((spec) => ({
          value: spec._id,
          label: spec.name,
        }))}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedSpec(value);
          localStorage.setItem("selectedSpec", value);
        }}
        placeholder="Виберіть спеціальність"
        minWidth={250}
      />

      <CustomDropdown
        name="course"
        value={selectedCourse}
        options={courses.map((course) => ({
          value: course._id,
          label: `${course.courseNumber} курс`,
        }))}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedCourse(value);
          localStorage.setItem("selectedCourse", value);
        }}
        placeholder="Виберіть курс"
        minWidth={250}
      />

      <CustomDropdown
        name="group"
        value={selectedGroup}
        options={groups.map((group) => ({
          value: group._id,
          label: `${group.groupNumber} група`,
        }))}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedGroup(value);
          localStorage.setItem("selectedGroup", value);
        }}
        placeholder="Виберіть групу"
        minWidth={250}
      />
    </>
  );
};

export default SelectGroupForm;
