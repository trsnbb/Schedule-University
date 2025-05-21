import express from "express";
import { createSchedule } from "../controllers/sheduleController.js";
import dotenv from "dotenv";
import {
  getScheduleByGroup,
  getGroupsByCourse,
  getCoursesBySpecialization,
  getAllSpecializations,
  addLesson
} from "../controllers/sheduleController.js";

dotenv.config();

const router = express.Router();

router.post("/createSchedule", createSchedule);
router.post("/addLesson", addLesson);

router.get("/getScheduleByGroup", getScheduleByGroup);
router.get("/specializations", getAllSpecializations);
router.get("/courses", getCoursesBySpecialization);
router.get("/groups", getGroupsByCourse);


export default router;
