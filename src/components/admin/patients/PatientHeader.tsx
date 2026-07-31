import { Plus } from "lucide-react";

export default function PatientHeader() {
  return (
    <div className="flex items-center justify-between">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Patients
        </h1>

        <p className="mt-1 text-slate-500">
          Manage all registered patients
        </p>
      </div>

      <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow transition hover:bg-blue-700">
        <Plus size={18} />
        Add Patient
      </button>

    </div>
  );
}
