import jwt from "jsonwebtoken";
import UserSchema from "../models/User.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const avatarUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await UserSchema.findByIdAndUpdate(
      userId,
      { avatarUrl, isAvatarUpdated: true },
      { new: true }
    );

    res.json({ url: avatarUrl });
  } catch (err) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ message: "Не вдалося завантажити аватарку" });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Користувач не авторизований" });
    }

    if (req.user.isAvatarUpdated) {
      return res.json({
        name: req.user.name,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl,
      });
    }

    const googleAvatarUrl = req.user.avatarUrl;

    if (req.user.avatarUrl !== googleAvatarUrl) {
      req.user.avatarUrl = googleAvatarUrl;
      await req.user.save();
    }

    res.json({
      name: req.user.name,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Помилка отримання профілю" });
  }
};

export const googleAuthCallback = async (req, res) => {
  const token = jwt.sign(
    { _id: req.user._id, name: req.user.name, email: req.user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.json({ token, user: req.user }); // Переконайтеся, що токен повертається
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "ID користувача не надано" });
    }

    const user = await UserSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (req.body.name) {
      user.name = req.body.name; // Оновлюємо ім'я
    }

    if (req.body.timeFormat) {
      user.timeFormat = req.body.timeFormat; // Оновлюємо формат часу
    }
    if (req.body.eventVision !== undefined) {
      user.eventVision = req.body.eventVision;
    }
    await user.save();

    res.json({ success: true, message: "Профіль успішно оновлено" });
  } catch (error) {
    console.error("Помилка при оновленні профілю:", error);
    res.status(500).json({ message: "Не вдалося оновити профіль" });
  }
};
export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const avatarPath = path.join(__dirname, `..${user.avatarUrl}`);
    if (user.avatarUrl && fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }

    user.avatarUrl = "";
    user.isAvatarUpdated = false;

    const googleAvatarUrl = req.user.avatarUrl;
    if (googleAvatarUrl) {
      user.avatarUrl = googleAvatarUrl;
    }

    await user.save();

    res.json({ message: "Аватарка була видалена", avatarUrl: user.avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при видаленні аватарки" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (user.avatarUrl) {
      const avatarPath = path.join(__dirname, `..${user.avatarUrl}`);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    await UserSchema.findByIdAndDelete(userId);

    res.json({ message: "Профіль був видалений" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при видаленні профілю" });
  }
};
