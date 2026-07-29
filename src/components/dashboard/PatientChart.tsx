import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", patients: 320 },
  { month: "Feb", patients: 410 },
  { month: "Mar", patients: 480 },
  { month: "Apr", patients: 530 },
  { month: "May", patients: 610 },
  { month: "Jun", patients: 720 },
  { month: "Jul", patients: 810 },
];

export default function PatientChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

      <h2 className="mb-5 text-xl font-semibold">
        Monthly Patient Visits
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Line
            dataKey="patients"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}