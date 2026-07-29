const activities = [
  "Patient Rahul Sharma admitted.",
  "Billing completed for Priya Singh.",
  "Appointment booked with Dr. Amit.",
  "Laboratory report uploaded.",
  "Emergency patient arrived.",
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="flex gap-4"
          >

            <div className="mt-2 h-3 w-3 rounded-full bg-blue-600"></div>

            <p className="text-slate-600">
              {activity}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}