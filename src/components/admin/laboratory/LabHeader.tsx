import { Plus } from "lucide-react";

interface LabHeaderProps {
  onAddStaff?: () => void;
}

export default function LabHeader({ onAddStaff }: LabHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Laboratory Staff</h1>
        <p className="mt-1 text-gray-500">Manage hospital laboratory technicians</p>
      </div>

      {onAddStaff && (
        <button
          onClick={onAddStaff}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Lab Staff
        </button>
      )}
    </div>
  );
}
