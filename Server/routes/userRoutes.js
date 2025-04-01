import express from "express";
import multer from "multer";
import crypto from "crypto";
import {
  uploadAvatar,
  getProfile,
  googleAuthCallback,
  updateUserProfile,
  deleteAvatar,
  deleteUser
} from "../controllers/userController.js";
import passport from "passport";
import verifyToken from "../verifyToken.js";
import dotenv from "dotenv";

dotenv.config();

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
  passport.authenticate("google", { failureRedirect: "/" }),
  googleAuthCallback
);
router.post("/upload", verifyToken, upload.single("image"), uploadAvatar);
router.get("/profile", verifyToken, getProfile);
router.patch("/updateUserProfile", verifyToken, updateUserProfile);
router.delete("/deleteAvatar", verifyToken, deleteAvatar);
router.delete("/deleteUser", verifyToken, deleteUser);


export default router;
