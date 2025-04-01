import Teachings from "../models/Teachings.js";
import User from "../models/User.js"; 

export const addPredmetToTeacher = async (req, res) => {
  try {
    const { teacherName, teacherEmail, predmet } = req.body;

    const user = await User.findOne({ email: teacherEmail });

    let teachings;
    if (user) {
      teachings = await Teachings.findOne({ predmet });
      if (!teachings) {
        const newTeachings = new Teachings({
          predmet,
          teachers: [
            { teacherId: user._id, teacherEmail, teacherName },
          ],
        });
        await newTeachings.save();
        return res.status(201).json({
          message: "Предмети успішно додано (зареєстрований викладач)",
          teachings: newTeachings,
        });
      }

      if (!teachings.teachers.some(teacher => teacher.teacherEmail === teacherEmail)) {
        teachings.teachers.push({ teacherId: user._id, teacherEmail, teacherName });
        await teachings.save();
        return res.status(200).json({
          message: "Предмети успішно додано (зареєстрований викладач)",
          teachings,
        });
      } else {
        return res.status(200).json({
          message: "Цей викладач вже прив'язаний до предмета",
        });
      }
    } else {
      teachings = await Teachings.findOne({ predmet });
      if (!teachings) {
        const newTeachings = new Teachings({
          predmet,
          teachers: [
            { teacherEmail, teacherName },
          ],
        });
        await newTeachings.save();
        return res.status(201).json({
          message: "Предмети успішно додано (тимчасовий викладач)",
          teachings: newTeachings,
        });
      }

      if (!teachings.teachers.some(teacher => teacher.teacherEmail === teacherEmail)) {
        teachings.teachers.push({ teacherEmail, teacherName });
        await teachings.save();
        return res.status(200).json({
          message: "Предмети успішно додано (тимчасовий викладач)",
          teachings,
        });
      } else {
        return res.status(200).json({
          message: "Цей викладач вже прив'язаний до предмета",
        });
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

    const user = await User.findOne({ email: teacherEmail });

    let teachings;

    teachings = await Teachings.findOne({ predmet });

    if (!teachings) {
      return res.status(404).json({ message: "Предмет не знайдено" });
    }

    const teacherIndex = teachings.teachers.findIndex(
      (teacher) => teacher.teacherEmail === teacherEmail
    );

    if (teacherIndex === -1) {
      return res.status(404).json({ message: "Викладача не знайдено в цьому предметі" });
    }

    teachings.teachers.splice(teacherIndex, 1);
    await teachings.save();

    res.status(200).json({ message: "Викладач успішно видалений з предмета", teachings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при видаленні викладача з предмета" });
  }
};

export const linkPredmetToRegisteredTeacher = async (userId, teacherEmail) => {
  try {
    const teachings = await Teachings.findOne({ predmet });

    if (!teachings) {
      return;
    }

    if (!teachings.teachers.some(teacher => teacher.teacherEmail === teacherEmail)) {
      teachings.teachers.push({ teacherId: userId, teacherEmail });
      await teachings.save();
    }

    console.log("Викладач успішно прив'язаний до предмета");
  } catch (error) {
    console.error(error);
  }
};

export const getTeachersByPredmet = async (req, res) => {
  try {
    const { predmet } = req.body;  // отримуємо предмет з тіла запиту

    // Шукаємо предмет у базі
    const teachings = await Teachings.findOne({ predmet });

    if (!teachings) {
      return res.status(404).json({ message: "Предмет не знайдено" });
    }

    // Повертаємо список викладачів
    res.status(200).json({
      message: "Викладачі для предмета отримано успішно",
      teachers: teachings.teachers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при отриманні викладачів по предмету" });
  }
};



