import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    subGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubGroup",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    specializationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization",
      required: true,
    },
    lessons: [
      {
        predmetId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Predmet",
        },
        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        type: {
          type: String,
          enum: ["lec", "lab", "pract"],
        },
        format: {
          type: String,
          enum: ["Online", "Offline"],
        },
        weekType: {
          type: Number,
          enum: [1, 2],
        },
        day: {
          type: [Number], // Масив днів
        },
        pairNumber: {
          type: [Number], // Масив номерів пар
        },
        link: {
          type: String,
        },
        auditorium: {
          num: {
            type: Number,
          },
          size: {
            type: Number,
          },
        },
      
        isEvent: {
          type: Boolean,
        },
        eventTitle: {
          type: String,
        },
        Note: [
          {
            lessonsId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "lesson",
            },
            noteUser: {
              type: String,
            },
            noteTeacher: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule;
