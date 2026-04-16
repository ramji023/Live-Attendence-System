import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date: { type: String, required: true },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);
