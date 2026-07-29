import type{ FC } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import { AppointmentProvider } from "../context/AppointmentContext";


const DashboardLayout: FC = () => (
  <AppointmentProvider>
  <div className="flex min-h-screen bg-slate-100">
    <Sidebar />
    <main className="flex-1 p-8 overflow-auto">
      <Outlet />
    </main>
  </div>
  </AppointmentProvider>
);

export default DashboardLayout;