import { useState } from "react";
import type { ChangeEvent } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordField({
  value,
  onChange,
}: PasswordFieldProps) {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">

      <label className="font-medium text-slate-700">
        Password
      </label>

      <div className="group flex items-center rounded-xl border border-slate-300 bg-white px-4 transition-all duration-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">

        <Lock
          size={20}
          className="text-slate-400 group-focus-within:text-blue-600"
        />

        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Enter your password"
          className="w-full bg-transparent p-4 outline-none"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>

      </div>

    </div>
  );
}