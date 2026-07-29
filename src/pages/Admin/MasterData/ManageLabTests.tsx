import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { getAllLabTests } from "../../../api/labService";
import { tableHeadClass, tableHeadActionsClass, tableRowClass, tableCellClass } from "../../../components/common/DataTable";
import { TableEmptyRow } from "../../../components/common/DataTable";
import TableStatusBadge from "../../../components/common/TableStatusBadge";
import { TableEditButton, TableDeleteButton, TableActionCell } from "../../../components/common/TableActions";

export default function ManageLabTests() {
  const [search, setSearch] = useState("");
  const [labTests, setLabTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data = await getAllLabTests();
      const uniqueTests = Array.from(new Map(data.map((t: any) => [t.testCode, t])).values());
      setLabTests(uniqueTests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = labTests.filter(test => 
    test.testName?.toLowerCase().includes(search.toLowerCase()) || 
    test.testCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Lab Test Definitions</h1>
          <p className="text-slate-500 mt-1">Configure available laboratory tests and prices.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 transition shadow-sm">
          <Plus size={20} /> Add Lab Test
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by test name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total: {filteredTests.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>Test Code</th>
                <th className={tableHeadClass}>Test Name</th>
                <th className={tableHeadClass}>Standard Price</th>
                <th className={tableHeadClass}>Status</th>
                <th className={tableHeadActionsClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">Loading tests...</td>
                </tr>
              ) : filteredTests.length === 0 ? (
                <TableEmptyRow colSpan={5} message="No lab tests found." />
              ) : filteredTests.map((test, i) => (
                <tr key={i} className={tableRowClass}>
                  <td className={`${tableCellClass} font-semibold`}>{test.testCode}</td>
                  <td className={tableCellClass}>{test.testName}</td>
                  <td className={tableCellClass}>₹{test.price || '500'}</td>
                  <td className={tableCellClass}>
                    <TableStatusBadge status="Active" variant="green" />
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
