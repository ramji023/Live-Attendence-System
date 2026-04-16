import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { socket } from "../socket/socket";

export default function Employee() {
  const user = useAuthStore((s) => s.user);

  console.log(user); // console user
  const [time, setTime] = useState("");
  const [message, setMessage] = useState<string | null>(null); // listen socket-io response
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // store employee value
  const [attendance, setAttendance] = useState<{
    checkedIn: boolean;
    checkedOut: boolean;
    checkInTime: string | null;
    checkOutTime: string | null;
  } | null>(null);

  // when component mount then send request to server to check employee status
  const fetchStatus = async () => {
    try {
      const token = useAuthStore.getState().user?.token;

      const res = await axios.get(
        "http://localhost:3000/api/v1/attendence/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchStatus();
  }, []);

  // live clock timer
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(formatted);
    };

    updateTime();
    // run function after every seconds
    const interval = setInterval(updateTime, 1000);

    // here clear the interval id when component unmount
    return () => clearInterval(interval);
  }, []);

  // listen for socket.io response
  useEffect(() => {
    // listen for attendence-status event
    socket.on("attendance-status", (data) => {
      console.log(data);

      //store messages
      setMessage(data.message);
      //re-fetch status
      fetchStatus();
      // clear the time interval
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // hide message after 3 sec
      timerRef.current = setTimeout(() => {
        setMessage(null);
      }, 3000);
    });

    return () => {
      socket.off("attendance-status");
    };
  }, []);

  // format the day and date
  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // check-in handler
  const handleCheckIn = () => {
    console.log("Checked IN");
    socket.emit("mark-attendance", {
      action: "IN",
    });
  };

  // check-out handler
  const handleCheckOut = () => {
    console.log("Checked OUT");
    socket.emit("mark-attendance", {
      action: "OUT",
    });
  };

  if (!user) return null;
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-50 px-80 py-10">
      {/* date */}
      <p className="text-gray-500 text-sm">
        {day}, {date}
      </p>

      {/* welcome */}
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mt-2">
        Welcome back, <span className="text-indigo-600">{user.name}</span> 👋
      </h1>

      {/* time card */}
      <div className="mt-8 bg-linear-to-r from-indigo-500 via-blue-500 to-purple-500 text-white rounded-3xl shadow-2xl p-10 md:p-14 flex flex-col items-center justify-center">
        <p className="text-lg opacity-80 mb-2">Current Time</p>

        <h2 className="text-6xl md:text-7xl font-bold tracking-wide">{time}</h2>

        <p className="mt-4 text-sm opacity-80">
          {!attendance?.checkedIn && "Mark your attendance"}

          {attendance?.checkedIn && !attendance?.checkedOut && (
            <>
              Checked in at{" "}
              {new Date(attendance.checkInTime!).toLocaleTimeString()}
            </>
          )}

          {attendance?.checkedOut && (
            <>
              Checked in at{" "}
              {new Date(attendance.checkInTime!).toLocaleTimeString()} | Checked
              out at {new Date(attendance.checkOutTime!).toLocaleTimeString()}
            </>
          )}
        </p>
      </div>

      {/* buttons */}
      <div className="mt-10 flex flex-col md:flex-row gap-4">
        {/* check-in */}
        {!attendance?.checkedIn && (
          <button
            onClick={handleCheckIn}
            className="flex-1 py-4 rounded-2xl font-medium text-lg bg-green-500 hover:bg-green-600 text-white hover:scale-[1.02]"
          >
            Check In
          </button>
        )}

        {/* check-out */}
        {attendance?.checkedIn && !attendance?.checkedOut && (
          <button
            onClick={handleCheckOut}
            className="flex-1 py-4 rounded-2xl font-medium text-lg bg-red-500 hover:bg-red-600 text-white hover:scale-[1.02]"
          >
            Check Out
          </button>
        )}
      </div>
      {message && (
        <div className="mt-4 px-4 py-4 rounded-xl bg-green-100 text-green-700 text-sm text-center shadow">
          {message}
        </div>
      )}
    </div>
  );
}
