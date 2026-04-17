import mongoose from "mongoose";
import { Employee } from "./src/models/employee";

async function seedEmployees() {
  try {
    await mongoose.connect(
      "mongodb+srv://mishraramji039_db_user:nKgRH5laSdqtShei@cluster0.l92b3qj.mongodb.net/attendanceDB?retryWrites=true&w=majority",
    );

    const employees = Array.from({ length: 50 }).map((_, i) => ({
      name: `Employee ${i + 1}`,
      email: `employee${i + 1}@example.com`,
      password: "123456",
      role: i === 0 ? "admin" : "employee",
    }));

    for (const emp of employees) {
      await Employee.updateOne(
        { email: emp.email },
        { $setOnInsert: emp },
        { upsert: true },
      );
    }

    console.log(" Employees seeded successfully");
    // process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    // process.exit(1);
  }
}

seedEmployees();
