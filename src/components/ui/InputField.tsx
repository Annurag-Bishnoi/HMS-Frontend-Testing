import type { ChangeEvent, ReactNode } from "react";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  icon: ReactNode;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  label,
  type,
  placeholder,
  icon,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="font-medium text-slate-700">
        {label}
      </label>

      <div className="group flex items-center rounded-xl border border-slate-300 bg-white px-4 transition-all duration-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">

        <div className="text-slate-400 group-focus-within:text-blue-600">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent p-4 outline-none"
        />

      </div>
    </div>
  );
}