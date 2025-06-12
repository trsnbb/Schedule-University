import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { handleUserChange } from "../changeHandlers/users.js";
import { handleSpecializationChange } from "../changeHandlers/specializations.js";
import { handleScheduleChange } from "../changeHandlers/schedules.js";
import { handleGroupChange } from "../changeHandlers/groups.js";
import { handleCourseChange } from "../changeHandlers/courses.js";
import { handleAuditoriaChange } from "../changeHandlers/auditoria.js";

export const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("✅ DB connected");

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
              stream.on("change", handleUserChange);
              break;
            case "specializations":
              stream.on("change", handleSpecializationChange);
              break;
            case "schedules":
              stream.on("change", handleScheduleChange);
              break;

            case "groups":
              stream.on("change", handleGroupChange);
              break;
            case "courses":
              stream.on("change", handleCourseChange);
              break;
            case "auditoria":
              stream.on("change", handleAuditoriaChange);
              break;
            default:
              stream.on("change", (change) => {
                console.log(`[${col}] Зміна:`, change);
              });
          }
        } catch (err) {
          console.error(
            `❌ Не вдалося підключити Change Stream для ${col}:`,
            err.message
          );
        }
      });
    })
    .catch((err) => console.error("❌ DB connection error", err));
};
