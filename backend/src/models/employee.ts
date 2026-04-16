import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
});

export const Employee = mongoose.model("Employee", employeeSchema);
