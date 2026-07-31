import { Search } from "lucide-react";

interface DoctorToolbarProps {
  search: string;
  setSearch: (value: string) => void;

  department: string;
  setDepartment: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;
}

export default function DoctorToolbar({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
}: DoctorToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:items-center">

      <div className="relative flex-1">

        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctor..."
          className="w-full rounded-lg border py-2 pl-10 pr-3"
        />

      </div>

      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="rounded-lg border px-3 py-2"
      >
        <option value="All">All Departments</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Neurology">Neurology</option>
        <option value="Pediatrics">Pediatrics</option>
        <option value="Orthopedics">Orthopedics</option>
        <option value="General Surgery">General Surgery</option>
        <option value="Dermatology">Dermatology</option>
        <option value="Oncology">Oncology</option>
        <option value="Emergency">Emergency</option>
        <option value="Other">Other</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border px-3 py-2"
      >
        <option>All</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>

    </div>
  );
}
