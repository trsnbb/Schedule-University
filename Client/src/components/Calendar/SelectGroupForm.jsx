import { useEffect, useState } from "react";
import {
  fetchAllSpecializations,
  fetchCoursesBySpecialization,
  fetchGroupsByCourse,
} from "./../../axios.js";
import CustomDropdown from "./../CustomDropdown/CustomDropdown.jsx"; // Шлях онови відповідно до структури

const SelectGroupForm = ({ onChange }) => {
  const [specializations, setSpecializations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);

  const [selectedSpec, setSelectedSpec] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const loadSpecializations = async () => {
      const specs = await fetchAllSpecializations();
      setSpecializations(specs);
    };
    loadSpecializations();
  }, []);

  useEffect(() => {
    if (selectedSpec) {
      fetchCoursesBySpecialization(selectedSpec).then(setCourses);
      setSelectedCourse(null);
      setGroups([]);
    }
  }, [selectedSpec]);

  useEffect(() => {
    if (selectedCourse) {
      fetchGroupsByCourse(selectedCourse).then(setGroups);
      setSelectedGroup(null);
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
        onChange={(e) => setSelectedSpec(e.target.value)}
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
        onChange={(e) => setSelectedCourse(e.target.value)}
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
        onChange={(e) => setSelectedGroup(e.target.value)}
        placeholder="Виберіть групу"
        minWidth={250}
      />
    </>
  );
};

export default SelectGroupForm;
