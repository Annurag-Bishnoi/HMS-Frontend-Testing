import Topbar from "../../../components/dashboard/Topbar";
import { Link } from "react-router-dom";
import {
    Users,
    UserCog,
    Settings,
    Database,
    ShieldAlert,
    Building,
    Pill,
    TestTube,
    Bed,
    ActivitySquare
} from "lucide-react";
import { getUser } from "../../../utils/token";

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <Topbar />

            <div>
                <h1 className="text-3xl font-bold text-slate-800">Hospital Control Center</h1>
                <p className="text-slate-500 mt-2 max-w-3xl">
                    Welcome to the central management dashboard. From here, you can configure master data, manage all hospital staff, and oversee system operations without needing to switch roles.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Master Data Management */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Database size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Master Data</h2>
                    </div>
                    <div className="space-y-3">
                        <Link to="/admin/departments" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition group">
                            <Building size={20} className="text-slate-400 group-hover:text-blue-500" />
                            <div className="font-semibold text-slate-700">Departments & Rooms</div>
                        </Link>
                        <Link to="/admin/medicines" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition group">
                            <Pill size={20} className="text-slate-400 group-hover:text-blue-500" />
                            <div className="font-semibold text-slate-700">Medicine Directory</div>
                        </Link>
                        <Link to="/admin/lab-tests" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition group">
                            <TestTube size={20} className="text-slate-400 group-hover:text-blue-500" />
                            <div className="font-semibold text-slate-700">Lab Test Definitions</div>
                        </Link>
                        <Link to="/admin/beds" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition group">
                            <Bed size={20} className="text-slate-400 group-hover:text-blue-500" />
                            <div className="font-semibold text-slate-700">Bed Management</div>
                        </Link>
                    </div>
                </div>

                {/* User & Role Management */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Staff & Users</h2>
                    </div>
                    <div className="space-y-3">
                        <Link to="/admin/doctors" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-emerald-300 transition group">
                            <UserCog size={20} className="text-slate-400 group-hover:text-emerald-500" />
                            <div className="font-semibold text-slate-700">Manage Doctors</div>
                        </Link>
                        <Link to="/admin/receptionists" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-emerald-300 transition group">
                            <Users size={20} className="text-slate-400 group-hover:text-emerald-500" />
                            <div className="font-semibold text-slate-700">Manage Receptionists</div>
                        </Link>
                        <Link to="/admin/laboratory" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-emerald-300 transition group">
                            <TestTube size={20} className="text-slate-400 group-hover:text-emerald-500" />
                            <div className="font-semibold text-slate-700">Manage Lab Staff</div>
                        </Link>
                        <Link to="/admin/pharmacy" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-emerald-300 transition group">
                            <Pill size={20} className="text-slate-400 group-hover:text-emerald-500" />
                            <div className="font-semibold text-slate-700">Manage Pharmacists</div>
                        </Link>
                    </div>
                </div>

                {/* System Oversight */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <ShieldAlert size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">System Oversight</h2>
                    </div>
                    <div className="space-y-3">
                        <Link to="/admin/settings" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-indigo-300 transition group">
                            <Settings size={20} className="text-slate-400 group-hover:text-indigo-500" />
                            <div className="font-semibold text-slate-700">Hospital Settings</div>
                        </Link>
                        <Link to="/admin/audit-logs" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-indigo-300 transition group">
                            <ActivitySquare size={20} className="text-slate-400 group-hover:text-indigo-500" />
                            <div className="font-semibold text-slate-700">Audit Logs</div>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}