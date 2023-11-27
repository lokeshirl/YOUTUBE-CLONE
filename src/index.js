import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

/**
 * DB connection and started server instance
 */

const startServer = () => {
  app.listen(process.env.PORT || 8080, () => {
    console.log(`⚙ Server started at port :: ${process.env.PORT || 8080}`);
  });
};

try {
  await connectDB();
  startServer();
} catch (error) {
  console.log("MongoDB connection error: ", error);
}
