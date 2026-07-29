import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { tableHeadClass, tableHeadActionsClass, tableRowClass, tableCellClass } from "../../../components/common/DataTable";
import TableStatusBadge from "../../../components/common/TableStatusBadge";
import { TableEditButton, TableDeleteButton, TableActionCell } from "../../../components/common/TableActions";

export default function ManageDepartments() {
  const [search, setSearch] = useState("");
  const [departments] = useState([
    { id: 1, name: "Cardiology", head: "Dr. Smith", status: "Active" },
    { id: 2, name: "Neurology", head: "Dr. Jones", status: "Active" },
    { id: 3, name: "Pediatrics", head: "Dr. Brown", status: "Active" },
    { id: 4, name: "Orthopedics", head: "Dr. Davis", status: "Active" }
  ]);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(search.toLowerCase()) ||
    dept.head.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Departments & Rooms</h1>
          <p className="text-slate-500 mt-1">Manage hospital departments and their configurations.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 transition shadow-sm">
          <Plus size={20} /> Add Department
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total: {filteredDepartments.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>ID</th>
                <th className={tableHeadClass}>Department Name</th>
                <th className={tableHeadClass}>Department Head</th>
                <th className={tableHeadClass}>Status</th>
                <th className={tableHeadActionsClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className={tableRowClass}>
                  <td className={`${tableCellClass} font-semibold`}>{dept.id}</td>
                  <td className={tableCellClass}>{dept.name}</td>
                  <td className={tableCellClass}>{dept.head}</td>
                  <td className={tableCellClass}>
                    <TableStatusBadge status={dept.status} variant="green" />
                  </td>
                  <TableActionCell>
                    <TableEditButton onClick={() => {}} title="Edit" />
                    <TableDeleteButton onClick={() => {}} title="Delete" />
                  </TableActionCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
