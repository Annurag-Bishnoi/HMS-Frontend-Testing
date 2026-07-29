import { Eye } from "lucide-react";

const patients = [
  {
    id: "P001",
    name: "Rahul Sharma",
    age: 28,
    gender: "Male",
    doctor: "Dr. Amit",
    status: "Admitted",
  },
  {
    id: "P002",
    name: "Priya Singh",
    age: 35,
    gender: "Female",
    doctor: "Dr. Neha",
    status: "Discharged",
  },
  {
    id: "P003",
    name: "Rohan Gupta",
    age: 42,
    gender: "Male",
    doctor: "Dr. Raj",
    status: "Under Treatment",
  },
  {
    id: "P004",
    name: "Anjali Verma",
    age: 30,
    gender: "Female",
    doctor: "Dr. Mehta",
    status: "Admitted",
  },
];

export default function RecentPatients() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Patients
        </h2>

        <button className="text-blue-600 hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100 border-b border-slate-200">

            <tr className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">

              <th className="px-6 py-4 text-left font-semibold text-slate-700">Patient ID</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">Doctor</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-center font-semibold text-slate-700">Action</th>

            </tr>

          </thead>

          <tbody>

            {patients.map((patient) => (

              <tr
                key={patient.id} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group"
              >

                <td className="px-6 py-4">{patient.id}</td>

                <td>

                  <div>

                    <h3 className="font-semibold">
                      {patient.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {patient.age} yrs • {patient.gender}
                    </p>

                  </div>

                </td>

                <td>{patient.doctor}</td>

                <td>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

                    {patient.status}

                  </span>

                </td>

                <td className="px-6 py-4 text-center">

                  <button className="rounded-lg bg-blue-100 p-2 hover:bg-blue-200">

                    <Eye size={18} />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}