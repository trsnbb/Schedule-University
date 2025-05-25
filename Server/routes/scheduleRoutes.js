import express from "express";
import { createSchedule } from "../controllers/scheduleController.js";
import dotenv from "dotenv";
import {
  getScheduleByGroup,
  getGroupsByCourse,
  getCoursesBySpecialization,
  getAllSpecializations,
  addLesson,
  updateSchedule,
  getScheduleByTeacher
} from "../controllers/scheduleController.js";

dotenv.config();

const router = express.Router();

router.post("/createSchedule", createSchedule);
router.post("/addLesson", addLesson);
router.patch("/updateSchedule", updateSchedule);
router.get("/getScheduleByTeacher", getScheduleByTeacher);

router.get("/getScheduleByGroup", getScheduleByGroup);
router.get("/specializations", getAllSpecializations);
router.get("/courses", getCoursesBySpecialization);
router.get("/groups", getGroupsByCourse);


export default router;
