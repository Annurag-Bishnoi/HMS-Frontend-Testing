import { Link } from "react-router-dom";
import { getUser } from "../../../utils/token";

export default function AppointmentHeader() {
  const user = getUser();
  const basePath = user?.role === "RECEPTIONIST" ? "/receptionist" : "/admin";
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Appointments
        </h1>

        <p className="mt-1 text-slate-500">
          Manage hospital appointments
        </p>

      </div>

      <Link
        to={`${basePath}/appointments/add`}
        className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        + New Appointment
      </Link>

    </div>
  );
}
