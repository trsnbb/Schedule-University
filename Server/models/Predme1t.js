import mongoose from "mongoose";

const PredmetSchema = new mongoose.Schema(
  {
    predmetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "predmet",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
    },
   
    course: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    group: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
   
    count: {
        type: Number,
    },
    countLec: {
        type: Number,
    },
    countPrac: {
        type: Number,
    },
    countLab: {
        type: Number,
    },
  },
  {
    timestamps: true,
  }
);
