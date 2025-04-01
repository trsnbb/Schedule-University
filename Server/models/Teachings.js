import mongoose from "mongoose";

const Teachings = new mongoose.Schema(
  {
    predmet: {
      type: String,
      required: true,
    },
    teachers: [
      {
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        teacherEmail: { type: String },
        teacherName: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Teachings", Teachings);
