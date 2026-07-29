import {
  Search,
  Bell,
  Mail,
  UserCircle,
} from "lucide-react";

export default function Topbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

        {/* Search */}

        <div className="relative hidden md:block">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-500"
          />

        </div>

        {/* Notifications */}

        <button className="rounded-xl bg-white p-3 shadow hover:bg-slate-100">
          <Bell size={20} />
        </button>

        {/* Messages */}

        <button className="rounded-xl bg-white p-3 shadow hover:bg-slate-100">
          <Mail size={20} />
        </button>

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 shadow">

          <UserCircle
            size={40}
            className="text-blue-600"
          />

          <div>

            <h3 className="font-semibold">
              Admin
            </h3>

            <p className="text-sm text-slate-500">
              Super Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}