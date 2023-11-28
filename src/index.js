import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import { app } from "./app.js";
import connectDB from "./db/index.js";

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
  console.log("MongoDB connection FAILED: ", error);
}
