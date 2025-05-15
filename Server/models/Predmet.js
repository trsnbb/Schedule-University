// models/Predmet.js
import mongoose from "mongoose";

const Predmet = new mongoose.Schema({
  name: {
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
});

export default mongoose.model("Predmet", Predmet); // назва має відповідати ref
