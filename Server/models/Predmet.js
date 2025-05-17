// models/Predmet.js
import mongoose from "mongoose";

const PredmetSchema = new mongoose.Schema({
  predmet: {
    type: String,
    required: true,
  },
  teachers: [
    {
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      teacherEmail: String,
      teacherName: String,
    },
  ],
}, {
  timestamps: true
});

export default mongoose.model("Predmet", PredmetSchema);