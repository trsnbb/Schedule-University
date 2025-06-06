import Predmet from "../models/Predmet.js";
import User from "../models/User.js"; 

export const addPredmetToTeacher = async (req, res) => {
  try {
    const { teacherName, teacherEmail, predmet } = req.body;

    const user = await User.findOne({ email: teacherEmail });
    let subject = await Predmet.findOne({ predmet });

    if (user) {
      if (!subject) {
        const newSubject = new Predmet({
          predmet,
          teachers: [{ teacherId: user._id, teacherEmail, teacherName }],
        });
        await newSubject.save();
        return res.status(201).json({
          message: "Предмет створено і викладач доданий",
          predmet: newSubject,
        });
      }

      if (!subject.teachers.some(t => t.teacherEmail === teacherEmail)) {
        subject.teachers.push({ teacherId: user._id, teacherEmail, teacherName });
        await subject.save();
        return res.status(200).json({
          message: "Викладач доданий до предмета",
          predmet: subject,
        });
      } else {
        return res.status(200).json({ message: "Цей викладач вже прив'язаний до предмета" });
      }
    } else {
      if (!subject) {
        const newSubject = new Predmet({
          predmet,
          teachers: [{ teacherEmail, teacherName }],
        });
        await newSubject.save();
        return res.status(201).json({
          message: "Предмет створено з тимчасовим викладачем",
          predmet: newSubject,
        });
      }

      if (!subject.teachers.some(t => t.teacherEmail === teacherEmail)) {
        subject.teachers.push({ teacherEmail, teacherName });
        await subject.save();
        return res.status(200).json({
          message: "Тимчасовий викладач доданий до предмета",
          predmet: subject,
        });
      } else {
        return res.status(200).json({ message: "Цей викладач вже прив'язаний до предмета" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при додаванні викладача до предмета" });
  }
};

export const removePredmetFromTeacher = async (req, res) => {
  try {
    const { teacherEmail, predmet } = req.body;

    const subject = await Predmet.findOne({ predmet });

    if (!subject) {
      return res.status(404).json({ message: "Предмет не знайдено" });
    }

    const teacherIndex = subject.teachers.findIndex(
      (teacher) => teacher.teacherEmail === teacherEmail
    );

    if (teacherIndex === -1) {
      return res.status(404).json({ message: "Викладача не знайдено в цьому предметі" });
    }

    subject.teachers.splice(teacherIndex, 1);
    await subject.save();

    res.status(200).json({ message: "Викладач успішно видалений з предмета", predmet: subject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при видаленні викладача з предмета" });
  }
};

export const linkPredmetToRegisteredTeacher = async (userId, teacherEmail, predmet) => {
  try {
    const subject = await Predmet.findOne({ predmet });

    if (!subject) return;

    const teacherIndex = subject.teachers.findIndex(
      (t) => t.teacherEmail === teacherEmail
    );

    if (teacherIndex !== -1) {
      subject.teachers[teacherIndex].teacherId = userId;
      await subject.save();
    }
  } catch (error) {
    console.error("Помилка при прив'язці викладача до предмета:", error);
  }
};

export const getTeachersByPredmet = async (req, res) => {
  try {
    const { predmet } = req.body;

    const subject = await Predmet.findOne({ predmet });

    if (!subject) {
      return res.status(404).json({ message: "Предмет не знайдено" });
    }

    res.status(200).json({
      message: "Викладачі для предмета отримано успішно",
      teachers: subject.teachers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при отриманні викладачів по предмету" });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const allSubjects = await Predmet.find({}, { teachers: 1 });

    const allTeachers = allSubjects.flatMap(subject => subject.teachers);

    const uniqueTeachersMap = new Map();
    for (const teacher of allTeachers) {
      if (!uniqueTeachersMap.has(teacher.teacherEmail)) {
        uniqueTeachersMap.set(teacher.teacherEmail, teacher);
      }
    }

    const uniqueTeachers = Array.from(uniqueTeachersMap.values());

    res.status(200).json({
      message: "Унікальні викладачі успішно отримані",
      teachers: uniqueTeachers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при отриманні списку викладачів" });
  }
};
