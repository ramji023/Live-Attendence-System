import { useEffect, useRef, useState } from "react";
import { socket } from "../socket/socket";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { Toast } from "../components/Toast";
import NotFound from "./NotFound";
import LoaderOverlay from "../components/Loader";

type EmployeeType = {
  name: string;
  email: string;
};

type AttendanceRecord = {
  _id: string;
  employeeId: EmployeeType;
  checkInTime?: string;
  checkOutTime?: string;
};

type StatsType = {
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: string;
};

type ApiResponse = {
  date: string;
  stats: StatsType;
  records: AttendanceRecord[];
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  // store date select by admin
  const [selectedDate, _] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const user = useAuthStore((s) => s.user);
  const [message, setMessage] = useState<string | null>(null); // store live updates

  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all"); // to sort the employee based on selected filter
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [time, setTime] = useState("");
  // write function to fetch the updated records
  const fetchRecords = async (dateParam?: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = useAuthStore.getState().user?.token;
      if (!token) {
        setError("Unauthorized. Please login again.");
        return;
      }

      const queryDate = dateParam || date;

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:3000"}/api/v1/attendence/allRecords`,
        {
          params: { date: queryDate },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setData(res.data as ApiResponse);
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load attendance records.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // write effect to fetch the records while mount the component
  useEffect(() => {
    fetchRecords();
  }, []);

  // listen for attendence-updated event
  useEffect(() => {
    socket.on("attendance-updated", (data) => {
      console.log("Admin update:", data);
      // update ui
      setMessage(data.message);
      setShowToast(true);
      // fetch updated data
      fetchRecords();
      // clear the time interval
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // hide message after 3 sec
      timerRef.current = setTimeout(() => {
        setShowToast(false);
        setMessage(null);
      }, 3000);
    });

    return () => {
      socket.off("attendance-updated");
    };
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

  // format today date and day
  const today = new Date(selectedDate);
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const fullDate = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!user) return <NotFound />;
  if (error) {
    return (
      <div className="min-h-screen font-body bg-linear-to-br from-gray-50 to-indigo-50 px-6 md:px-20 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">Unable to load records</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const filteredRecords =
    data?.records.filter((rec) => {
      const isCheckedIn = !!rec.checkInTime;
      const isCheckedOut = !!rec.checkOutTime;

      const isActive = isCheckedIn && !isCheckedOut;
      const isInactive = isCheckedIn && isCheckedOut;

      if (filter === "active") return isActive;
      if (filter === "inactive") return isInactive;

      return true;
    }) || [];
  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <LoaderOverlay show={loading} />
        </div>
      )}
      <div className="min-h-screen font-body bg-linear-to-br from-gray-50 to-indigo-50 px-6 md:px-20 py-10">
        {/* header */}
        <div className="flex flex-col space-y-7">
          <div>
            <p className="text-gray-500 text-sm">
              {day}, {fullDate}
            </p>
            <h1 className="text-3xl font-semibold text-gray-800 mt-1">
              Live Attendence
            </h1>
          </div>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 relative overflow-hidden bg-[#497cff] rounded-4xl p-8 text-white flex flex-col justify-between min-h-55">
              <div className="relative z-10">
                <p className="text-[#ffffff]/60 font-medium tracking-wide">
                  Overall Attendance
                </p>
                <h2 className="text-6xl font-headline font-extrabold tracking-tighter mt-2">
                  {data?.stats.attendancePercentage}%
                </h2>
                <div className="flex items-center gap-2 mt-4 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm">
                    clock_loader_10
                  </span>
                  <span className="text-xs font-semibold">{time}</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span
                  className="material-symbols-outlined text-[160px]"
                  data-icon="analytics"
                >
                  analytics
                </span>
              </div>
            </div>
            <div className="bg-white rounded-4xl p-8 flex flex-col justify-between shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 bg-[#dbe1ff] rounded-2xl flex items-center justify-center mb-4">
                  <span
                    className="material-symbols-outlined text-[#003ea8]"
                    data-icon="person_check"
                  >
                    person_check
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                  Checked In Today
                </p>
                <h3 className="text-3xl font-headline font-bold text-slate-900 mt-1">
                  {data?.stats.present}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Target: {data?.stats.totalEmployees} total
              </p>
            </div>
            <div className="bg-white rounded-4xl p-8 flex flex-col justify-between shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 bg-[#fcdeb5] rounded-2xl flex items-center justify-center mb-4">
                  <span
                    className="material-symbols-outlined text-[#574425]"
                    data-icon="schedule"
                  >
                    schedule
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                  Late Arrivals
                </p>
                <h3 className="text-3xl font-headline font-bold text-slate-900 mt-1">
                  {data?.stats.late}
                </h3>
              </div>
              <p className="text-xs text-[#ba1a1a] font-medium">
                Attention required for {data?.stats.late} employees
              </p>
            </div>
          </section>
          {/* fitlers */}
          <div className="flex flex-col md:flex-row justify-between">
            <h3 className="text-xl font-headline font-bold text-slate-900">
              Live Logs
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border border-slate-100 transition-all active:scale-95 ${
                  filter === "all"
                    ? "bg-white text-slate-600 shadow-sm"
                    : "text-slate-400 hover:bg-white hover:text-slate-600"
                }`}
              >
                Today
              </button>

              <button
                onClick={() => setFilter("inactive")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border border-slate-100 transition-all active:scale-95 ${
                  filter === "inactive"
                    ? "bg-white text-slate-600 shadow-sm"
                    : "text-slate-400 hover:bg-white hover:text-slate-600"
                }`}
              >
                Inactive
              </button>

              <button
                onClick={() => setFilter("active")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border border-slate-100 transition-all active:scale-95 ${
                  filter === "active"
                    ? "bg-white text-slate-600 shadow-sm"
                    : "text-slate-400 hover:bg-white hover:text-slate-600"
                }`}
              >
                Active
              </button>
              {/* date selection input by default (today date) */}
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  fetchRecords(e.target.value);
                }}
                className="px-4 py-1.5 text-slate-400 rounded-full text-xs font-semibold border border-slate-100 hover:bg-white bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            </div>
          </div>
        </div>

        {/* table card */}
        <div className="mt-8 bg-[#f6f4eb] rounded-xl overflow-hidden border border-[#d3c2c8]/10">
          {/* table header */}
          <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold font-headline text-gray-700">
              Employee Attendance
            </h2>
            <span className="text-sm text-gray-500">
              {data?.records.length} Records
            </span>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            {filteredRecords.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-gray-400">
                No records found
              </p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eae8df]">
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#504448]">
                      Name
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#504448]">
                      Email
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#504448]">
                      Check in
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#504448]">
                      Check out
                    </th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#504448]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eae8df]">
                  {filteredRecords.map((rec) => {
                    const isActive = rec.checkInTime && !rec.checkOutTime;
                    const employeeName = rec.employeeId?.name || "Unknown";
                    const employeeEmail = rec.employeeId?.email || "-";
                    const initials = employeeName
                      .split(" ")
                      .map((p: string) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr
                        key={rec._id}
                        className="bg-white hover:bg-[#fbf9f0] transition-colors"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#eae8df] flex items-center justify-center text-[11px] font-medium text-[#504448] shrink-0">
                              {initials}
                            </div>
                            <span className="font-medium text-sm text-gray-800">
                              {employeeName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#504448]">
                          {employeeEmail}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-700">
                          {rec.checkInTime
                            ? new Date(rec.checkInTime).toLocaleTimeString(
                                "en-US",
                                { hour: "numeric", minute: "2-digit" },
                              )
                            : "-"}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-700">
                          {rec.checkOutTime
                            ? new Date(rec.checkOutTime).toLocaleTimeString(
                                "en-US",
                                { hour: "numeric", minute: "2-digit" },
                              )
                            : "-"}
                        </td>
                        <td className="px-6 py-5">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              Active
                            </span>
                          ) : rec.checkInTime ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                              Checked out
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-xs font-medium">
                              Absent
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* toast message */}
        {showToast && message && (
          <div className="fixed top-5 right-5 z-50">
            <Toast message={message} onClose={() => setShowToast(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
