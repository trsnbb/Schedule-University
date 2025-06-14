import express from "express";
import DbChangeLog from "../models/DbChangeLog.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const logs = await DbChangeLog.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Помилка при отриманні логів" });
  }
});

export default router;
