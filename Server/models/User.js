import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "deanery"],
    },
    course: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    group: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    subgroup: {
      type: Number,
      enum: [1, 2],
    },
    avatarUrl: {
      type: String,
    },
    timeFormat: {
      type: Number,
      default: 24,
      enum: [24, 12],
      required: true,
    },
    eventVision: {
      type: Boolean,
      default: true,
      required: true,
    },
    isAvatarUpdated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
