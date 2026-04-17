import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { socket } from "../socket/socket";
import { Toast } from "../components/Toast";
import NotFound from "./NotFound";

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

  const [showToast, setShowToast] = useState(false);

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
      setShowToast(true);
      //re-fetch status
      fetchStatus();
      // clear the time interval
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // hide message after 3 sec
      timerRef.current = setTimeout(() => {
        setMessage(null);
        setShowToast(false);
      }, 5000);
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

  const statusLabel = attendance?.checkedOut
    ? "Checked Out"
    : attendance?.checkedIn
      ? "Checked In"
      : "Not Checked In";

  const lastActivity = attendance?.checkedOut
    ? new Date(attendance.checkOutTime!).toLocaleTimeString([], {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      } as any)
    : attendance?.checkedIn
      ? new Date(attendance.checkInTime!).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  if (!user) return <NotFound />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] p-6 overflow-hidden">
      <main className="w-full max-w-2xl space-y-8">
        {/* header */}
        <header className="space-y-1">
          <p className="text-[#45464d] font-medium tracking-tight">
            {day}, {date}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-[#191c1e] tracking-tight">
            Good morning, {user.name}
          </h1>
        </header>

        {/* time card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#497cff] p-12 text-white shadow-2xl shadow-[#497cff]/20">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-medium tracking-[0.2em] uppercase text-white/60 mb-2">
              Current Time
            </span>
            <div className="text-7xl md:text-8xl font-extrabold font-headline tracking-tighter mb-4">
              {time}
            </div>
            <div className="text-white/80 font-medium text-sm">
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
                  {new Date(attendance.checkInTime!).toLocaleTimeString()} ·
                  Checked out at{" "}
                  {new Date(attendance.checkOutTime!).toLocaleTimeString()}
                </>
              )}
            </div>
          </div>
        </section>

        {/* action button */}
        <section className="grid grid-cols-2 gap-6">
          <button
            onClick={!attendance?.checkedIn ? handleCheckIn : undefined}
            disabled={!!attendance?.checkedIn}
            className="relative flex items-center gap-3 justify-center p-4 bg-white rounded-3xl shadow-sm transition-all duration-300 overflow-hidden
      disabled:opacity-50 disabled:cursor-not-allowed
      enabled:hover:shadow-xl enabled:hover:-translate-y-1 enabled:active:scale-[0.98]"
          >
            {!attendance?.checkedIn && (
              <span className="absolute inset-0 rounded-3xl animate-ping bg-green-200 opacity-30" />
            )}
            <span className="relative z-10 w-3 h-3 rounded-full bg-green-400" />
            <h3 className="relative z-10 text-xl font-bold font-headline text-[#191c1e]">
              Check In
            </h3>
          </button>

          <button
            onClick={
              attendance?.checkedIn && !attendance?.checkedOut
                ? handleCheckOut
                : undefined
            }
            disabled={!attendance?.checkedIn || !!attendance?.checkedOut}
            className="relative flex items-center gap-3 justify-center p-4 bg-white rounded-3xl shadow-sm transition-all duration-300 overflow-hidden
      disabled:opacity-50 disabled:cursor-not-allowed
      enabled:hover:shadow-xl enabled:hover:-translate-y-1 enabled:active:scale-[0.98]"
          >
            {attendance?.checkedIn && !attendance?.checkedOut && (
              <span className="absolute inset-0 rounded-3xl animate-ping bg-red-200 opacity-30" />
            )}
            <span className="relative z-10 w-3 h-3 rounded-full bg-red-400" />
            <h3 className="relative z-10 text-xl font-bold font-headline text-[#191c1e]">
              Check Out
            </h3>
          </button>
        </section>

        {/* status bar */}
        {lastActivity && (
          <section>
            <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      statusLabel === "Checked In"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      statusLabel === "Checked In"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                </span>
                <span className="font-semibold text-[#191c1e]">
                  {statusLabel}
                </span>
              </div>
              {lastActivity && (
                <>
                  <div className="h-6 w-px bg-[#c6c6cd]/30 mx-2" />
                  <div className="text-sm text-[#45464d]">
                    Last activity:{" "}
                    <span className="text-[#191c1e] font-medium">
                      {lastActivity}
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* toast message */}
        {showToast && message && (
          <div className="fixed top-4 right-4 z-50">
            <Toast message={message} onClose={() => setShowToast(false)} />
          </div>
        )}
      </main>
    </div>
  );
}
