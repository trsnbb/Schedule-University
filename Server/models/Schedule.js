import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
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
          enum: ["lec", "lab", "prac"],
        },
        format: {
          type: String,
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
        descriptionEvent: {
          type: String,
        },
        priorityEvent: {
          type: String,
          enum: ["normal", "high", "low"],
        },
        date: {
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
