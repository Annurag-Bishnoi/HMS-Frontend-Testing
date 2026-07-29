import { useState } from "react";
import PatientRow from "../../admin/patients/PatientRow";
import PatientDetailsModal from "../../admin/patients/PatientDetailsModal";
import { patients } from "../../../data/patients";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  doctor: string;
  department: string;
  status: string;
}

export default function PatientTable() {

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-slate-100 border-b border-slate-200">

              <tr>

                <th className="px-6 py-4 text-left font-semibold text-slate-700">ID</th>

                <th className="px-6 py-4 text-left font-semibold text-slate-700">Patient</th>

                <th className="px-6 py-4 text-left font-semibold text-slate-700">Age</th>

                <th className="px-6 py-4 text-left font-semibold text-slate-700">Gender</th>

                <th className="px-6 py-4 text-left font-semibold text-slate-700">Phone</th>

                <th className="px-6 py-4 text-left font-semibold text-slate-700">Doctor</th>

                <th className="px-6 py-4 text-left font-semibold text-slate-700">Department</th>

                <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>

                <th className="px-6 py-4 text-center font-semibold text-slate-700">Actions</th>

              </tr>

            </thead>

            <tbody>

              {patients.map((patient) => (

                <PatientRow
                  key={patient.id}
                  patient={patient}
                  onView={setSelectedPatient}
                />

              ))}

            </tbody>

          </table>

        </div>

      </div>

      <PatientDetailsModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </>
  );
}