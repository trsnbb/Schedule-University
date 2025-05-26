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
    const scheduleDays = [1, 2, 3, 4, 5, 6];

    const groupOccupiedPairs = {
      1: new Set(),
      2: new Set(),
      3: new Set(),
      4: new Set(),
      5: new Set(),
      6: new Set(),
    };

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

    const getRandomDayAndPair = (teacherId) => {
      const maxTries = 50;

      const isSlotFree = (day, pair) => {
        const groupBusy = groupOccupiedPairs[day].has(pair);
        const teacherBusy = isTeacherBusy(teacherId, day, pair);
        return !groupBusy && !teacherBusy;
      };

      for (let tries = 0; tries < maxTries; tries++) {
        const day =
          scheduleDays[Math.floor(Math.random() * scheduleDays.length)];
        const pair = Math.floor(Math.random() * 4) + 1;
        if (isSlotFree(day, pair)) {
          groupOccupiedPairs[day].add(pair);
          teacherLessonsMap[teacherId.toString()].add(`${day}-${pair}`);
          return { day, pair };
        }
      }

      for (let tries = 0; tries < maxTries; tries++) {
        const day =
          scheduleDays[Math.floor(Math.random() * scheduleDays.length)];
        const pair = 5;
        if (isSlotFree(day, pair)) {
          groupOccupiedPairs[day].add(pair);
          teacherLessonsMap[teacherId.toString()].add(`${day}-${pair}`);
          return { day, pair };
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
          if (!teacherLessonsMap[teacherId.toString()]) {
            teacherLessonsMap[teacherId.toString()] = new Set();
          }

          const slot = getRandomDayAndPair(teacherId);
          if (slot) {
            const { day, pair } = slot;

            const lessonData = {
              type: lt.type,
              day: [day],
              pairNumber: [pair],
              format: lesson.format,
              weekType: lesson.weekType,
              predmetId: new mongoose.Types.ObjectId(lesson.predmetId),
              teacherId,
              shift: shift,
              groupInfo: {
                specialization: specialization._id,
                course: course._id,
                group: group._id,
              },
              countLec: lesson.countLec || 0,
              countPrac: lesson.countPrac || 0,
              countLab: lesson.countLab || 0,
            };

            const format = lesson.format.toLowerCase();

            if (format === "online") {
              lessonData.link = lesson.link || "";
            } else if (format === "offline") {
              lessonData.auditorium = lesson.auditorium || "";
            }

            weeklySchedule.push(lessonData);
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
      if (!lesson.temporary) return true;

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

export const getScheduleByTeacher = async (req, res) => {
  try {
    const { teacherId, date } = req.query;

    if (!teacherId) {
      return res.status(400).json({ message: "Не вказано teacherId" });
    }

    const schedules = await Schedule.find({ "lessons.teacherId": teacherId });
    if (!schedules || schedules.length === 0) {
      return res
        .status(404)
        .json({ message: "Розклади для викладача не знайдено" });
    }

    const result = [];

    for (const schedule of schedules) {
      const filteredLessons = schedule.lessons.filter((lesson) => {
        const isSameTeacher = lesson.teacherId?.toString() === teacherId;

        if (!isSameTeacher) return false;

        if (!lesson.temporary) return true;

        if (lesson.temporary && date) {
          const lessonDate = new Date(lesson.date).toISOString().split("T")[0];
          const requestDate = new Date(date).toISOString().split("T")[0];
          return lessonDate === requestDate;
        }

        return false;
      });

      const populatedLessons = await Promise.all(
        filteredLessons.map(async (lesson) => {
          const populatedTeacher = await mongoose
            .model("User")
            .findById(lesson.teacherId);
          const populatedPredmet = await mongoose
            .model("Predmet")
            .findById(lesson.predmetId);

          return {
            ...lesson.toObject(),
            teacherId: populatedTeacher,
            predmetId: populatedPredmet,
          };
        })
      );

      result.push({
        ...schedule.toObject(),
        lessons: populatedLessons,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Помилка отримання розкладу для викладача:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

export const getAllSpecializations = async (req, res) => {
  try {
    const specs = await Specialization.find();
    res.json(specs);
  } catch (err) {
    res.status(500).json({ message: "Помилка отримання спеціальностей" });
  }
};

export const getCoursesBySpecialization = async (req, res) => {
  try {
    const { specializationId } = req.query;
    const courses = await Course.find({ specializationId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Помилка отримання курсів" });
  }
};
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
    const { groupId, pairNumber, lesson } = req.body;

    const schedule = await Schedule.findOne({ groupId });
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    const shift = schedule.shift || 1;

    const shiftSchedules = {
      1: [
        { start: "08:00", end: "09:20" },
        { start: "09:40", end: "11:00" },
        { start: "11:20", end: "12:40" },
        { start: "13:00", end: "14:20" },
        { start: "14:40", end: "16:00" },
      ],
      2: [
        { start: "13:00", end: "14:20" },
        { start: "14:40", end: "16:00" },
        { start: "16:20", end: "17:40" },
        { start: "18:00", end: "19:20" },
        { start: "19:40", end: "21:00" },
      ],
    };

    const lessonsSchedule = shiftSchedules[shift];

    if (lesson.isEvent) {
      if (!lesson.date) {
        return res.status(400).json({ error: "Для події обов'язкова дата" });
      }

      const dayFromDate = new Date(lesson.date).getDay();
      let determinedPairNumber = pairNumber;

      if (lesson.time) {
        const [startTimeRaw] = lesson.time.split("-");
        const startTime = startTimeRaw.trim();

        const matchedIndex = lessonsSchedule.findIndex((pair) => {
          return startTime <= pair.start;
        });

        if (matchedIndex !== -1) {
          determinedPairNumber = matchedIndex + 1;
        } else {
          if (shift === 1 && startTime >= "16:00") {
            determinedPairNumber = 5;
          } else if (shift === 2 && startTime < "13:00") {
            determinedPairNumber = 1;
          } else {
            return res.status(400).json({
              error: `Не вдалося визначити номер пари за часом: ${lesson.time}`,
            });
          }
        }
      }

      if (!determinedPairNumber) {
        return res
          .status(400)
          .json({ error: "Не вказано номер пари або час для визначення пари" });
      }

      const newEvent = {
        isEvent: true,
        eventTitle: lesson.eventTitle || "Подія",
        descriptionEvent: lesson.descriptionEvent || "",
        date: lesson.date,
        time: lesson.time || "",
        format: lesson.format || "—",
        pairNumber: [determinedPairNumber],
        day: [dayFromDate],
        temporary: lesson.ен || false,
      };

      schedule.lessons.push(newEvent);
      await schedule.save();
      return res.json({ success: true, schedule });
    }

    const allowedTypes = ["lec", "lab", "prac"];
    if (!allowedTypes.includes(lesson.type)) {
      return res
        .status(400)
        .json({ error: `Невірний тип заняття: ${lesson.type}` });
    }

    const isTemporary = lesson.lessonType === "single";
    const day = isTemporary ? new Date(lesson.date).getDay() : req.body.day;

    if (!isTemporary) {
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
      temporary: isTemporary,
      day: isTemporary ? [new Date(lesson.date).getDay()] : [day],
      pairNumber: [pairNumber],
    };

    if (isTemporary && lesson.date) {
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
