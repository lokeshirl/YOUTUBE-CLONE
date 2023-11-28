import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); // CORS - Cross Origin Resource Sharing

app.use(express.json({ limit: "16kb" })); // limit: "16kb" - limits the size of the body to 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // extended: true - allows to parse nested objects
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

export { app };
