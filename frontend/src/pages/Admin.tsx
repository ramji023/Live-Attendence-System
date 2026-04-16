import { useState } from "react";

type Employee = {
  id: string;
  name: string;
  status: "IN" | "OUT";
  checkIn?: string;
  checkOut?: string;
  date: string; // YYYY-MM-DD
};

export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE">("ALL"); // to sort the employee based on selected filter
  // store date select by admin
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  //   dummy data
  const employees: Employee[] = [
    {
      id: "1",
      name: "Ram",
      status: "IN",
      checkIn: "09:10 AM",
      date: "2026-04-16",
    },
    {
      id: "2",
      name: "Amit",
      status: "OUT",
      checkIn: "09:00 AM",
      checkOut: "05:30 PM",
      date: "2026-04-16",
    },
    {
      id: "3",
      name: "Priya",
      status: "IN",
      checkIn: "10:15 AM",
      date: "2026-04-15",
    },
  ];

  // format today date and day
  const today = new Date(selectedDate);
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const fullDate = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  //filtering logic based on date and time
  const filteredData = employees.filter((emp) => {
    const matchDate = emp.date === selectedDate;
    const matchStatus = statusFilter === "ALL" || emp.status === "IN";

    return matchDate && matchStatus;
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
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
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
            {filteredData.length} Records
          </span>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {emp.name}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        emp.status === "IN"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {emp.status === "IN" ? "Active" : "Checked Out"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {emp.checkIn || "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {emp.checkOut || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* empty state */}
          {filteredData.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No attendance data for selected filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
