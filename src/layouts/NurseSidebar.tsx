import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, LogOut } from "lucide-react";

export default function NurseSidebar() {
  const location = useLocation();

  const links = [
    {
      to: "/nurse/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    // The tabs for IPD/OPD will just be managed in the Dashboard itself for simplicity
  ];

  return (
    <aside className="hidden w-64 flex-col bg-white shadow-lg lg:flex z-10 border-r border-slate-100 relative">
      
      {/* Decorative Blob */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="flex h-20 items-center justify-center border-b border-slate-100 px-6 backdrop-blur-sm bg-white/80">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          HMS <span className="font-medium text-slate-800 text-lg">Nurse</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto custom-scrollbar relative z-10">
        <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 mt-2">
          Clinical Menu
        </p>
        
        {links.map((link) => {
          const isActive = location.pathname.includes(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <div className={`${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"} transition-colors`}>
                {link.icon}
              </div>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        <Link
          to="/"
          onClick={() => localStorage.removeItem("token")}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut size={20} className="text-red-500" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
