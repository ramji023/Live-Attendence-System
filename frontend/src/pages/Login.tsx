import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.ts";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  // state to store user role
  const [role, setRole] = useState<"employee" | "admin">("employee");
  // state to store form data and set by default empty string
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // write function when user update the input value and update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // when user click to submit button then console the data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/v1/auth/login", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      console.log("Success:", res.data);

      setUser({
        token: res.data.token,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.role,
      });

      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "employee") {
        navigate("/employee");
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-white to-blue-100 px-4">
      {/* card   */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8">
        {/* title  */}
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Login to your attendance dashboard
        </p>

        {/* role toggle button */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setRole("employee")}
            className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all ${
              role === "employee"
                ? "bg-white shadow text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all ${
              role === "admin"
                ? "bg-white shadow text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Admin
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm">
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm">
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm">
              Password
            </label>
          </div>

          {/* button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-linear-to-r from-indigo-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secure employee attendance system
        </p>
      </div>
    </div>
  );
}
