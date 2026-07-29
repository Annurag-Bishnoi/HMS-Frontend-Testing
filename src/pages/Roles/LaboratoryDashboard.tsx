import { useEffect, useState, useMemo } from 'react';
import DocumentViewerModal from '../../components/common/DocumentViewerModal';
import {
  FlaskConical, Clock, CheckCircle, Activity, Search, RefreshCw,
  X, Play, User, Banknote, Ban, Send, Stethoscope, FileText
} from 'lucide-react';
import { getUser } from '../../utils/token';
import {
  getAllLabTests, getLabStats,
  submitLabResult, cancelLabTest,
  markLabPaymentPaid, markSampleCollected
} from '../../api/labService';
import DataTable, { tableHeadClass, tableRowClass, tableCellClass } from '../../components/common/DataTable';

/* ─── Status config ─── */
const STATUS: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  PENDING:     { label: 'Pending',     bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   border: 'border-amber-200'  },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400',    border: 'border-blue-200'   },
  COMPLETED:   { label: 'Completed',   bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', border: 'border-emerald-200'},
  CANCELLED:   { label: 'Cancelled',   bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400',     border: 'border-red-200'    },
};
const badge = (s?: string) => STATUS[s?.toUpperCase() ?? 'PENDING'] ?? STATUS.PENDING;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

/* "?"?"? Test Detail Modal "?"?"? */
export function TestDetailModal({ test, onClose }: { test: any; onClose: () => void }) {
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const cfg = badge(test.status);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-slate-900 px-6 py-5 text-white flex justify-between items-start">
          <div>
            <p className="text-slate-400 text-xs">Test #{test.testId}</p>
            <h3 className="text-lg font-bold mt-0.5">{test.testName}</h3>
            <p className="text-slate-400 text-sm">Code: {test.testCode}</p>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><User size={10}/> Patient</p>
              <p className="font-bold text-slate-800">{test.patientName}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Stethoscope size={10}/> Ordered By</p>
              <p className="font-bold text-slate-800">Dr. {test.doctorName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-full ${cfg.bg} ${cfg.text}`}>
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`}/> {cfg.label}
            </span>
            <span className="text-xs text-slate-400">
              Ordered: {test.recordedAt ? new Date(test.recordedAt).toLocaleString('en-IN') : '?"'}
            </span>
          </div>
          {test.resultValue ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Result</p>
              <p className="font-bold text-slate-800 text-xl">{test.resultValue}</p>
              {test.remarks && <p className="text-sm text-slate-700 mt-2 italic">{test.remarks}</p>}
              
              {test.documentUrl && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <button onClick={() => setDocUrl(test.documentUrl)}
                     className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition">
                    <FileText size={16} /> View Attached Document
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-slate-500 font-semibold text-sm">Result not yet submitted</p>
            </div>
          )}
        </div>
        
        {docUrl && <DocumentViewerModal url={docUrl} onClose={() => setDocUrl(null)} />}
      </div>
    </div>
  );
}

