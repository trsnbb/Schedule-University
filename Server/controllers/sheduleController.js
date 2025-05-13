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

    // Знаходимо або створюємо спеціалізацію
    let specialization = await Specialization.findOne({
      name: specializationName,
    });
    if (!specialization) {
      specialization = await Specialization.create({
        name: specializationName,
      });
    }

    // Знаходимо або створюємо курс
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

    // Знаходимо або створюємо групу
    let group = await Group.findOne({ groupNumber, courseId: course._id });
    if (!group) {
      group = await Group.create({ groupNumber, courseId: course._id });
      course.groups.push(group._id);
      await course.save();
    }

    // Знаходимо або створюємо підгрупу
    let subGroup = await SubGroup.findOne({
      subgroupNumber,
      groupId: group._id,
    });
    if (!subGroup) {
      subGroup = await SubGroup.create({ subgroupNumber, groupId: group._id });
      group.subgroups.push(subGroup._id);
      await group.save();
    }

    // Генеруємо розклад
    const weeksInSemester = 18;
    const scheduleDays = [1, 2, 3, 4, 5];
    const occupiedPairs = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    const getAvailablePair = (day) => {
      for (let pair = 1; pair <= 4; pair++) {
        if (!occupiedPairs[day].includes(pair)) {
          return pair; // Повертаємо першу доступну пару
        }
      }
      return null; // Якщо всі пари зайняті, повертаємо null
    };

    const getRandomDayAndPair = () => {
      let day, pair, tries = 0;

      do {
        day = scheduleDays[Math.floor(Math.random() * scheduleDays.length)];
        pair = getAvailablePair(day);
        tries++;
      } while (!pair && tries <= 10);

      if (pair) {
        occupiedPairs[day].push(pair);
        console.log("Зайняті пари:", occupiedPairs);
      }

      return pair ? { day, pair } : null;
    };

    let weeklySchedule = lessons
      .map((lesson) => {
        const weeklyLectures = Math.max(
          1,
          Math.floor(lesson.countLec / weeksInSemester)
        );

        let lessonSchedule = [];
        for (let i = 0; i < weeklyLectures; i++) {
          const result = getRandomDayAndPair();
          if (result) {
            const { day, pair } = result;
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
          } else {
            console.warn("Не вдалося знайти доступну пару для лекції");
          }
        }
        return lessonSchedule;
      })
      .flat();

    console.log("Weekly Schedule:", weeklySchedule);

    if (weeklySchedule.length === 0) {
      return res
        .status(400)
        .json({ message: "Немає доступних пар для цього розкладу" });
    }

    weeklySchedule = weeklySchedule.slice(0, 22);

    // Створюємо новий розклад
   // Створюємо новий розклад
const newSchedule = new Schedule({
  subGroupId: new mongoose.Types.ObjectId(subGroup._id), // Використовуємо 'new'
  groupId: new mongoose.Types.ObjectId(group._id), // Використовуємо 'new'
  courseId: new mongoose.Types.ObjectId(course._id), // Використовуємо 'new'
  lessons: weeklySchedule,
  specializationId: new mongoose.Types.ObjectId(specialization._id), // Використовуємо 'new'
});

    await newSchedule.save();
    res.status(200).json(newSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating schedule" });
  }
};

export const getScheduleByGroup = async (req, res) => {
  try {
    const { specializationId, courseId, groupId } = req.query;

    console.log("Запитані параметри:", { specializationId, courseId, groupId });

    if (!specializationId || !courseId || !groupId) {
      return res
        .status(400)
        .json({ message: "Вкажіть specializationId, courseId і groupId" });
    }

    // Використовуємо specializationId для пошуку
    const specializationDoc = await Specialization.findById(specializationId);
    if (!specializationDoc) {
      return res.status(404).json({ message: "Спеціалізація не знайдена" });
    }

    // Використовуємо courseId для пошуку
    const courseDoc = await Course.findOne({
      _id: courseId,
      specializationId: specializationDoc._id,
    });
    if (!courseDoc) {
      return res.status(404).json({ message: "Курс не знайдено" });
    }

    // Використовуємо groupId для пошуку
    const groupDoc = await Group.findOne({
      _id: groupId,
      courseId: courseDoc._id,
    });
    if (!groupDoc) {
      return res.status(404).json({ message: "Групу не знайдено" });
    }

    // Шукаємо розклад
    const schedule = await Schedule.findOne({
      groupId: groupDoc._id,
    });

    console.log("Знайдений розклад:", schedule);

    if (!schedule || schedule.length === 0) {
      return res.status(404).json({ message: "Розклад не знайдено" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error("Помилка отримання розкладу:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};
