import { useState } from "react";
import type { Doctor } from "../../../types/doctor";
import { User, Mail, Phone, Building, Stethoscope, Briefcase, Activity, FileBadge, IndianRupee } from "lucide-react";

interface DoctorFormProps {
  initialData?: Doctor;
  onSubmit: (doctor: Doctor) => void;
}

const DEPARTMENTS = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "General Surgery",
  "Dermatology",
  "Oncology",
  "Emergency",
  "Other"
];

const SPECIALIZATIONS = [
  "General Physician",
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Dermatologist",
  "Oncologist",
  "Anesthesiologist",
  "Psychiatrist",
  "Other"
];

export default function DoctorForm({
  initialData,
  onSubmit,
}: DoctorFormProps) {
  const [doctor, setDoctor] = useState<Doctor>(
    initialData ?? {
      id: 0,
      name: "",
      email: "",
      phone: "",
      department: "",
      specialization: "",
      qualifications: "",
      consultationFee: 0,
      experience: 0,
      status: "Available",
    }
  );

  // Track if "Other" is selected to show custom input
  const [isCustomDept, setIsCustomDept] = useState(
    initialData ? !DEPARTMENTS.includes(initialData.department) && initialData.department !== "" : false
  );
  
  const [isCustomSpec, setIsCustomSpec] = useState(
    initialData ? !SPECIALIZATIONS.includes(initialData.specialization) && initialData.specialization !== "" : false
  );

  const [customDept, setCustomDept] = useState(isCustomDept ? initialData?.department || "" : "");
  const [customSpec, setCustomSpec] = useState(isCustomSpec ? initialData?.specialization || "" : "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDoctor({
      ...doctor,
      [e.target.name]:
        e.target.name === "experience"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "Other") {
      setIsCustomDept(true);
      setDoctor({ ...doctor, department: "" });
    } else {
      setIsCustomDept(false);
      setDoctor({ ...doctor, department: val });
    }
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "Other") {
      setIsCustomSpec(true);
      setDoctor({ ...doctor, specialization: "" });
    } else {
      setIsCustomSpec(false);
      setDoctor({ ...doctor, specialization: val });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure custom values are applied before submission
    const finalDoctor = { ...doctor };
    if (isCustomDept) finalDoctor.department = customDept;
    if (isCustomSpec) finalDoctor.specialization = customSpec;
    
    onSubmit(finalDoctor);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-slate-100"
    >
      {/* Section 1: Personal Details */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
          <User className="text-blue-600" size={20} />
          Personal Details
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User size={16} className="text-slate-400" />
              </div>
              <input
                required
                name="name"
                value={doctor.name}
                onChange={handleChange}
                placeholder="Dr. John Doe"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail size={16} className="text-slate-400" />
              </div>
              <input
                required
                type="email"
                name="email"
                value={doctor.email}
                onChange={handleChange}
                placeholder="doctor@hospital.com"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone size={16} className="text-slate-400" />
              </div>
              <input
                required
                name="phone"
                value={doctor.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Section 2: Professional Details */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Briefcase className="text-blue-600" size={20} />
          Professional Details
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Department */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Building size={16} className="text-slate-400" />
              </div>
              <select
                value={isCustomDept ? "Other" : doctor.department || ""}
                onChange={handleDeptChange}
                className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>Select Department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            {isCustomDept && (
              <input
                required
                type="text"
                value={customDept}
                onChange={(e) => setCustomDept(e.target.value)}
                placeholder="Enter custom department name"
                className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Specialization</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Stethoscope size={16} className="text-slate-400" />
              </div>
              <select
                value={isCustomSpec ? "Other" : doctor.specialization || ""}
                onChange={handleSpecChange}
                className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>Select Specialization</option>
                {SPECIALIZATIONS.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            {isCustomSpec && (
              <input
                required
                type="text"
                value={customSpec}
                onChange={(e) => setCustomSpec(e.target.value)}
                placeholder="Enter custom specialization"
                className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 px-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Experience (Years)</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Briefcase size={16} className="text-slate-400" />
              </div>
              <input
                required
                type="number"
                min="0"
                name="experience"
                value={doctor.experience}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Qualifications</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FileBadge size={16} className="text-slate-400" />
              </div>
              <input
                required
                type="text"
                name="qualifications"
                value={doctor.qualifications}
                onChange={handleChange}
                placeholder="e.g. MBBS, MD - Cardiology"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Consultation Fee */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Consultation Fee (₹)</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IndianRupee size={16} className="text-slate-400" />
              </div>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                name="consultationFee"
                value={doctor.consultationFee}
                onChange={handleChange}
                placeholder="e.g. 500"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Current Status</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Activity size={16} className="text-slate-400" />
              </div>
              <select
                name="status"
                value={doctor.status}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Available">🟢 Available</option>
                <option value="On Leave">🔴 On Leave</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
        >
          {initialData ? "Save Changes" : "Register Doctor"}
        </button>
      </div>
    </form>
  );
}