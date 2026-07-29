import { Search } from "lucide-react";

interface LabToolbarProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

export default function LabToolbar({ search, setSearch, status, setStatus }: LabToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search staff..."
          className="w-full rounded-lg border py-2 pl-10 pr-3"
        />
      </div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border px-3 py-2"
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}
