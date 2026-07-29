import { useEffect, useState, useMemo } from 'react';
import {
  FlaskConical, Clock, Play, Send, Ban, RefreshCw, Search, FileText
} from 'lucide-react';
import {
  getAllLabTests, startLabTest, submitLabResult, cancelLabTest
} from '../../../api/labService';
import { ResultModal, TestDetailModal } from '../LaboratoryDashboard';
import DataTable, { tableHeadClass, tableRowClass, tableCellClass } from '../../../components/common/DataTable';


/* ── Status config ── */
const STATUS: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  PENDING:     { label: 'Pending',     bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   border: 'border-amber-200'  },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400',    border: 'border-blue-200'   },
};
const badge = (s?: string) => STATUS[s?.toUpperCase() ?? 'PENDING'] ?? STATUS.PENDING;

export default function LabRequestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [resultModal, setResultModal] = useState<any>(null);
  const [detailModal, setDetailModal] = useState<any>(null);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const all = await getAllLabTests();
      // Only keep Pending and In Progress for Requests Page
      setTests(all.filter((t: any) => t.status === 'PENDING' || t.status === 'IN_PROGRESS'));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleStart = async (testId: number) => {
    setActionLoading(testId);
    try {
      const updated = await startLabTest(testId);
      setTests(prev => prev.map(t => t.testId === testId ? updated : t));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handleSubmitResult = async (testId: number, val: string, remarks: string, file?: File) => {
    try {
      await submitLabResult(testId, val, remarks, file);
      // Remove from requests page as it is now COMPLETED
      setTests(prev => prev.filter(t => t.testId !== testId));
    } catch (e) { console.error(e); }
  };

  const handleCancel = async (testId: number) => {
    if (!confirm('Cancel this test?')) return;
    setActionLoading(testId);
    try {
      await cancelLabTest(testId);
      // Remove from requests page as it is now CANCELLED
      setTests(prev => prev.filter(t => t.testId !== testId));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  /* ── Filtered and Sorted list ── */
  const filtered = useMemo(() => {
    let list = [...tests];
    if (filterStatus !== 'ALL') list = list.filter(t => t.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.patientName?.toLowerCase().includes(q) ||
        t.testName?.toLowerCase().includes(q) ||
        t.testCode?.toLowerCase().includes(q) ||
        t.doctorName?.toLowerCase().includes(q)
      );
    }
    // Group/Sort by patient Name for easier handling of multiple tests
    list.sort((a, b) => (a.patientName || '').localeCompare(b.patientName || ''));
    return list;
  }, [tests, filterStatus, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <FlaskConical className="animate-bounce text-slate-400" size={36} />
          <p className="text-slate-500 text-sm font-medium">Loading requests…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto bg-slate-50">
      {/* ── Header ── */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Test Requests</h1>
          <p className="text-slate-500 text-sm mt-1">Manage pending and in-progress lab tests.</p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 shrink-0">
            <FlaskConical className="text-slate-600" size={20} />
            Incoming Requests
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 bg-slate-50" />
            </div>
            <button onClick={init} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 border border-slate-200 transition">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="px-5 pt-3 flex gap-1.5 flex-wrap">
          {['ALL', 'PENDING', 'IN_PROGRESS'].map(s => {
            const count = s === 'ALL' ? tests.length : tests.filter(t => t.status === s).length;
            return (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                  filterStatus === s
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}>
                {s === 'ALL' ? 'All' : s.replace('_', ' ')} ({count})
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-3 max-h-[500px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FlaskConical size={48} className="mx-auto mb-4 opacity-40" />
              <p className="font-medium">No test requests found.</p>
            </div>
          ) : (
            <DataTable>
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className={tableHeadClass}>Test</th>
                  <th className={tableHeadClass}>Patient</th>
                  <th className={tableHeadClass}>Doctor</th>
                  <th className={tableHeadClass}>Status</th>
                  <th className={tableHeadClass}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const cfg = badge(t.status);
                  const isLoading = actionLoading === t.testId;
                  return (
                    <tr key={t.testId} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{t.testName}</p>
                            <p className="text-[10px] font-mono text-slate-400">{t.testCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className={tableCellClass}>
                        <p className="font-medium text-slate-700 text-xs">{t.patientName}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">Dr. {t.doctorName}</td>
                      <td className={tableCellClass}>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>{cfg.label}
                        </span>
                      </td>
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setDetailModal(t)} title="View details"
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition text-xs font-semibold">
                            View
                          </button>

                          {t.status === 'PENDING' && (
                            <button
                              onClick={() => handleStart(t.testId)}
                              disabled={isLoading}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition disabled:opacity-60 text-xs font-semibold flex items-center gap-1"
                            >
                              {isLoading ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                              Start
                            </button>
                          )}

                          {(t.status === 'PENDING' || t.status === 'IN_PROGRESS') && (
                            <button
                              onClick={() => setResultModal(t)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition text-xs font-semibold flex items-center gap-1"
                            >
                              <Send size={12} /> Submit
                            </button>
                          )}

                          {(t.status === 'PENDING' || t.status === 'IN_PROGRESS') && (
                            <button
                              onClick={() => handleCancel(t.testId)}
                              disabled={isLoading}
                              className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 transition disabled:opacity-60 text-xs font-semibold"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          )}
        </div>
        <div className="px-5 py-3 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
          <span>Showing {filtered.length} of {tests.length} requests</span>
        </div>
      </div>

      {/* ── Modals ── */}
      {resultModal && (
        <ResultModal
          test={resultModal}
          onClose={() => setResultModal(null)}
          onSubmit={(val, remarks, file) => handleSubmitResult(resultModal.testId, val, remarks, file)}
        />
      )}
      {detailModal && <TestDetailModal test={detailModal} onClose={() => setDetailModal(null)} />}
    </div>
  );
}
