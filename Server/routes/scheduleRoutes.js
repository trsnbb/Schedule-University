import express from "express";
import {
    createSchedule
} from "../controllers/sheduleController.js";
import dotenv from "dotenv";
import { getScheduleByGroup } from "../controllers/sheduleController.js";


dotenv.config();

const router = express.Router();

router.post("/createSchedule", createSchedule);
router.get("/getScheduleByGroup", getScheduleByGroup);


export default router;
