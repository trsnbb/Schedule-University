import express from "express";
import {
    addAuditorium,
    deleteAuditorium,
} from "../controllers/auditoriumController.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/addAuditorium", addAuditorium);
router.delete("/deleteAuditorium", deleteAuditorium);


export default router;
