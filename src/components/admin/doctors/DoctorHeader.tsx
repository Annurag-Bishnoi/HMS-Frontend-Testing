import { Plus } from "lucide-react";

interface DoctorHeaderProps {
  onAddDoctor: () => void;
}

export default function DoctorHeader({
  onAddDoctor,
}: DoctorHeaderProps) {
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold">
          Doctors
        </h1>

        <p className="mt-1 text-gray-500">
          Manage hospital doctors
        </p>

      </div>

      <button
        onClick={onAddDoctor}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        <Plus size={18} />

        Add Doctor
      </button>

    </div>
  );
}
