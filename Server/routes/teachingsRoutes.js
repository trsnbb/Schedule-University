import express from "express";
import {
    addPredmetToTeacher,
    removePredmetFromTeacher,
    getTeachersByPredmet
} from "../controllers/teachingsController.js";
import verifyToken from "../verifyToken.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/addPredmetToTeacher", addPredmetToTeacher);
router.delete("/removePredmetFromTeacher", removePredmetFromTeacher);
router.post("/getTeachersByPredmet", getTeachersByPredmet);

export default router;
