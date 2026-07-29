import { CalendarDays, CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import type { Appointment } from "../../../types/appointment";

export default function AppointmentStats({ appointments }: { appointments: Appointment[] }) {
  const total = appointments.length;
  const scheduled = appointments.filter(a => a.status === "SCHEDULED" || a.status === "Scheduled").length;
  const completed = appointments.filter(a => a.status === "COMPLETED" || a.status === "Completed").length;
  const cancelled = appointments.filter(a => a.status === "CANCELLED" || a.status === "Cancelled").length;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total" value={total.toString()} icon={<CalendarDays size={28} />} color="bg-blue-500" />
      <StatCard title="Scheduled" value={scheduled.toString()} icon={<Clock3 size={28} />} color="bg-yellow-500" />
      <StatCard title="Completed" value={completed.toString()} icon={<CheckCircle2 size={28} />} color="bg-green-500" />
      <StatCard title="Cancelled" value={cancelled.toString()} icon={<XCircle size={28} />} color="bg-red-500" />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>
        <div className={`rounded-xl p-3 text-white ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}