import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.ts";
import { socket } from "../socket/socket.ts";
import { User, UserStar } from "lucide-react";

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

      socket.auth = {
        token: res.data.token,
      };

      socket.connect();
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
    <div className="font-body min-h-screen flex items-center justify-center bg-[#f7f9fb] p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_40px_rgba(11,28,48,0.06)] p-4 md:p-12">
        {/* Header */}
        <div className="mb-7 text-center">
          <h2 className="text-3xl font-headline font-bold text-[#191c1e] mb-2">
            Welcome back
          </h2>
          <p className="text-[#45464d] text-sm">
            Please enter your credentials to access the portal.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex p-1 bg-[#f2f4f6] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole("employee")}
            className={`flex-1 items-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition ${
              role === "employee"
                ? "bg-white shadow-sm text-[#497cff]"
                : "text-[#45464d] hover:text-black"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User size={16} />
              Employee
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition ${
              role === "admin"
                ? "bg-white shadow-sm text-[#497cff]"
                : "text-[#45464d] hover:text-black"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserStar size={16} />
              Admin
            </div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold uppercase text-[#45464d] ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="username"
              required
              className="w-full px-4 py-3 bg-[#f2f4f6] border-b-2 border-transparent focus:border-[#0053db] rounded-t-xl outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold uppercase text-[#45464d] ml-1">
              Work Email or ID
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@ethereal.pro"
              required
              className="w-full px-4 py-3 bg-[#f2f4f6] border-b-2 border-transparent focus:border-[#0053db] rounded-t-xl outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold uppercase text-[#45464d]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-[#f2f4f6] border-b-2 border-transparent focus:border-[#0053db] rounded-t-xl outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[#00174b] text-white font-bold rounded-xl hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        {/* Info */}
        <div className="mt-10 p-4 bg-[#dbe1ff] rounded-2xl text-sm">
          <p className="font-semibold text-[#00174b]">Demo</p>
          <p className="text-[#38485d] text-xs">
            admin_email : admin@example.com
          </p>
        </div>
      </div>
    </div>
  );
}
