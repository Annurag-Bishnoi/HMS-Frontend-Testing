const departments = [
  {
    name: "Cardiology",
    patients: 145,
  },
  {
    name: "Neurology",
    patients: 98,
  },
  {
    name: "Orthopedics",
    patients: 110,
  },
  {
    name: "Pediatrics",
    patients: 180,
  },
];

export default function DepartmentStatistics() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Department Statistics
      </h2>

      <div className="space-y-5">

        {departments.map((dept) => (

          <div key={dept.name}>

            <div className="mb-2 flex justify-between">

              <span>{dept.name}</span>

              <span className="font-semibold">

                {dept.patients}

              </span>

            </div>

            <div className="h-3 rounded-full bg-slate-200">

              <div
                className="h-3 rounded-full bg-blue-600"
                style={{
                  width: `${dept.patients / 2}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}