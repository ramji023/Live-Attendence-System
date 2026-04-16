import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date: String,
  checkInTime: Date,
  checkOutTime: Date,
  status: { type: String, enum: ["IN", "OUT"], default: "IN" }
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);