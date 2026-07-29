// d:/frontend/src/components/admin/doctors/DoctorStats.tsx
import { Users, UserCheck, UserX, Building2 } from "lucide-react";
import type { Doctor } from "../../../types/doctor";

interface DoctorStatsProps {
  doctors: Doctor[];
}

export default function DoctorStats({ doctors }: DoctorStatsProps) {

  // ---------- Dynamic calculations ----------
  const totalDoctors = doctors.length;

  // Count doctors whose status is exactly "Available"
  const availableToday = doctors.filter((d) => d.status === "Available").length;

  // Count doctors whose status is exactly "On Leave"
  const onLeave = doctors.filter((d) => d.status === "On Leave").length;

  // Count distinct department names
  const departments = new Set(doctors.map((d) => d.department)).size;

  // Build the stats array using the computed values
  const stats = [
    { title: "Total Doctors",   value: totalDoctors,   icon: Users },
    { title: "Available Today", value: availableToday, icon: UserCheck },
    { title: "On Leave",        value: onLeave,        icon: UserX },
    { title: "Departments",     value: departments,    icon: Building2 },
  ];

  // ---------- Render ----------
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>
              </div>
              <Icon className="h-10 w-10 text-blue-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}