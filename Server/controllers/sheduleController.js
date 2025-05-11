import mongoose from "mongoose";
import Schedule from "../models/Schedule.js";
import { Course, Group, SubGroup, Specialization } from "../models/Group.js";

export const createSchedule = async (req, res) => {
  try {
    const {
      specializationName,
      courseNumber,
      groupNumber,
      subgroupNumber,
      lessons,
    } = req.body;

    let specialization = await Specialization.findOne({ name: specializationName });
    if (!specialization) {
      specialization = await Specialization.create({ name: specializationName });
    }

    let course = await Course.findOne({
      courseNumber,
      specializationId: specialization._id,
    });
    if (!course) {
      course = await Course.create({
        courseNumber,
        specializationId: specialization._id,
      });
      specialization.courses.push(course._id);
      await specialization.save();
    }

    let group = await Group.findOne({ groupNumber, courseId: course._id });
    if (!group) {
      group = await Group.create({ groupNumber, courseId: course._id });
      course.groups.push(group._id);
      await course.save();
    }

    let subGroup = await SubGroup.findOne({
      subgroupNumber,
      groupId: group._id,
    });
    if (!subGroup) {
      subGroup = await SubGroup.create({ subgroupNumber, groupId: group._id });
      group.subgroups.push(subGroup._id);
      await group.save();
    }

let weeklySchedule = lessons.map((lesson) => {
  const weeksInSemester = 18;
  let weeklyLectures = Math.floor(lesson.countLec / weeksInSemester);
  let weeklyPracticals = Math.floor(lesson.countPrac / weeksInSemester);
  let weeklyLabs = Math.floor(lesson.countLab / weeksInSemester);

  const scheduleDays = [1, 2, 3, 4, 5];
  const occupiedPairs = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  const getAvailablePair = (day) => {
    for (let pair = 1; pair <= 4; pair++) {
      if (!occupiedPairs[day].includes(pair)) {
        return pair;
      }
    }
    return null;
  };

  const getRandomDayAndPair = () => {
    let day, pair, tries = 0;
    do {
      day = scheduleDays[Math.floor(Math.random() * scheduleDays.length)];
      pair = getAvailablePair(day);
      tries++;
    } while (!pair && tries <= 10);

    if (pair) occupiedPairs[day].push(pair);
    return { day, pair };
  };

  let lessonSchedule = [];
  for (let i = 0; i < weeklyLectures; i++) {
    const { day, pair } = getRandomDayAndPair();
    lessonSchedule.push({
      type: "lec",
      day: [day],
      pairNumber: [pair],
      groupInfo: {
        specialization: specializationName,
        course: courseNumber,
        group: groupNumber,
      },
    });
  }
  return lessonSchedule;
}).flat();

    weeklySchedule = weeklySchedule.slice(0, 22);

    const newSchedule = new Schedule({
      subGroupId: subGroup._id,
      groupId: group._id,
      courseId: course._id,
      lessons: weeklySchedule,
    });

    await newSchedule.save();
    res.status(200).json(newSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating schedule" });
  }
};