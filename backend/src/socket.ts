import { Server } from "socket.io";
import { Server as HttpServer } from "http";

interface JoinPayload {
  employeeId: string;
  role: "admin" | "employee";
}

interface AttendancePayload {
  employeeId: string;
  action: "IN" | "OUT";
}

// store all the active user
const activeUsers = new Map<string, string>();
// initialze websocket server
export const initWebSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    const { employeeId, role } = socket.handshake.auth as JoinPayload;
    activeUsers.set(employeeId, socket.id); // add active user in activeUsers record
    // if user is admin then create admin-room and join in admin room
    if (role === "admin") {
      socket.join("admin-room");
      console.log(`Admin joined admin-room`);
    } else {
      // if user is employee then create employee-room and join in employee room
      socket.join("employee-room");
      console.log(`Employee ${employeeId} joined employee-room`);
    }

    // when employee mark the attendence
    socket.on(
      "mark-attendance",
      async ({ employeeId, action }: AttendancePayload) => {
        // send success event to that employee
        socket.emit("attendance-status", {
          action,
          message: `Checked ${action} successfully!`,
        });

        // and inform admins that new employee in/out successfully
        io.to("admin-room").emit("attendance-updated", {
          employeeId,
          action,
          time: new Date(),
        });
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
