import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Attendance } from "./models/attendence";
import jwt, { JwtPayload } from "jsonwebtoken";
interface JoinPayload {
  token: string;
}
interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: "admin" | "employee";
  name: string;
}

// store all the active user
const activeUsers = new Map<string, string>();
// initialze websocket server
export const initWebSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    const { token } = socket.handshake.auth as JoinPayload;
    if (!token) {
      socket.disconnect();
      return;
    }
    let decoded: CustomJwtPayload;

    try {
      decoded = jwt.verify(token, "your_secret_key") as CustomJwtPayload;
    } catch (err) {
      console.log("Invalid token");
      socket.disconnect();
      return;
    }
    const employeeId = decoded.id;
    const employeeName = decoded.name;
    // store active user
    activeUsers.set(employeeId, socket.id);

    // if user is admin then create admin-room and join in admin room
    if (decoded.role === "admin") {
      socket.join("admin-room");
      console.log(`Admin joined admin-room`);
    } else {
      // if user is employee then create employee-room and join in employee room
      socket.join("employee-room");
      console.log(`Employee ${decoded.role} joined employee-room`);
    }

    // when employee mark the attendence
    socket.on(
      "mark-attendance",
      async ({ action }: { action: "IN" | "OUT" }) => {
        try {
          // first convert date into string
          const today = new Date().toISOString().split("T")[0];
          // then find that attendence exist or not
          let attendance = await Attendance.findOne({
            employeeId,
            date: today,
          });

          // if employee send "IN" then send error response
          if (action === "IN") {
            if (attendance?.checkInTime) {
              return socket.emit("attendance-status", {
                success: false,
                message: "Already checked in",
              });
            }
            // if not then create it
            if (!attendance) {
              attendance = await Attendance.create({
                employeeId,
                date: today,
                checkInTime: new Date(),
              });
            } else {
              attendance.checkInTime = new Date();
              await attendance.save();
            }
          }

          // if employee send "OUT" then send error response
          if (action === "OUT") {
            //  if emplyoee not checked-in
            if (!attendance?.checkInTime) {
              return socket.emit("attendance-status", {
                success: false,
                message: "Check-in first",
              });
            }
            // if employee alreday checked-out
            if (attendance.checkOutTime) {
              return socket.emit("attendance-status", {
                success: false,
                message: "Already checked out",
              });
            }
            // otherwise update it
            attendance.checkOutTime = new Date();
            await attendance.save();
          }

          // then emit the response to that employee

          socket.emit("attendance-status", {
            success: true,
            action,
            message: `Checked ${action} successfully!`,
          });

          // and then emit the repsonse to admin
          io.to("admin-room").emit("attendance-updated", {
            employeeId,
            action,
            time: new Date(),
            message: `Employee ${employeeName} checked ${action}`,
          });
        } catch (error) {
          console.error(error);

          // if DB query fails then show error
          socket.emit("attendance-status", {
            success: false,
            message: "Something went wrong",
          });
        }
      },
    );

    // handle disconnect event
    socket.on("disconnect", () => {
      activeUsers.delete(employeeId); // delete the employee after disconnect with server
      console.log("User disconnected:", socket.id);
    });

    // handle socket re-connection logic
    socket.on("reconnect", () => {
      console.log("Reconnected!");
    });
  });
};
