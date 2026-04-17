import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Employee } from "../../models/employee";

// initialize express router
const router = Router();

// login route to authenticate employee and admin
router.post("/login", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  let employee = await Employee.findOne({ email });

  if (!employee) {
    if (!name || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    employee = await Employee.create({
      name,
      email,
      password,
      role: email === "admin@example.com" ? "admin" : "employee",,
    });
  } else {
    const isMatch = password === employee.password;
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  }

  // and assign a new token to client
  const token = jwt.sign(
    { id: employee._id, role: employee.role, name: employee.name },
    process.env.JWT_SECRET ?? "your_secret_key",
    { expiresIn: "1d" },
  );

  // and return the token,role and name to client
  res.json({
    token,
    role: employee.role,
    user: { name: employee.name, email: employee.email },
  });
});

export default router;

// <-- future improvment  ------------>

//   const employee = await Employee.findOne({ email });
//   if (!employee) {
//     res.status(401).json({ message: "Invalid credentials" });
//     return;
//   }

//   const isMatch = password === employee.password;
//   if (!isMatch) {
//     res.status(401).json({ message: "Invalid credentials" });
//     return;
//   }
