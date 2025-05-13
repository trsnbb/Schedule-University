import express from "express";
import multer from "multer";
import crypto from "crypto";
import {
  uploadAvatar,
  getProfile,
  googleAuthCallback,
  updateUserProfile,
  deleteAvatar,
  deleteUser,
} from "../controllers/userController.js";
import passport from "passport";
import verifyToken from "../verifyToken.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, __, cb) => {
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, randomName + ".jpg");
  },
});
const upload = multer({ storage });

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Успішна авторизація
    res.redirect("http://localhost:3000"); // Перенаправлення на клієнт
  }
);
router.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    const token = jwt.sign(
      { _id: req.user._id, name: req.user.name, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({ token, user: req.user }); // Повертаємо токен і дані користувача
  } else {
    res.status(401).json({ message: "Необхідна авторизація" });
  }
});
router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Помилка при виході:", err);
      return res.status(500).json({ message: "Помилка при виході" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Вихід успішний" });
    });
  });
});

router.post("/upload", verifyToken, upload.single("image"), uploadAvatar);
router.get("/profile", verifyToken, getProfile);
router.patch("/updateUserProfile", verifyToken, updateUserProfile);
router.delete("/deleteAvatar", verifyToken, deleteAvatar);
router.delete("/deleteUser", verifyToken, deleteUser);

export default router;
