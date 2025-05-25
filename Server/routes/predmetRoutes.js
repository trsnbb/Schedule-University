import express from "express";
import Predmet from "../models/Predmet.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const subjects = await Predmet.find({});
    const formattedSubjects = subjects.map(subject => ({
      _id: subject._id,
      name: subject.predmet, 
      teacherId: subject.teachers[0]?.teacherId || null
    }));
    res.json(formattedSubjects);
  } catch (error) {
    console.error("Помилка при отриманні предметів:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

export default router;