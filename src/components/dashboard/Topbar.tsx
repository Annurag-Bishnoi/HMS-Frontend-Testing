import {
  Bell,
  Mail,
  UserCircle,
} from "lucide-react";
import { getUser } from "../../utils/token";

export default function Topbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const user = getUser();
  
  // Format the role to look nice (e.g., "SUPER_ADMIN" -> "Super Admin", "DOCTOR" -> "Doctor")
  const formatRole = (role?: string) => {
    if (!role) return "User";
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <header className="mb-8 flex items-center justify-between">

      {/* Left */}

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          {today}
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-4">
        {/* Profile */}

        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 shadow">

          <UserCircle
            size={40}
            className="text-blue-600"
          />

          <div>
            <h3 className="font-semibold text-slate-800">
              {user?.name || user?.username || "Guest"}
            </h3>
            <p className="text-sm text-slate-500">
              {formatRole(user?.role)}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}