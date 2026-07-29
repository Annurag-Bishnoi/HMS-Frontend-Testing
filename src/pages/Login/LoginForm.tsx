import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";

import { login } from "../../api/authService";
import { saveUser } from "../../utils/token";

const DEMO_ROLES = [
  { id: "admin", label: "Admin", username: "admin01", icon: "👑", color: "bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200" },
  { id: "doctor", label: "Doctor", username: "doctor01", icon: "👨‍⚕️", color: "bg-emerald-100 text-emerald-600 border-emerald-200 hover:bg-emerald-200" },
  { id: "reception", label: "Reception", username: "reception01", icon: "👩‍💼", color: "bg-indigo-100 text-indigo-600 border-indigo-200 hover:bg-indigo-200" },
  { id: "pharma", label: "Pharmacy", username: "pharma01", icon: "💊", color: "bg-teal-100 text-teal-600 border-teal-200 hover:bg-teal-200" },
  { id: "lab", label: "Lab", username: "lab01", icon: "🔬", color: "bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200" },
  { id: "billing", label: "Billing", username: "billing01", icon: "💳", color: "bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200" },
  { id: "patient", label: "Patient", username: "patient01", icon: "🤒", color: "bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200" },
];

export default function LoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await login({
        username,
        password,
      });

      if (response.success) {
        saveUser(response);

        switch (response.role) {
          case "ADMIN":
            navigate("/admin/dashboard");
            break;

          case "DOCTOR":
            navigate("/doctor/dashboard");
            break;

          case "RECEPTIONIST":
            navigate("/receptionist/dashboard");
            break;

          case "PATIENT":
            navigate("/patient/dashboard");
            break;

          case "PHARMACIST":
            navigate("/pharmacy/dashboard");
            break;

          case "LABORATORY":
            navigate("/lab/dashboard");
            break;

          default:
            navigate("/");
        }
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      if (err.response?.data) {
        // Backend might return a string directly or an object with a message
        const errorMessage = typeof err.response.data === "string" 
          ? err.response.data 
          : err.response.data.message;
        
        setError(errorMessage || "Login failed.");
      } else {
        setError("Unable to connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md rounded-3xl border border-white/40 bg-white/80 p-10 shadow-2xl backdrop-blur-xl"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 text-blue-600 transition hover:text-blue-700"
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>

      {/* Heading */}
      <h2 className="text-4xl font-bold text-slate-800">
        Welcome Back
      </h2>

      <p className="mt-2 text-slate-500">
        Login to Hospital Management System
      </p>

      {/* Role Selector for Demo */}
      <div className="mt-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Login (Demo)</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => {
                setUsername(role.username);
                setPassword("Anurag@123");
                setError("");
              }}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${role.color} ${username === role.username ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
            >
              <span>{role.icon}</span>
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Username */}
      <div className="mt-8">
        <InputField
          label="Username"
          type="text"
          placeholder="Enter your username"
          icon={<User size={20} />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="mt-6">
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Remember Me */}
      <div className="mt-5 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Remember Me
        </label>

        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="mt-8 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Signing In..." : "Login"}
      </button>

      {/* Contact */}
      <p className="mt-6 text-center text-slate-500">
        Need an account?
        <span className="ml-2 font-semibold text-blue-600">
          Contact Administrator
        </span>
      </p>
    </motion.div>
  );
}