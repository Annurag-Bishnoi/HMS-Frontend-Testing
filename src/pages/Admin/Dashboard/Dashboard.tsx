import Topbar from "../../../components/dashboard/Topbar";
import {
    Users,
    UserCog,
    DollarSign,
    CalendarCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell 
} from "recharts";
import { getPatients } from "../../../api/patientService";
import { getDoctors } from "../../../api/doctorService";
import { getAppointments } from "../../../api/appointmentService";
import { billingService } from "../../../api/billingService";
import { getAllLabTests } from "../../../api/labService";
import { pharmacyService } from "../../../api/pharmacyService";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

export default function Dashboard() {
    const [stats, setStats] = useState({
        patients: 0,
        doctors: 0,
        appointments: 0,
        revenue: 0
    });
    const [appointmentChart, setAppointmentChart] = useState<any[]>([]);
    const [revenueChart, setRevenueChart] = useState<any[]>([]);
    const [labChart, setLabChart] = useState<any[]>([]);
    const [medChart, setMedChart] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [patientsRes, doctorsRes, appointmentsRes, billsRes, labRes, pxPendingRes, pxDispensedRes] = await Promise.all([
                    getPatients().catch(() => []),
                    getDoctors().catch(() => []),
                    getAppointments().catch(() => []),
                    billingService.getAllBills('PAID').catch(() => []),
                    getAllLabTests().catch(() => []),
                    pharmacyService.getPendingPrescriptions().catch(() => []),
                    pharmacyService.getDispensedPrescriptions().catch(() => [])
                ]);
                
                const pxRes = [...pxPendingRes, ...pxDispensedRes];
                
                const today = new Date().toDateString();
                const todayAppointments = (appointmentsRes || []).filter((app: any) => new Date(app.appointmentDate).toDateString() === today);
                const totalRevenue = (billsRes || []).reduce((sum: number, bill: any) => sum + (bill.totalAmount || 0), 0);

                setStats({
                    patients: patientsRes?.length || 0,
                    doctors: doctorsRes?.length || 0,
                    appointments: todayAppointments?.length || 0,
                    revenue: totalRevenue
                });

                // 1. Appointments Data
                const apptsData = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];
                    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                    const count = (appointmentsRes || []).filter((app: any) => (app.appointmentDate as string).startsWith(dateStr)).length;
                    apptsData.push({ name: dayName, appointments: count });
                }
                setAppointmentChart(apptsData);

                // 2. Revenue Data (Highlighting Pharmacy)
                const revMap = new Map<string, number>();
                (billsRes || []).forEach((b: any) => {
                    const dept = b.department || 'Other';
                    revMap.set(dept, (revMap.get(dept) || 0) + (b.totalAmount || 0));
                });
                const revData = Array.from(revMap.entries()).map(([name, revenue]) => ({ name, revenue }));
                setRevenueChart(revData.length ? revData : [
                    { name: 'Pharmacy', revenue: 0 },
                    { name: 'Laboratory', revenue: 0 },
                    { name: 'Consultation', revenue: 0 }
                ]);

                // 3. Lab Tests Data
                const labMap = new Map<string, number>();
                (labRes || []).forEach((t: any) => {
                    const name = t.testName || t.name || 'Unknown';
                    labMap.set(name, (labMap.get(name) || 0) + 1);
                });
                const lData = Array.from(labMap.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);
                setLabChart(lData.length ? lData : [{ name: 'No Data', value: 1 }]);

                // 4. Medicine Data
                const medMap = new Map<string, number>();
                (pxRes || []).forEach((px: any) => {
                    if (px.medications) {
                        px.medications.forEach((m: any) => {
                            const name = m.medicineName || m.name || 'Unknown';
                            medMap.set(name, (medMap.get(name) || 0) + (m.quantity || 1));
                        });
                    }
                });
                const mData = Array.from(medMap.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);
                setMedChart(mData.length ? mData : [{ name: 'No Data', value: 1 }]);

            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
                    <p className="font-semibold text-slate-800">{payload[0].name}</p>
                    <p className="text-blue-600 font-medium">Count: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <Topbar />

            <div>
                <h1 className="text-3xl font-bold text-slate-800">Detailed Analytics Dashboard</h1>
                <p className="text-slate-500 mt-2 max-w-3xl">
                    View in-depth metrics and professional analytics for hospital operations, pharmacy revenue, laboratory tests, and medicine usage.
                </p>
            </div>

            {/* Live KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Patients</p>
                        <h3 className="text-3xl font-bold text-slate-800">
                            {loading ? "..." : stats.patients}
                        </h3>
                    </div>
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <Users size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Doctors</p>
                        <h3 className="text-3xl font-bold text-slate-800">
                            {loading ? "..." : stats.doctors}
                        </h3>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                        <UserCog size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Today's Appointments</p>
                        <h3 className="text-3xl font-bold text-slate-800">
                            {loading ? "..." : stats.appointments}
                        </h3>
                    </div>
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                        <CalendarCheck size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-slate-800">
                            {loading ? "..." : `₹${stats.revenue.toLocaleString()}`}
                        </h3>
                    </div>
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
                        <DollarSign size={24} />
                    </div>
                </div>
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                
                {/* Pharmacy Revenue Chart (Bar) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Pharmacy & Dept Revenue</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueChart} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} angle={-35} textAnchor="end" />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                {/* Highlight Pharmacy in Green, others in Blue */}
                                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                                    {revenueChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Pharmacy' ? '#10b981' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Most Used Medicine Chart (Pie) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Most Prescribed Medicines</h2>
                    <div className="flex-1 w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={medChart}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {medChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lab Tests Chart (Pie) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Top Lab Tests Requested</h2>
                    <div className="flex-1 w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={labChart}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {labChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Appointments Chart (Line) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Appointments Trend (Last 7 Days)</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={appointmentChart}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="appointments" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#8b5cf6' }} activeDot={{ r: 6 }} name="Appointments" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}