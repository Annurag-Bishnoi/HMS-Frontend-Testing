export default function RecentAppointments() {

  const appointments = [
    {
      patient: "Rahul Sharma",
      doctor: "Dr. Amit",
      time: "10:30 AM",
      status: "Confirmed",
    },
    {
      patient: "Priya Singh",
      doctor: "Dr. Neha",
      time: "11:15 AM",
      status: "Waiting",
    },
    {
      patient: "Rohan Gupta",
      doctor: "Dr. Raj",
      time: "12:00 PM",
      status: "Completed",
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

      <h2 className="mb-5 text-xl font-semibold">
        Today's Appointments
      </h2>

      <div className="space-y-4">

        {appointments.map((item) => (

          <div
            key={item.patient}
            className="rounded-xl border p-4"
          >

            <h3 className="font-semibold">
              {item.patient}
            </h3>

            <p className="text-sm text-slate-500">
              {item.doctor}
            </p>

            <div className="mt-2 flex justify-between">

              <span>{item.time}</span>

              <span className="text-blue-600 font-medium">
                {item.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}