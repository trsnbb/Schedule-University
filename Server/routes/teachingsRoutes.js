import express from "express";
import {
    addPredmetToTeacher,
    removePredmetFromTeacher,
    getTeachersByPredmet,
    getAllTeachers
} from "../controllers/teachingsController.js";
import verifyToken from "../verifyToken.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/addPredmetToTeacher", addPredmetToTeacher);
router.delete("/removePredmetFromTeacher", removePredmetFromTeacher);
router.post("/getTeachersByPredmet", getTeachersByPredmet);
router.get("/getAllTeachers", getAllTeachers);



export default router;
