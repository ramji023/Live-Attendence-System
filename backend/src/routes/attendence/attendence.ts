import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Employee } from "../../models/employee";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { Attendance } from "../../models/attendence";

// initialize express router
const router = Router();

// check if employee checked-in or checked-out
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user; // get employee data from auth middleware

    const today = new Date().toISOString().split("T")[0]; //convert the string

    // find that employee has checked-in or out
    const attendance = await Attendance.findOne({
      employeeId: user.id,
      date: today,
    });

    //if no record
    if (!attendance) {
      return res.json({
        checkedIn: false,
        checkedOut: false,
        checkInTime: null,
        checkOutTime: null,
      });
    }
    // otherwise return date with status
    return res.json({
      checkedIn: !!attendance.checkInTime,
      checkedOut: !!attendance.checkOutTime,
      checkInTime: attendance.checkInTime || null,
      checkOutTime: attendance.checkOutTime || null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// get all  the records from current day
router.get("/todayRecord", authMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    //total employee
    const totalEmployees = await Employee.countDocuments();

    // today attendence
    const records = await Attendance.find({ date: today }).populate(
      "employeeId",
      "name email",
    );

    let presentCount = 0;
    let lateCount = 0;

    // define 9 AM today
    const nineAM = new Date();
    nineAM.setHours(9, 0, 0, 0);

    // calculate count for presentCount and lateCount
    records.forEach((rec) => {
      if (rec.checkInTime) {
        presentCount++;

        if (new Date(rec.checkInTime) > nineAM) {
          lateCount++;
        }
      }
    });

    // and absent count
    const absentCount = totalEmployees - presentCount;

    // and attendence percentage
    const attendancePercentage =
      totalEmployees === 0
        ? 0
        : ((presentCount / totalEmployees) * 100).toFixed(2);

    // return the response to client
    return res.json({
      date: today,
      stats: {
        totalEmployees,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        attendancePercentage,
      },
      records,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// get the records date wise
router.get("/allRecords", authMiddleware, async (req, res) => {
  try {
    const date = req.query.date as string;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const records = await Attendance.find({ date }).populate(
      "employeeId",
      "name email",
    );

    //total employee
    const totalEmployees = await Employee.countDocuments();

    let presentCount = 0;
    let lateCount = 0;

    // define 9 AM today
    const nineAM = new Date();
    nineAM.setHours(9, 0, 0, 0);

    // calculate count for presentCount and lateCount
    records.forEach((rec) => {
      if (rec.checkInTime) {
        presentCount++;

        if (new Date(rec.checkInTime) > nineAM) {
          lateCount++;
        }
      }
    });

    // and absent count
    const absentCount = totalEmployees - presentCount;

    // and attendence percentage
    const attendancePercentage =
      totalEmployees === 0
        ? 0
        : ((presentCount / totalEmployees) * 100).toFixed(2);

    // return the response to client
    return res.json({
      date,
      stats: {
        totalEmployees,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        attendancePercentage,
      },
      records,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
export default router;
