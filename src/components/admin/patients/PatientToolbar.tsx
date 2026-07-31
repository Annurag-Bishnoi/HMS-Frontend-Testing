import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus } from "lucide-react";
import { getUser } from "../../../utils/token";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  department: string;
  setDepartment: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;
}

export default function PatientToolbar({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
}: Props) {
  const navigate = useNavigate();
  const user = getUser();
  const basePath = user?.role === "RECEPTIONIST" ? "/receptionist" : "/admin";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">

      {/* Search */}

      <div className="relative">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search Patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-xl border border-slate-300 py-3 pl-11 pr-4 focus:border-blue-500 focus:outline-none"
        />

      </div>

      <div className="flex flex-wrap gap-3">

        {/* Department */}

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3"
        >
          <option value="All">All Departments</option>
          <option>Cardiology</option>
          <option>Neurology</option>
          <option>Orthopedics</option>
          <option>Pediatrics</option>
          <option>Emergency</option>
        </select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3"
        >
          <option value="All">All Status</option>
          <option>Admitted</option>
          <option>Discharged</option>
          <option>Under Treatment</option>
        </select>

        <button
          onClick={() => navigate(`${basePath}/patients/add`)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Patient
        </button>

      </div>

    </div>
  );
}
