import mongoose from "mongoose";

const Auditorium = new mongoose.Schema(
  {
    number: {
      type: Number,
      unique: true,
    },
    size: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Auditorium", Auditorium);
