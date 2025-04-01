import Auditorium from "../models/Auditorium.js";

export const addAuditorium = async (req, res) => {
  try {
    const { number, size } = req.body;

    if (!number || !size) {
      return res
        .status(400)
        .json({ message: "Будь ласка, вкажіть номер та розмір аудиторії." });
    }

    const existingAuditorium = await Auditorium.findOne({ number });
    if (existingAuditorium) {
      return res
        .status(400)
        .json({ message: "Аудиторія з таким номером вже існує." });
    }

    const newAuditorium = new Auditorium({ number, size });
    await newAuditorium.save();

    res
      .status(201)
      .json({
        message: "Аудиторію успішно додано.",
        auditorium: newAuditorium,
      });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера.", error });
  }
};

export const deleteAuditorium = async (req, res) => {
  try {
    const { number } = req.params;

    const auditorium = await Auditorium.findOneAndDelete({ number });
    if (!auditorium) {
      return res.status(404).json({ message: "Аудиторію не знайдено." });
    }

    res.json({ message: "Аудиторію успішно видалено." });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера.", error });
  }
};
