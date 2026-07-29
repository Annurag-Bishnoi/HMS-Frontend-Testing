import { Users, UserCheck, UserX, Shield } from "lucide-react";

interface LabStatsProps {
  labStaff: any[];
}

export default function LabStats({ labStaff }: LabStatsProps) {
  const total = labStaff.length;
  const active = labStaff.filter((d) => d.active).length;
  const inactive = total - active;
  const locked = labStaff.filter((d) => d.accountLocked).length;

  const stats = [
    { title: "Total Staff", value: total, icon: Users },
    { title: "Active", value: active, icon: UserCheck },
    { title: "Inactive", value: inactive, icon: UserX },
    { title: "Locked Accounts", value: locked, icon: Shield },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="rounded-xl border bg-white p-5 shadow-sm">
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
