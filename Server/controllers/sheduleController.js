import mongoose from "mongoose";
import Schedule from "../models/Schedule.js";
import { Course, Group, Specialization } from "../models/Group.js";

export const createSchedule = async (req, res) => {
  try {
    const { specializationName, courseNumber, groupNumber, shift, lessons } =
      req.body;

    let specialization = await Specialization.findOne({
      name: specializationName,
    });
    if (!specialization) {
      specialization = await Specialization.create({
        name: specializationName,
      });
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

    const weeksInSemester = 18;
    const scheduleDays = [1, 2, 3, 4, 5];

    const groupOccupiedPairs = {
      1: new Set(),
      2: new Set(),
      3: new Set(),
      4: new Set(),
      5: new Set(),
    };

    // Зайнятість викладачів
    const teacherLessonsMap = {};
    const allSchedules = await Schedule.find({}).lean();
    for (const sch of allSchedules) {
      for (const lesson of sch.lessons) {
        const key = lesson.teacherId.toString();
        if (!teacherLessonsMap[key]) teacherLessonsMap[key] = new Set();
        for (const d of lesson.day) {
          for (const p of lesson.pairNumber) {
            teacherLessonsMap[key].add(`${d}-${p}`);
          }
        }
      }
    }

    const isTeacherBusy = (teacherId, day, pair) => {
      const key = teacherId.toString();
      return teacherLessonsMap[key]?.has(`${day}-${pair}`);
    };

    const findFirstFreeSlot = (teacherId) => {
      for (const day of scheduleDays) {
        for (let pair = 1; pair <= 6; pair++) {
          const groupBusy = groupOccupiedPairs[day].has(pair);
          const teacherBusy = isTeacherBusy(teacherId, day, pair);
          if (!groupBusy && !teacherBusy) {
            return { day, pair };
          } else {
            console.log(
              `🔍 Пропущено: день ${day}, пара ${pair} — група: ${groupBusy}, викладач: ${teacherBusy}`
            );
          }
        }
      }
      return null;
    };

    const weeklySchedule = [];

    for (const lesson of lessons) {
      const lessonTypes = [
        { type: "lec", count: lesson.countLec || 0 },
        { type: "prac", count: lesson.countPrac || 0 },
        { type: "lab", count: lesson.countLab || 0 },
      ];

      for (const lt of lessonTypes) {
        const weeklyCount = Math.floor(lt.count / weeksInSemester);
        if (weeklyCount === 0) continue;

        for (let i = 0; i < weeklyCount; i++) {
          const teacherId = new mongoose.Types.ObjectId(lesson.teacherId);
          const slot = findFirstFreeSlot(teacherId);

          if (slot) {
            const { day, pair } = slot;

            teacherLessonsMap[teacherId] =
              teacherLessonsMap[teacherId] || new Set();
            teacherLessonsMap[teacherId].add(`${day}-${pair}`);
            groupOccupiedPairs[day].add(pair);
            console.log("🧪 Додається заняття з форматом:", lesson.format);

            weeklySchedule.push({
              type: lt.type,
              day: [day],
              pairNumber: [pair],
              format: lesson.format,
              weekType: lesson.weekType,
              predmetId: new mongoose.Types.ObjectId(lesson.predmetId),
              teacherId,
              shift: shift,
              link: lesson.link || "",
              groupInfo: {
                groupInfo: {
                  specialization: specialization._id,
                  course: course._id,
                  group: group._id,
                },
              },
              countLec: lesson.countLec || 0,
              countPrac: lesson.countPrac || 0,
              countLab: lesson.countLab || 0,
            });
          } else {
            return res.status(400).json({
              message: `Оберіть іншого викладача. У цього викладача немає вільних пар для заняття`,
            });
          }
        }
      }
    }

    if (weeklySchedule.length === 0) {
      return res
        .status(400)
        .json({ message: "Немає доступних пар для цього розкладу" });
    }

    const newSchedule = new Schedule({
      groupId: group._id,
      courseId: course._id,
      specializationId: specialization._id,
      shift: shift,
      lessons: weeklySchedule,
    });

    await newSchedule.save();
    res.status(200).json(newSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating schedule" });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { groupId, lessons, shift } = req.body;
    console.log(shift, "shift");

    if (!groupId || !Array.isArray(lessons)) {
      return res
        .status(400)
        .json({ message: "Потрібно передати groupId і масив lessons" });
    }

    const schedule = await Schedule.findOne({ groupId });

    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Розклад для цієї групи не знайдено" });
    }

    if (lessons.length === 0) {
      return res
        .status(400)
        .json({ message: "Список занять порожній — нічого оновлювати" });
    }

    const weeksInSemester = 18;
    const scheduleDays = [1, 2, 3, 4, 5];
    const occupiedPairs = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    const getAvailablePair = (day) => {
      for (let pair = 1; pair <= 6; pair++) {
        if (!occupiedPairs[day].includes(pair)) {
          return pair;
        }
      }
      return null;
    };

    const getRandomDayAndPair = () => {
      let tries = 0;
      while (tries < 50) {
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

    // Очистити старі заняття
    schedule.lessons = [];

    schedule.shift = shift;

    for (const lesson of lessons) {
      const {
        predmetId,
        teacherId,
        countLec = 0,
        countPrac = 0,
        countLab = 0,
      } = lesson;

      const lessonTypes = [
        { type: "lec", count: countLec },
        { type: "prac", count: countPrac },
        { type: "lab", count: countLab },
      ];

      for (const lt of lessonTypes) {
        const weeklyCount = Math.floor(lt.count / weeksInSemester);
        if (weeklyCount === 0) continue;

        for (let i = 0; i < weeklyCount; i++) {
          let day = lesson.day?.[i];
          let pairNumber = lesson.pairNumber?.[i];

          // Якщо заняття змінено або позиції не задано — призначити автоматично
          if (!day || !pairNumber) {
            const result = getRandomDayAndPair();
            if (result) {
              day = result.day;
              pairNumber = result.pair;
            }
          }

          schedule.lessons.push({
            predmetId: new mongoose.Types.ObjectId(predmetId),
            teacherId: new mongoose.Types.ObjectId(teacherId),
            type: lt.type,
            format: lesson.format,
            weekType: lesson.weekType,
            day: [day],
            pairNumber: [pairNumber],
            link: lesson.link || "",
            countLec,
            countPrac,
            countLab,
          });
        }
      }
    }

    await schedule.save();
    res.status(200).json({ message: "Розклад оновлено", schedule });
  } catch (error) {
    console.error("Помилка оновлення розкладу:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

export const getScheduleByGroup = async (req, res) => {
  try {
    const { specializationId, courseId, groupId, date } = req.query;

    if (!specializationId || !courseId || !groupId) {
      return res
        .status(400)
        .json({ message: "Вкажіть specializationId, courseId і groupId" });
    }

    const specializationDoc = await Specialization.findById(specializationId);
    const courseDoc = await Course.findOne({
      _id: courseId,
      specializationId: specializationDoc._id,
    });
    const groupDoc = await Group.findOne({
      _id: groupId,
      courseId: courseDoc._id,
    });

    if (!specializationDoc || !courseDoc || !groupDoc) {
      return res.status(404).json({ message: "Група або курс не знайдено" });
    }

    const schedule = await Schedule.findOne({ groupId: groupDoc._id }).populate(
      {
        path: "lessons",
        populate: [{ path: "teacherId", model: "User" }, { path: "predmetId" }],
      }
    );

    if (!schedule) {
      return res.status(404).json({ message: "Розклад не знайдено" });
    }

    let lessons = schedule.lessons.filter((lesson) => {
      // Постійна пара: включаємо завжди
      if (!lesson.temporary) return true;

      // Тимчасова пара: включаємо тільки якщо співпадає дата
      if (lesson.temporary && date) {
        const lessonDate = new Date(lesson.date).toISOString().split("T")[0];
        const requestDate = new Date(date).toISOString().split("T")[0];
        return lessonDate === requestDate;
      }

      return false;
    });

    res.status(200).json({ ...schedule.toObject(), lessons });
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

export const addLesson = async (req, res) => {
  try {
    const { groupId, day, pairNumber, lesson } = req.body;

    const schedule = await Schedule.findOne({ groupId });
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    if (lesson.isEvent) {
      // Додаємо подію
      const newEvent = {
        isEvent: true,
        eventTitle: lesson.eventTitle || "Подія",
        descriptionEvent: lesson.descriptionEvent || "",
        day: [day],
        pairNumber: [pairNumber],
        temporary: lesson.temporary || false,
      };

      if (lesson.temporary && lesson.date) {
        newEvent.date = lesson.date;
      }

      schedule.lessons.push(newEvent);
      await schedule.save();
      return res.json({ success: true, schedule });
    }

    // Якщо це не подія — звичайна пара
    const allowedTypes = ["lec", "lab", "prac"];
    if (!allowedTypes.includes(lesson.type)) {
      return res
        .status(400)
        .json({ error: `Невірний тип заняття: ${lesson.type}` });
    }

    if (!lesson.temporary) {
      const isOccupied = schedule.lessons.some(
        (l) => l.day.includes(day) && l.pairNumber.includes(pairNumber)
      );

      if (isOccupied) {
        return res.status(409).json({
          error: `Пара вже зайнята на день ${day}, пара №${pairNumber}`,
        });
      }
    }

    const newLesson = {
      ...lesson,
      day: lesson.temporary ? [] : [day],
      pairNumber: [pairNumber],
    };

    if (lesson.temporary && lesson.date) {
      newLesson.date = lesson.date;
    }

    schedule.lessons.push(newLesson);
    await schedule.save();
    res.json({ success: true, schedule });
  } catch (error) {
    console.error("Error adding lesson or event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
