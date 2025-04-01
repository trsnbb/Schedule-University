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
    lessons: [
      {
        predmetId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "predmet",
          
        },
       
        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "teacher",
         
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
          type: [Number], // This defines an array of numbers
        },
        pairNumber: {
          type: [Number], // This defines an array of numbers
        },
        link: {
          type: String,
        },
        auditorium: {
          num: {
            type: Number,
            enum: [1, 2], // Ось тут виправлено "Ofline" на "Offline"
            
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
