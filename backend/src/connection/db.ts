import mongoose from "mongoose";

// make connection request to mongoDB database
export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("MongoDB connected");
};
