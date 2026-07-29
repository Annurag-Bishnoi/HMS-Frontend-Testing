import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarDays,
  CreditCard,
  Pill,
  FlaskConical,
  BarChart3,
  Settings,
  LogOut,
  HeartPulse,
  Stethoscope,
  FileText,
  BedDouble,
  Activity
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../utils/token";

const adminMenu = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { title: "Patients", icon: Users, path: "/admin/patients" },
  { title: "Doctors", icon: UserCog, path: "/admin/doctors" },
  { title: "Appointments", icon: CalendarDays, path: "/admin/appointments" },
  { title: "Billing", icon: CreditCard, path: "/admin/billing" },
  { title: "Pharmacy", icon: Pill, path: "/admin/pharmacy" },
  { title: "Laboratory", icon: FlaskConical, path: "/admin/laboratory" },
  { title: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];

const doctorMenu = [
  { title: "My Dashboard", icon: LayoutDashboard, path: "/doctor/dashboard" },
  { title: "My Patients", icon: Users, path: "/doctor/patients" },
  { title: "Appointments", icon: CalendarDays, path: "/doctor/appointments" },
  { title: "Prescriptions", icon: Pill, path: "/doctor/prescriptions" },
  { title: "IPD Patients", icon: BedDouble, path: "/doctor/ipd" },
];

const receptionistMenu = [
  { title: "Front Desk", icon: LayoutDashboard, path: "/receptionist/dashboard" },
  { title: "Registrations", icon: Users, path: "/receptionist/patients" },
  { title: "Appointments", icon: CalendarDays, path: "/receptionist/appointments" },
  { title: "IPD Beds", icon: BedDouble, path: "/receptionist/ipd-beds" },
  { title: "Billing", icon: CreditCard, path: "/receptionist/billing" },
];

const nurseMenu = [
  { title: "IPD Station", icon: Activity, path: "/nurse/dashboard" },
];

const pharmacistMenu = [
  { title: "Pharmacy", icon: LayoutDashboard, path: "/pharmacy/dashboard" },
  { title: "Inventory", icon: Pill, path: "/pharmacy/inventory" },
  { title: "Dispense", icon: FlaskConical, path: "/pharmacy/dispense" },
];

const labMenu = [
  { title: "Lab Dashboard", icon: LayoutDashboard, path: "/lab/dashboard" },
  { title: "Test Requests", icon: FlaskConical, path: "/lab/requests" },
  { title: "Results", icon: BarChart3, path: "/lab/results" },
];

const billingMenu = [
  { title: "Billing Desk", icon: LayoutDashboard, path: "/billing/dashboard" },
  { title: "Invoices", icon: CreditCard, path: "/billing/invoices" },
];

const patientMenu = [
  { title: "My Health",     icon: HeartPulse,    path: "/patient/dashboard"      },
  { title: "Appointments",  icon: CalendarDays,  path: "/patient/appointments"   },
  { title: "Visit History", icon: Stethoscope,   path: "/patient/history"        },
  { title: "Prescriptions", icon: Pill,          path: "/patient/prescriptions"  },
  { title: "Lab Tests",     icon: FlaskConical,  path: "/patient/labs"           },
  { title: "My Profile",    icon: Users,         path: "/patient/profile"        },
];

const getMenuByRole = (role: string) => {
  switch (role) {
    case "ADMIN": return adminMenu;
    case "DOCTOR": return doctorMenu;
    case "RECEPTIONIST": return receptionistMenu;
    case "PHARMACIST": return pharmacistMenu;
    case "LAB_TECHNICIAN":
    case "LABORATORY": return labMenu;
    case "BILLING": return billingMenu;
    case "PATIENT": return patientMenu;
    case "NURSE": return nurseMenu;
    default: return adminMenu;
  }
};

export default function Sidebar() {
  const navigate = useNavigate();
  const user = getUser();
  const menuItems = getMenuByRole(user?.role || "ADMIN");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white shadow-sm">

      {/* Logo */}

      <div className="flex items-center gap-3 border-b border-slate-200 p-6">

        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-3">

          <HeartPulse className="text-white" size={28} />

        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            MediCare HMS
          </h2>
          <p className="text-xs text-slate-500 capitalize">
            {user?.role?.toLowerCase() || "Admin"} Panel
          </p>
        </div>

      </div>

      {/* Menu */}

      <nav className="flex-1 space-y-2 p-5">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              <Icon size={22} />

              <span className="font-medium">
                {item.title}
              </span>

            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white uppercase">
            {user?.name?.[0] || user?.username?.[0] || "U"}
          </div>
          <div>
            <h3 className="font-semibold truncate max-w-[150px]">
              {user?.name || user?.username || "User"}
            </h3>
            <p className="text-sm text-slate-500 truncate max-w-[150px]">
              {user?.role || "Role"}
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </aside>
  );
}