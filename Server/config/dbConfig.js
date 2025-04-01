import mongoose from "mongoose";
import dotenv from "dotenv"; 

dotenv.config();

export const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("DB connection error", err));
};
