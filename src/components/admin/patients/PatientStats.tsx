import {
  Users,
  Bed,
  CalendarDays,
  TriangleAlert,
} from "lucide-react";

const stats = [
  {
    title: "Total Patients",
    value: "2,543",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Admitted",
    value: "428",
    icon: Bed,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "OPD Today",
    value: "125",
    icon: CalendarDays,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
  {
    title: "Critical",
    value: "18",
    icon: TriangleAlert,
    color: "text-red-600",
    bg: "bg-red-100",
  },
];

export default function PatientStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {item.value}
                </h2>

              </div>

              <div
                className={`rounded-xl p-4 ${item.bg}`}
              >
                <Icon
                  size={28}
                  className={item.color}
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
