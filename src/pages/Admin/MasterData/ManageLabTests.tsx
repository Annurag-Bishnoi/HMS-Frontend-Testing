import { useState, useEffect, useMemo } from "react";
import { Search, Database, FlaskConical, AlertCircle, Info, Plus, Edit2, CheckCircle, X } from "lucide-react";
import { searchCiel } from "../../../api/visitService";
import { getApprovedLabTests } from "../../../api/labService";
import { tableHeadClass, tableRowClass, tableCellClass } from "../../../components/common/DataTable";
import { TableEmptyRow } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import TableStatusBadge from "../../../components/common/TableStatusBadge";
import { TableCustomActionButton } from "../../../components/common/TableActions";
import AddLabTestModal from "../../../components/admin/lab/AddLabTestModal";
import EditLabTestModal from "../../../components/admin/lab/EditLabTestModal";

export default function ManageLabTests() {
  const [search, setSearch] = useState("");
  const [localTests, setLocalTests] = useState<any[]>([]);
  const [cielResults, setCielResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [actionLoading, setActionLoading] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCielTest, setSelectedCielTest] = useState<any | null>(null);
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLocalTest, setSelectedLocalTest] = useState<any | null>(null);

  const fetchLocal = async () => {
    try {
      const data = await getApprovedLabTests();
      setLocalTests(data || []);
    } catch (err) {
      console.error("Failed to load approved lab tests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocal();
  }, []);

  const performSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setCielResults([]);
      setHasSearched(false);
      return;
    }
    try {
      setLoading(true);
      setHasSearched(true);
      const data = await searchCiel(query, "test");
      setCielResults(data || []);
    } catch (err) {
      console.error("Failed to fetch CIEL tests:", err);
      setCielResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setCielResults([]);
      setHasSearched(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch(search);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Combine CIEL search results with Local approved database records
  const displayedTests = useMemo(() => {
    if (!hasSearched) return localTests;

    return cielResults.map(cielTest => {
      const matched = localTests.find(m => m.cielConceptId === cielTest.cielId);
      if (matched) {
        return matched; // Use our local approved record
      }
      // Return a virtual record
      return {
        id: null,
        cielConceptId: cielTest.cielId,
        testName: cielTest.conceptName,
        conceptClass: cielTest.conceptClass,
        unitPrice: 0,
        active: false,
        isVirtual: true
      };
    });
  }, [localTests, cielResults, hasSearched]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(displayedTests.length / itemsPerPage) || 1;
  const currentTests = displayedTests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, hasSearched]);

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Lab Test Master (CIEL)</h1>
          <p className="text-slate-500 mt-1">Manage approved hospital lab tests and their billing prices.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
          <Database size={16} /> CIEL Integration Active
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
        <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-blue-800">Lab Master Integration</h4>
          <p className="text-sm text-blue-700 mt-1 leading-relaxed">
            Search the CIEL dictionary to approve standardized lab tests into the hospital's local database and set their <strong>Base Billing Price</strong>. When doctors prescribe an approved test, the set price will automatically apply to the patient's invoice.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        {/* Toast Notification */}
        {successMessage && (
          <div className="absolute top-4 right-4 z-10 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-100" />
            <span className="font-semibold text-sm">{successMessage}</span>
          </div>
        )}

        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Search CIEL Dictionary</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by test name (e.g. 'blood', 'glucose')... Press Enter to search"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm text-slate-700"
              />
              {search && (
                <button 
                  onClick={() => { setSearch(""); setCielResults([]); setHasSearched(false); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button 
              onClick={() => performSearch(search)}
              disabled={loading || search.length < 2}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>CIEL ID</th>
                <th className={tableHeadClass}>Test Name</th>
                <th className={tableHeadClass}>Base Price</th>
                <th className={tableHeadClass}>System Status</th>
                <th className={`${tableHeadClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading && displayedTests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-slate-500 font-medium">Loading Lab Tests...</p>
                    </div>
                  </td>
                </tr>
              ) : displayedTests.length === 0 ? (
                <TableEmptyRow colSpan={5} message={hasSearched ? "No lab tests found matching your search." : "No approved lab tests found in the local database."} />
              ) : (
                currentTests.map((test) => (
                  <tr key={test.cielConceptId} className={`${tableRowClass} hover:bg-slate-50 transition-colors`}>
                    <td className={`${tableCellClass} font-mono font-semibold text-slate-700`}>{test.cielConceptId}</td>
                    <td className={tableCellClass}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 border border-blue-100">
                          <FlaskConical size={16} />
                        </div>
                        <span className="font-medium text-slate-800">{test.testName}</span>
                      </div>
                    </td>
                    <td className={tableCellClass}>
                      {test.isVirtual ? (
                        <span className="text-slate-400 italic text-sm">Not Configured</span>
                      ) : (
                        <span className="font-bold text-slate-800">₹{Number(test.unitPrice || 0).toFixed(2)}</span>
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {test.isVirtual ? (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-bold border border-slate-200">
                          New Test (Not Approved)
                        </span>
                      ) : (
                        <TableStatusBadge 
                          status={test.active ? 'active' : 'inactive'} 
                          label={test.active ? 'Approved & Active' : 'Suspended'} 
                        />
                      )}
                    </td>
                    <td className={`${tableCellClass} text-right`}>
                      <div className="flex items-center justify-end gap-2">
                        {test.isVirtual ? (
                          <button
                            onClick={() => {
                              setSelectedCielTest({ cielId: test.cielConceptId, conceptName: test.testName, conceptClass: test.conceptClass });
                              setIsAddOpen(true);
                            }}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100 bg-white shadow-sm flex items-center gap-1"
                            title="Approve & Set Price"
                          >
                            <Plus size={16} />
                            <span className="text-xs font-bold px-1">Approve</span>
                          </button>
                        ) : (
                          <TableCustomActionButton
                            icon={Edit2}
                            onClick={() => {
                              setSelectedLocalTest(test);
                              setIsEditOpen(true);
                            }}
                            title="Edit Price / Status"
                            variant="indigo"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
          onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        />
      )}

      {/* Modals */}
      <AddLabTestModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        test={selectedCielTest}
        onSuccess={() => {
          showSuccess("Lab test approved successfully!");
          fetchLocal();
        }}
      />
      <EditLabTestModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        test={selectedLocalTest}
        onSuccess={() => {
          showSuccess("Lab test updated successfully!");
          fetchLocal();
        }}
      />
    </div>
  );
}
