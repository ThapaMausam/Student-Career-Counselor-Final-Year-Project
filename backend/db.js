import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studentcounsellor";

export async function connectDb() {
  try {
    await mongoose.connect(MONGO_URI, {
      // useNewUrlParser/useUnifiedTopology not required in mongoose v6+
    });
    console.log("Connected to MongoDB:", MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

export default mongoose;
