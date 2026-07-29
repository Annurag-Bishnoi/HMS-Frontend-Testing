import { useEffect, useState, useMemo } from 'react';
import {
  FlaskConical, RefreshCw, Search, FileText
} from 'lucide-react';
import {
  getAllLabTests
} from '../../../api/labService';
import { TestDetailModal } from '../LaboratoryDashboard';
import DocumentViewerModal from '../../../components/common/DocumentViewerModal';

/* ── Status config ── */
const STATUS: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  COMPLETED:   { label: 'Completed',   bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', border: 'border-emerald-200'},
};
const badge = (s?: string) => STATUS[s?.toUpperCase() ?? 'COMPLETED'] ?? STATUS.COMPLETED;

export default function LabResultsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detailModal, setDetailModal] = useState<any>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const all = await getAllLabTests();
      // Only keep Completed for Results Page
      setTests(all.filter((t: any) => t.status === 'COMPLETED'));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  /* ── Filtered and Sorted list ── */
  const filtered = useMemo(() => {
    let list = [...tests];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.patientName?.toLowerCase().includes(q) ||
        t.testName?.toLowerCase().includes(q) ||
        t.testCode?.toLowerCase().includes(q) ||
        t.doctorName?.toLowerCase().includes(q)
      );
    }
    // Sort by most recently completed
    list.sort((a, b) => new Date(b.recordedAt || 0).getTime() - new Date(a.recordedAt || 0).getTime());
    return list;
  }, [tests, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <FlaskConical className="animate-bounce text-emerald-400" size={36} />
          <p className="text-slate-500 text-sm font-medium">Loading results…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto bg-slate-50">
      {/* ── Header ── */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lab Results</h1>
          <p className="text-slate-500 text-sm mt-1">Archive of completed tests and reports.</p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 shrink-0">
            <FileText className="text-slate-600" size={20} />
            Completed Results
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search results…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 bg-slate-50" />
            </div>
            <button onClick={init} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 border border-slate-200 transition">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FileText size={48} className="mx-auto mb-4 opacity-40" />
              <p className="font-medium">No completed results found.</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Test</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Patient</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Doctor</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Result</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const cfg = badge(t.status);
                  return (
                    <tr key={t.testId} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{t.testName}</p>
                            <p className="text-[10px] font-mono text-slate-400">{t.testCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700 text-xs">{t.patientName}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">Dr. {t.doctorName}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-emerald-700 font-bold text-sm">{t.resultValue}</p>
                          <span className={`inline-flex w-fit items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1 h-1 rounded-full ${cfg.dot}`}/>{cfg.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setDetailModal(t)} title="View details"
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition text-xs font-semibold">
                            Details
                          </button>
                          
                          {t.documentUrl && (
                            <button onClick={() => setDocUrl(t.documentUrl)}
                               className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition text-xs font-semibold flex items-center gap-1">
                              <FileText size={12} /> View Document
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-5 py-3 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
          <span>Showing {filtered.length} of {tests.length} results</span>
        </div>
      </div>

      {/* ── Modals ── */}
      {detailModal && <TestDetailModal test={detailModal} onClose={() => setDetailModal(null)} />}
      {docUrl && <DocumentViewerModal url={docUrl} onClose={() => setDocUrl(null)} />}
    </div>
  );
}
