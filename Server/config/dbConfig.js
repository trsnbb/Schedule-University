import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { handleUserChange } from "../changeHandlers/users.js";
import { handleSpecializationChange } from "../changeHandlers/specializations.js";
import { handleScheduleChange } from "../changeHandlers/schedules.js";
import { handleGroupChange } from "../changeHandlers/groups.js";
import { handleCourseChange } from "../changeHandlers/courses.js";
import { handleAuditoriaChange } from "../changeHandlers/auditoria.js";

export const connectDB = (io) => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("DB connected");

      const collections = [
        "users",
        "specializations",
        "schedules",
        "groups",
        "courses",
        "auditoria",
      ];

      collections.forEach((col) => {
        try {
          const stream = mongoose.connection.collection(col).watch();

          switch (col) {
            case "users":
              stream.on("change", (change) => handleUserChange(change, io));
              break;
            case "specializations":
              stream.on("change", (change) =>
                handleSpecializationChange(change, io)
              );
              break;
            case "schedules":
              stream.on("change", (change) => handleScheduleChange(change, io));
              break;

            case "groups":
              stream.on("change", (change) => handleGroupChange(change, io));
              break;
            case "courses":
              stream.on("change", (change) => handleCourseChange(change, io));
              break;
            case "auditoria":
              stream.on("change", (change) => handleAuditoriaChange(change, io));
              break;
            default:
              stream.on("change", (change) => {
                console.log(`[${col}] Зміна:`, change);
              });
          }
        } catch (err) {
          console.error(
            `Не вдалося підключити Change Stream для ${col}:`,
            err.message
          );
        }
      });
    })
    .catch((err) => console.error("DB connection error", err));
};
