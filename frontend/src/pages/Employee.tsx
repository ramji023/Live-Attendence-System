import { useEffect, useState } from "react";

export default function Employee() {
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"IN" | "OUT" | null>(null);

  const name = "Ram"; // later from auth

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
    setStatus("IN");
    console.log("Checked IN");
  };

  // check-out handler
  const handleCheckOut = () => {
    setStatus("OUT");
    console.log("Checked OUT");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-50 px-80 py-10">
      {/* date */}
      <p className="text-gray-500 text-sm">
        {day}, {date}
      </p>

      {/* welcome */}
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mt-2">
        Welcome back, <span className="text-indigo-600">{name}</span> 👋
      </h1>

      {/* time card */}
      <div className="mt-8 bg-linear-to-r from-indigo-500 via-blue-500 to-purple-500 text-white rounded-3xl shadow-2xl p-10 md:p-14 flex flex-col items-center justify-center">
        <p className="text-lg opacity-80 mb-2">Current Time</p>

        <h2 className="text-6xl md:text-7xl font-bold tracking-wide">{time}</h2>

        <p className="mt-4 text-sm opacity-80">
          {status === "IN" && "You are checked in"}
          {status === "OUT" && "You are checked out"}
          {!status && "Mark your attendance"}
        </p>
      </div>

      {/* buttons */}
      <div className="mt-10 flex flex-col md:flex-row gap-4">
        {/*check-in */}
        <button
          onClick={handleCheckIn}
          disabled={status === "IN"}
          className={`flex-1 py-4 rounded-2xl font-medium text-lg transition-all shadow-md ${
            status === "IN"
              ? "bg-green-200 text-green-700 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white hover:scale-[1.02]"
          }`}
        >
          Check In
        </button>

        {/* check-out*/}
        <button
          onClick={handleCheckOut}
          disabled={status === "OUT" || status === null}
          className={`flex-1 py-4 rounded-2xl font-medium text-lg transition-all shadow-md ${
            status === "OUT" || status === null
              ? "bg-red-200 text-red-700 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white hover:scale-[1.02]"
          }`}
        >
          Check Out
        </button>
      </div>
    </div>
  );
}
