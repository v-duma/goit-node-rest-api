import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const { DB_URI } = process.env;

export const connectDB = async () => {
  try {
    mongoose
      .connect(DB_URI)
      .then(() => console.log("Database connection successful"));
  } catch {
    (error) => {
      console.log("Error connection", error);
      process.exit(1);
    };
  }
};
