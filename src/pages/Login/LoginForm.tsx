import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import ContactAdminModal from "./ContactAdminModal";

import { login } from "../../api/authService";
import { saveUser } from "../../utils/token";



export default function LoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleLogin = async () => {
    if (!username || !password || !role) {
      setError("Please enter username, password, and select a role.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await login({
        username,
        password,
        role,
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

          case "NURSE":
            navigate("/nurse/dashboard");
            break;

          case "BILLING":
            navigate("/billing/dashboard");
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



      {/* Role Selection */}
      <div className="mt-8">
        <label className="text-sm font-medium text-slate-700 mb-1 block">Role</label>
        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white p-3 pr-10 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer transition-all hover:border-blue-300"
          >
            <option value="" disabled>Select your role...</option>
            <option value="ADMIN">Admin</option>
            <option value="DOCTOR">Doctor</option>
            <option value="NURSE">Nurse</option>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="PHARMACIST">Pharmacist</option>
            <option value="LABORATORY">Laboratory</option>
            <option value="BILLING">Billing / Accountant</option>
            <option value="PATIENT">Patient</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Username */}
      <div className="mt-6">
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
          onClick={() => setIsContactModalOpen(true)}
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
        <button
          type="button"
          onClick={() => setIsContactModalOpen(true)}
          className="ml-2 font-semibold text-blue-600 hover:underline"
        >
          Contact Administrator
        </button>
      </p>

      <ContactAdminModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </motion.div>
  );
}