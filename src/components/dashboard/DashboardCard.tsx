import type { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
  growth: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  color,
  growth,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500 text-sm">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>

        </div>

        <div className={`${color} rounded-2xl p-4`}>
          {icon}
        </div>

      </div>

      <div className="mt-5 flex items-center gap-2">

        <TrendingUp
          size={18}
          className="text-green-500"
        />

        <span className="font-semibold text-green-600">
          {growth}
        </span>

        <span className="text-slate-400">
          this month
        </span>

      </div>

    </div>
  );
}