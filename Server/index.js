import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./config/dbConfig.js";
import { configurePassport } from "./config/passportConfig.js";
import userRoutes from "./routes/userRoutes.js";
import teachingsRoutes from "./routes/teachingsRoutes.js";
import auditoriumRoutes from "./routes/auditoriumRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // URL клієнта
    credentials: true, // Дозволяє передавати куки
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

connectDB();

configurePassport();

app.use("/", userRoutes);
app.use("/", teachingsRoutes);
app.use("/", auditoriumRoutes);
app.use("/", scheduleRoutes);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
