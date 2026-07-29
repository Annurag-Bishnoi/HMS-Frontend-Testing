import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { tableHeadClass, tableHeadActionsClass, tableRowClass, tableCellClass } from "../../../components/common/DataTable";
import TableStatusBadge from "../../../components/common/TableStatusBadge";
import { TableEditButton, TableDeleteButton, TableActionCell } from "../../../components/common/TableActions";

export default function ManageBeds() {
  const [search, setSearch] = useState("");
  const [beds] = useState([
    { id: 1, number: "101-A", ward: "General Ward", type: "Standard", status: "Occupied" },
    { id: 2, number: "101-B", ward: "General Ward", type: "Standard", status: "Available" },
    { id: 3, number: "201", ward: "ICU", type: "Intensive", status: "Available" },
    { id: 4, number: "301", ward: "Maternity", type: "Private", status: "Maintenance" }
  ]);

  const filteredBeds = beds.filter(bed => 
    bed.number.toLowerCase().includes(search.toLowerCase()) || 
    bed.ward.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Bed Management</h1>
          <p className="text-slate-500 mt-1">Configure hospital wards, rooms, and bed capacity.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 transition shadow-sm">
          <Plus size={20} /> Add Bed
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by bed number or ward..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total: {filteredBeds.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>Bed Number</th>
                <th className={tableHeadClass}>Ward</th>
                <th className={tableHeadClass}>Type</th>
                <th className={tableHeadClass}>Status</th>
                <th className={tableHeadActionsClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeds.map((bed) => (
                <tr key={bed.id} className={tableRowClass}>
                  <td className={`${tableCellClass} font-semibold`}>{bed.number}</td>
                  <td className={tableCellClass}>{bed.ward}</td>
                  <td className={tableCellClass}>{bed.type}</td>
                  <td className={tableCellClass}>
                    <TableStatusBadge status={bed.status} />
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
