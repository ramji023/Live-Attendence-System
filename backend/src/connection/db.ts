import mongoose from "mongoose";

// make connection request to mongoDB database
export const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGO_URI ?? "mongodb+srv://mishraramji039_db_user:nKgRH5laSdqtShei@cluster0.l92b3qj.mongodb.net/attendanceDB?retryWrites=true&w=majority",
  );
  console.log("MongoDB connected");
};
