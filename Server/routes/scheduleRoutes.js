import express from "express";
import {
    createSchedule
} from "../controllers/sheduleController.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/createSchedule", createSchedule);

export default router;
