import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* 404 number */}
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

      {/* message */}
      <p className="text-lg text-gray-600 mb-6 text-center">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      {/* button */}
      <button
        onClick={() => navigate("/")}
        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
      >
        Go Back Home
      </button>
    </div>
  );
}