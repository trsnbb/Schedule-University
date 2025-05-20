import mongoose from "mongoose";
import Schedule from "../models/Schedule.js";
import { Course, Group, Specialization } from "../models/Group.js";
import Predmet from "../models/Predmet.js";

export const createSchedule = async (req, res) => {
  try {
    const { specializationName, courseNumber, groupNumber, lessons } = req.body;

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

    // Генеруємо розклад
    const weeksInSemester = 18;
    const scheduleDays = [1, 2, 3, 4, 5];
    const occupiedPairs = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    const getAvailablePair = (day) => {
      for (let pair = 1; pair <= 6; pair++) {
        // Раніше було 4
        if (!occupiedPairs[day].includes(pair)) {
          return pair;
        }
      }
      return null;
    };

    const getRandomDayAndPair = () => {
      let tries = 0;
      while (tries < 50) {
        // Було 10
        const day =
          scheduleDays[Math.floor(Math.random() * scheduleDays.length)];
        const pair = getAvailablePair(day);
        if (pair !== null) {
          occupiedPairs[day].push(pair);
          return { day, pair };
        }
        tries++;
      }
      return null;
    };

   
   let weeklySchedule = [];

    for (const lesson of lessons) {
      const lessonTypes = [
        { type: "lec", count: lesson.countLec || 0 },
        { type: "prac", count: lesson.countPrac || 0 },
        { type: "lab", count: lesson.countLab || 0 },
      ];

      for (const lt of lessonTypes) {
        const weeklyCount = Math.max(1, Math.floor(lt.count / weeksInSemester));

        for (let i = 0; i < weeklyCount; i++) {
          const result = getRandomDayAndPair();
          if (result) {
            const { day, pair } = result;
            weeklySchedule.push({
              type: lt.type,
              day: [day],
              pairNumber: [pair],
              format: lesson.format,
              weekType: lesson.weekType,
              predmetId: new mongoose.Types.ObjectId(lesson.predmetId),
              teacherId: new mongoose.Types.ObjectId(lesson.teacherId),
              groupInfo: {
                specialization: specializationName,
                course: courseNumber,
                group: groupNumber,
              },
            });
          } else {
            console.warn(`❌ Не вдалося призначити заняття типу ${lt.type}: ${lesson.predmetId} - ${lesson.teacherId}`);
          }
        }
      }
    }


    if (weeklySchedule.length === 0) {
      return res
        .status(400)
        .json({ message: "Немає доступних пар для цього розкладу" });
    }

    weeklySchedule = weeklySchedule.slice(0, 22);


    const newSchedule = new Schedule({
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

    const specializationDoc = await Specialization.findById(specializationId);
    if (!specializationDoc) {
      return res.status(404).json({ message: "Спеціалізація не знайдена" });
    }

    const courseDoc = await Course.findOne({
      _id: courseId,
      specializationId: specializationDoc._id,
    });
    if (!courseDoc) {
      return res.status(404).json({ message: "Курс не знайдено" });
    }

    const groupDoc = await Group.findOne({
      _id: groupId,
      courseId: courseDoc._id,
    });
    if (!groupDoc) {
      return res.status(404).json({ message: "Групу не знайдено" });
    }

    // Важливо: оголошення змінної ПЕРЕД блоком try
    let schedule;

    try {
      schedule = await Schedule.findOne({ groupId: groupDoc._id })
        .populate({
          path: "lessons.predmetId",
          model: "Predmet",
        })
        .populate({
          path: "lessons.teacherId",
          model: "User",
        });

      if (!schedule) {
        return res.status(404).json({ message: "Розклад не знайдено" });
      }


      return res.status(200).json(schedule);
    } catch (err) {
      console.error("Помилка при отриманні розкладу:", err);
      return res.status(500).json({ message: "Помилка сервера при популяції" });
    }
  } catch (error) {
    console.error("Помилка отримання розкладу:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

// GET /api/specializations
export const getAllSpecializations = async (req, res) => {
  try {
    const specs = await Specialization.find();
    res.json(specs);
  } catch (err) {
    res.status(500).json({ message: "Помилка отримання спеціальностей" });
  }
};

// GET /api/courses?specializationId=...
export const getCoursesBySpecialization = async (req, res) => {
  try {
    const { specializationId } = req.query;
    const courses = await Course.find({ specializationId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Помилка отримання курсів" });
  }
};
// GET /api/groups?courseId=...
export const getGroupsByCourse = async (req, res) => {
  try {
    const { courseId } = req.query;
    const groups = await Group.find({ courseId });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Помилка отримання груп" });
  }
};
