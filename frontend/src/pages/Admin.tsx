import { useEffect, useRef, useState } from "react";
import { socket } from "../socket/socket";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";

type Record = {
  employeeId: {
    name: string;
    email: string;
  };
  checkInTime?: string;
  checkOutTime?: string;
};

export default function AdminDashboard() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  // store date select by admin
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const user = useAuthStore((s) => s.user);
  const [toast, setToast] = useState<string | null>(null); // store live updates
  const [records, setRecords] = useState<Record[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE">("ALL"); // to sort the employee based on selected filter
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // write function to fetch the updated records
  const fetchRecords = async (selectedDate?: string) => {
    try {
      const token = useAuthStore.getState().user?.token;

      const res = await axios.get(
        `http://localhost:3000/api/v1/attendence/allRecords?date=${
          selectedDate || date
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setRecords(res.data.data);
    } catch (err) {
      console.error(err);
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
      setToast(data.message);
      // fetch updated data
      fetchRecords();
      // clear the time interval
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // hide message after 3 sec
      timerRef.current = setTimeout(() => {
        setToast(null);
      }, 3000);
    });

    return () => {
      socket.off("attendance-updated");
    };
  }, []);

  // format today date and day
  const today = new Date(selectedDate);
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const fullDate = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const filteredRecords = records.filter((rec) => {
    if (statusFilter === "ACTIVE") {
      return rec.checkInTime && !rec.checkOutTime;
    }
    return true;
  });
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-indigo-50 px-6 md:px-20 py-10">
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-gray-500 text-sm">
            {day}, {fullDate}
          </p>
          <h1 className="text-3xl font-semibold text-gray-800 mt-1">
            Live Attendence
          </h1>
        </div>

        {/* fitlers */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* date selection input by default (today date) */}
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              fetchRecords(e.target.value);
            }}
            className="px-4 py-2 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none"
          />

          {/* status buttons */}
          <div className="flex bg-white rounded-xl shadow p-1">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === "ALL"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              All Employees
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === "ACTIVE"
                  ? "bg-green-500 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              Active
            </button>
          </div>
        </div>
      </div>

      {/* table card */}
      <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden border">
        {/* table header */}
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Employee Attendance</h2>
          <span className="text-sm text-gray-500">
            {records.length} Records
          </span>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <p>No records found</p>
          ) : (
            <table className="w-full mt-6 border rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Check In</th>
                  <th className="p-3 text-left">Check Out</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((rec, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">{rec.employeeId.name}</td>
                    <td className="p-3">{rec.employeeId.email}</td>

                    <td className="p-3">
                      {rec.checkInTime
                        ? new Date(rec.checkInTime).toLocaleTimeString()
                        : "-"}
                    </td>

                    <td className="p-3">
                      {rec.checkOutTime
                        ? new Date(rec.checkOutTime).toLocaleTimeString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {toast && (
        <div className="fixed top-5 right-5 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg animate-slide-in">
          {toast}
        </div>
      )}
    </div>
  );
}
