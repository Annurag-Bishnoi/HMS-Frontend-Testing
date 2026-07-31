import { useState, useEffect } from "react";
import { Search, Activity, BedDouble, Filter, XCircle, User, CheckCircle, Clock } from "lucide-react";
import { getBeds, getAdmissionsByStatus } from "../../../api/ipdService";
import { tableHeadClass, tableRowClass, tableCellClass } from "../../../components/common/DataTable";
import { TableEmptyRow } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

export default function ManageBeds() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [beds, setBeds] = useState<any[]>([]);
  const [activeAdmissions, setActiveAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOccupiedBed, setSelectedOccupiedBed] = useState<any | null>(null);

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const [bedsData, admissionsData] = await Promise.all([
        getBeds(),
        getAdmissionsByStatus('ADMITTED')
      ]);
      setBeds(bedsData);
      setActiveAdmissions(admissionsData);
    } catch (err) {
      console.error("Failed to fetch beds:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = 
      bed.bedNumber?.toLowerCase().includes(search.toLowerCase()) || 
      bed.wardName?.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "All" || bed.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBeds.length / itemsPerPage);
  const currentBeds = filteredBeds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const getStatusBadge = (bed: any) => {
    switch (bed.status) {
      case 'AVAILABLE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-200">AVAILABLE</span>;
      case 'OCCUPIED':
        return (
          <span 
            onClick={() => handleOccupiedBedClick(bed)}
            className="px-2.5 py-1 rounded-full text-xs font-bold border bg-blue-50 text-blue-600 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
          >
            OCCUPIED
          </span>
        );
      case 'MAINTENANCE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-600 border-amber-200">MAINTENANCE</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">{bed.status}</span>;
    }
  };

  const handleOccupiedBedClick = (bed: any) => {
    const adm = activeAdmissions.find(a => a.bedNumber === bed.bedNumber && a.wardName === bed.wardName);
    if (adm) {
      setSelectedOccupiedBed({ bed, admission: adm });
    } else {
      showToast("No active admission details found for this occupied bed.", "info");
    }
  };

  // Stats calculation
  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => b.status === 'AVAILABLE').length;
  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED').length;
  const maintenanceBeds = beds.filter(b => b.status === 'MAINTENANCE').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            Live Bed Tracking
          </h1>
          <p className="text-slate-500 mt-1">Real-time status of all hospital beds across all wards.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-emerald-200 shadow-sm px-4 py-2 rounded-xl text-center">
            <div className="text-xl font-bold text-emerald-600">{availableBeds}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available</div>
          </div>
          <div className="bg-white border border-blue-200 shadow-sm px-4 py-2 rounded-xl text-center">
            <div className="text-xl font-bold text-blue-600">{occupiedBeds}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Occupied</div>
          </div>
          <div className="bg-white border border-amber-200 shadow-sm px-4 py-2 rounded-xl text-center">
            <div className="text-xl font-bold text-amber-600">{maintenanceBeds}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maintenance</div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex items-start gap-3">
        <Activity className="text-indigo-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-indigo-800">System Controlled Infrastructure</h4>
          <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
            The ward and bed architecture is fixed by the system configuration. This dashboard provides real-time visibility into bed utilization for administrators. For structural changes, contact IT support to run database initialization scripts.
          </p>
        </div>
      </div>

      {/* Live Bed Occupancy Widget */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-8">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <BedDouble className="text-indigo-600" /> Live Bed Map
              </h2>
              <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></div> Available</span>
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div> Occupied</span>
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-200"></div> Maintenance</span>
              </div>
          </div>
          
          {loading ? (
              <div className="py-8 text-center text-slate-500">Loading live beds...</div>
          ) : beds.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No beds configured in the system.</div>
          ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
                  {beds.map((bed, idx) => {
                      let bgClass = "bg-slate-50 border-slate-200 text-slate-400";
                      let iconClass = "text-slate-300";
                      let clickable = false;
                      
                      if (bed.status === 'AVAILABLE') {
                          bgClass = "bg-emerald-50 border-emerald-100 text-emerald-700 hover:border-emerald-300 hover:shadow-sm";
                          iconClass = "text-emerald-500";
                      } else if (bed.status === 'OCCUPIED') {
                          bgClass = "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 cursor-pointer shadow-sm shadow-blue-100";
                          iconClass = "text-blue-500";
                          clickable = true;
                      } else if (bed.status === 'MAINTENANCE') {
                          bgClass = "bg-amber-50 border-amber-200 text-amber-700";
                          iconClass = "text-amber-500";
                      }

                      return (
                          <div 
                              key={idx} 
                              onClick={() => clickable ? handleOccupiedBedClick(bed) : null}
                              className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${bgClass}`}
                              title={`${bed.wardName} - ${bed.bedNumber} (${bed.status})`}
                          >
                              <BedDouble size={20} className={`mb-1 ${iconClass}`} />
                              <span className="text-xs font-bold">{bed.bedNumber}</span>
                          </div>
                      )
                  })}
              </div>
          )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-4 bg-slate-50">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by bed number or ward name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <div className="text-sm text-slate-500 font-medium ml-auto">
            Showing {filteredBeds.length} of {totalBeds} beds
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>Bed Details</th>
                <th className={tableHeadClass}>Ward Location</th>
                <th className={tableHeadClass}>Bed Type</th>
                <th className={tableHeadClass}>Current Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-slate-500 font-medium">Loading real-time bed data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredBeds.length === 0 ? (
                <TableEmptyRow colSpan={4} message="No beds found matching your filters." />
              ) : (
                currentBeds.map((bed) => (
                  <tr 
                    key={bed.bedId} 
                    className={`${tableRowClass} transition-colors ${bed.status === 'OCCUPIED' ? 'cursor-pointer hover:bg-blue-50' : 'hover:bg-slate-50'}`}
                    onClick={() => bed.status === 'OCCUPIED' ? handleOccupiedBedClick(bed) : null}
                  >
                    <td className={tableCellClass}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 border border-slate-200">
                          <BedDouble size={16} />
                        </div>
                        <span className="font-bold text-slate-800 text-lg">{bed.bedNumber}</span>
                      </div>
                    </td>
                    <td className={`${tableCellClass} font-medium text-slate-700`}>{bed.wardName || '—'}</td>
                    <td className={tableCellClass}>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold border border-slate-200">
                        {bed.bedType || 'Standard'}
                      </span>
                    </td>
                    <td className={tableCellClass}>
                      {getStatusBadge(bed)}
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

      {/* Bed Details Modal */}
      {selectedOccupiedBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <BedDouble className="text-indigo-600" size={20} />
                Bed {selectedOccupiedBed.bed.bedNumber} Details
              </h3>
              <button onClick={() => setSelectedOccupiedBed(null)} className="p-1 hover:bg-slate-200 rounded-full">
                <XCircle size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Patient Name</p>
                  <p className="font-bold text-slate-800 text-lg">{selectedOccupiedBed.admission.patientName}</p>
                  <p className="text-xs text-slate-500 mt-1">Doctor: Dr. {selectedOccupiedBed.admission.doctorName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase mb-1 flex items-center gap-1">
                    <CheckCircle size={12} /> Advance Paid
                  </p>
                  <p className="font-bold text-emerald-900">Yes (1 Day Room)</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase mb-1 flex items-center gap-1">
                    <Clock size={12} /> Days Admitted
                  </p>
                  <p className="font-bold text-blue-900">
                    {Math.max(1, Math.ceil((Date.now() - new Date(selectedOccupiedBed.admission.admissionDate).getTime()) / (1000 * 3600 * 24)))} Day(s)
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Admitted On</p>
                <p className="font-semibold text-slate-700">{new Date(selectedOccupiedBed.admission.admissionDate).toLocaleString()}</p>
                <p className="text-xs text-slate-500 font-bold uppercase mt-3 mb-1">Diagnosis</p>
                <p className="font-medium text-slate-700">{selectedOccupiedBed.admission.admissionDiagnosis}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
