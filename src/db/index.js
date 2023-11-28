import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

/**
 * @type {typeof mongoose || undefined}
 */
export let dbInstance = undefined;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    dbInstance = connectionInstance;
    console.log(
      `\n🌸 MongoDB connected | DB Host:: ${connectionInstance.connection.host}\n`
    );
  } catch (error) {
    throw Error(error);
    process.exit(1);
  }
};

export default connectDB;
