import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { tableHeadClass, tableRowClass, tableCellClass } from "../../../components/common/DataTable";
import { TableEmptyRow } from "../../../components/common/DataTable";
import TableStatusBadge from "../../../components/common/TableStatusBadge";

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const logs = [
    { id: 1, timestamp: "2024-05-24 14:30:22", user: "admin", role: "ADMIN", action: "User Deactivated", details: "Deactivated user id: 45", status: "SUCCESS" },
    { id: 2, timestamp: "2024-05-24 14:15:10", user: "reception1", role: "RECEPTIONIST", action: "Payment Collected", details: "Collected ₹500 for Appointment #1024", status: "SUCCESS" },
    { id: 3, timestamp: "2024-05-24 13:45:05", user: "doctor1", role: "DOCTOR", action: "Prescription Created", details: "Added 2 medicines for Visit #889", status: "SUCCESS" },
    { id: 4, timestamp: "2024-05-24 13:20:00", user: "labtech1", role: "LABORATORY", action: "Result Upload Failed", details: "PDF file too large", status: "ERROR" },
    { id: 5, timestamp: "2024-05-24 12:10:44", user: "admin", role: "ADMIN", action: "Login", details: "Successful login from 192.168.1.55", status: "SUCCESS" }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(search.toLowerCase()) || 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || log.role === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">System Audit Logs</h1>
          <p className="text-slate-500 mt-1">Review system activity, payments, and security events.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 transition shadow-sm">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-4 bg-slate-50">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search logs by user, action, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>
          <div className="relative min-w-[150px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none bg-white"
            >
              <option value="All">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="DOCTOR">Doctor</option>
              <option value="LABORATORY">Laboratory</option>
            </select>
          </div>
          <div className="text-sm text-slate-500 font-medium ml-auto">
            Showing {filteredLogs.length} events
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>Timestamp</th>
                <th className={tableHeadClass}>User</th>
                <th className={tableHeadClass}>Role</th>
                <th className={tableHeadClass}>Action</th>
                <th className={tableHeadClass}>Details</th>
                <th className={tableHeadClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <TableEmptyRow colSpan={6} message="No logs found matching criteria." />
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className={tableRowClass}>
                  <td className={tableCellClass}>{log.timestamp}</td>
                  <td className={tableCellClass}>{log.user}</td>
                  <td className={tableCellClass}>{log.role}</td>
                  <td className={tableCellClass}>{log.action}</td>
                  <td className={tableCellClass}>{log.details}</td>
                  <td className={tableCellClass}>
                    <TableStatusBadge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