/* ── Result Upload Modal ── */
export function ResultModal({ test, onClose, onSubmit }: { test: any; onClose: () => void; onSubmit: (val: string, remarks: string, file?: File) => void }) {
  const [resultValue, setResultValue] = useState('');
  const [remarks, setRemarks] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!resultValue.trim()) return;
    setSubmitting(true);
    await onSubmit(resultValue.trim(), remarks.trim(), file || undefined);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-5 flex justify-between items-start">
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Submit Result</p>
            <h3 className="text-lg font-bold mt-0.5 text-slate-800">{test.testName}</h3>
            <p className="text-slate-500 text-sm mt-0.5">Patient: {test.patientName} · Dr. {test.doctorName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-full transition">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Result Value <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={resultValue}
              onChange={e => setResultValue(e.target.value)}
              placeholder="e.g., 14.2 g/dL"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Clinical Remarks (Optional)</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Add any interpretation or notes..."
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Upload Document (optional)</label>
            <input 
              type="file" 
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} disabled={submitting} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !resultValue.trim()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Submit Result'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function LaboratoryDashboard() {
  const [tests, setTests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ACTIVE');
  
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [resultModal, setResultModal] = useState<any>(null);
  const [detailModal, setDetailModal] = useState<any>(null);

  const user = getUser();

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const [all, s] = await Promise.all([getAllLabTests(), getLabStats()]);
      setTests(all);
      setStats(s);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleMarkPayment = async (testId: number) => {
    setActionLoading(testId);
    try {
      await markLabPaymentPaid(testId);
      setTests(prev => prev.map(t => t.testId === testId ? { ...t, paymentStatus: 'PAID' } : t));
    } catch (e) { console.error(e); alert('Failed to mark payment.'); }
    finally { setActionLoading(null); }
  };

  const handleSampleCollected = async (testId: number) => {
    setActionLoading(testId);
    try {
      const result = await markSampleCollected(testId);
      setTests(prev => prev.map(t => t.testId === testId ? result : t));
    } catch (e) { console.error(e); alert('Failed to mark sample collected.'); }
    finally { setActionLoading(null); }
  };

  const handleSubmitResult = async (testId: number, val: string, remarks: string, file?: File) => {
    try {
      const result = await submitLabResult(testId, val, remarks, file);
      setTests(prev => prev.map(t => t.testId === testId ? result : t));
      setStats((s: any) => ({ ...s, inProgress: s.inProgress - 1, completed: s.completed + 1 }));
    } catch (e) { console.error(e); }
  };

  const handleCancel = async (testId: number) => {
    if (!confirm('Are you sure you want to cancel this test? This will reject the request and notify the doctor.')) return;
    setActionLoading(testId);
    try {
      const result = await cancelLabTest(testId);
      setTests(prev => prev.map(t => t.testId === testId ? result : t));
      setStats((s: any) => ({ ...s, pending: s.pending - 1, cancelled: s.cancelled + 1 }));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  /* ── Filtered and Sorted list ── */
  const filtered = useMemo(() => {
    let list = [...tests];
    if (filterStatus === 'ACTIVE') {
      list = list.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS');
    } else if (filterStatus !== 'ALL') {
      list = list.filter(t => t.status === filterStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.patientName?.toLowerCase().includes(q) ||
        t.testName?.toLowerCase().includes(q) ||
        t.testCode?.toLowerCase().includes(q) ||
        t.doctorName?.toLowerCase().includes(q)
      );
    }
    // Sort by recordedAt ascending (FIFO)
    list.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
    return list;
  }, [tests, filterStatus, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <FlaskConical className="animate-bounce text-violet-600" size={36} />
          <p className="text-slate-500 text-sm font-medium">Loading laboratory workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto bg-slate-50">
      {/* ── Profile Header ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
          <User size={36} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-slate-500 text-sm font-medium">{greeting()},</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{user?.name || 'Lab Technician'}</h1>
          <p className="text-slate-600 font-medium mt-1">Laboratory Department</p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-slate-800 font-bold text-lg">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-slate-500 text-sm flex items-center justify-center md:justify-end gap-1 mt-1">
            <Clock size={14} /> {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tests',  value: stats.total || 0,       icon: FlaskConical, bg: 'bg-slate-100', text: 'text-slate-600' },
          { label: 'Pending',      value: stats.pending || 0,     icon: Clock,        bg: 'bg-slate-100', text: 'text-slate-600' },
          { label: 'In Progress',  value: stats.inProgress || 0,  icon: Activity,     bg: 'bg-slate-100', text: 'text-slate-600' },
          { label: 'Completed',    value: stats.completed || 0,   icon: CheckCircle,  bg: 'bg-slate-100', text: 'text-slate-600' },
        ].map(s => (
          <div key={s.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg}`}><s.icon className={s.text} size={22} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium leading-tight">{s.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main List ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        {/* Table Header & Search */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 shrink-0">
            <FlaskConical className="text-slate-600" size={20} />
            Lab Test Queue
            {filterStatus !== 'ALL' && filterStatus !== 'ACTIVE' && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge(filterStatus).bg} ${badge(filterStatus).text}`}>
                {badge(filterStatus).label}
              </span>
            )}
            {filterStatus === 'ACTIVE' && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-white">
                Active Queue
              </span>
            )}
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient, test, doctor…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 bg-slate-50" />
            </div>
            <button onClick={init} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 border border-slate-200 transition">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-5 pt-3 flex gap-1.5 flex-wrap">
          {['ACTIVE', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => {
            let count = 0;
            if (s === 'ACTIVE') count = tests.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
            else count = tests.filter(t => t.status === s).length;

            return (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                  filterStatus === s
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}>
                {s === 'ACTIVE' ? 'Active Work' : s.replace('_', ' ')} ({count})
              </button>
            );
          })}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto mt-3 max-h-[600px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CheckCircle size={48} className="mx-auto mb-4 opacity-40 text-emerald-500" />
              <p className="font-medium">No tests found in queue.</p>
            </div>
          ) : (
            <DataTable>
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className={tableHeadClass}>Patient</th>
                  <th className={tableHeadClass}>Test Details</th>
                  <th className={tableHeadClass}>Status</th>
                  <th className={tableHeadClass}>Action / Progress</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const cfg = badge(t.status);
                  const price = 150 + ((t.testName || '').length * 5); // Mock price calculation
                  const isProcessing = actionLoading === t.testId;

                  return (
                    <tr key={t.testId} className={tableRowClass}>
                      <td className={tableCellClass}>
                        <p className="font-bold text-slate-800">{t.patientName}</p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <User size={12}/> Dr. {t.doctorName}
                        </p>
                      </td>
                      <td className={tableCellClass}>
                        <p className="font-bold text-slate-700">{t.testName}</p>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">{t.testCode}</p>
                        <p className="text-xs text-slate-500 mt-1">Ordered: {new Date(t.recordedAt).toLocaleString()}</p>
                      </td>
                      <td className={tableCellClass}>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>{cfg.label}
                        </span>
                        {t.status !== 'CANCELLED' && t.status !== 'COMPLETED' && (
                          <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Payment: <span className={t.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}>{t.paymentStatus || 'PENDING'}</span>
                          </div>
                        )}
                      </td>
                      <td className={tableCellClass}>
                        <div className="flex flex-col gap-2 items-start">
                          
                          {/* Payment Step */}
                          {t.status === 'PENDING' && t.paymentStatus !== 'PAID' && (
                            <button
                              onClick={() => handleMarkPayment(t.testId)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
                            >
                              <Banknote size={14} /> Verify Payment (₹{price})
                            </button>
                          )}

                          {/* Sample Collection Step */}
                          {t.status === 'PENDING' && t.paymentStatus === 'PAID' && (
                            <button
                              onClick={() => handleSampleCollected(t.testId)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50 shadow-sm shadow-indigo-200"
                            >
                              <Play size={14} /> Collect Sample
                            </button>
                          )}

                          {/* Result Upload Step */}
                          {t.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => setResultModal(t)}
                              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-emerald-200"
                            >
                              <Send size={14} /> Upload Result
                            </button>
                          )}

                          {/* Completed or Cancelled State */}
                          {t.status === 'COMPLETED' && (
                            <div className="flex flex-col gap-2 items-start">
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle size={14}/> Result Uploaded</span>
                              <button 
                                onClick={() => setDetailModal(t)}
                                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase flex items-center gap-1 transition bg-slate-100 px-2 py-1 rounded"
                              >
                                View Details
                              </button>
                            </div>
                          )}
                          {t.status === 'CANCELLED' && (
                            <span className="text-xs font-bold text-red-500 flex items-center gap-1"><Ban size={14}/> Rejected</span>
                          )}

                          {/* Global Reject Button if not completed/cancelled */}
                          {t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && (
                            <button 
                              onClick={() => handleCancel(t.testId)}
                              disabled={isProcessing}
                              className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase mt-1 flex items-center gap-1 transition"
                            >
                              <Ban size={10} /> Reject Lab Test
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
          <span>Showing {filtered.length} of {tests.length} tests</span>
        </div>
      </div>

      {/* Modals */}
      {resultModal && (
        <ResultModal
          test={resultModal}
          onClose={() => setResultModal(null)}
          onSubmit={(val, remarks, file) => handleSubmitResult(resultModal.testId, val, remarks, file)}
        />
      )}
      {detailModal && (
        <TestDetailModal
          test={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}

    </div>
  );
}

