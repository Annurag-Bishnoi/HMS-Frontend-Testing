import { useEffect, useState, useMemo } from 'react';
import DocumentViewerModal from '../../components/common/DocumentViewerModal';
import {
  FlaskConical, Clock, CheckCircle, XCircle, Activity,
  Search, RefreshCw, X, AlertCircle,
  Play, Send, Ban, User, Stethoscope, Calendar,
  TrendingUp, Filter, BarChart2, FileText
} from 'lucide-react';
import { getUser } from '../../utils/token';
import {
  getAllLabTests, getLabStats,
  startLabTest, submitLabResult, cancelLabTest,
  markLabPaymentPaid, markSampleCollected
} from '../../api/labService';

/* ─── Status config ─── */
const STATUS: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  PENDING:     { label: 'Pending',     bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   border: 'border-amber-200'  },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400',    border: 'border-blue-200'   },
  COMPLETED:   { label: 'Completed',   bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', border: 'border-emerald-200'},
  CANCELLED:   { label: 'Cancelled',   bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400',     border: 'border-red-200'    },
};
const badge = (s?: string) => STATUS[s?.toUpperCase() ?? 'PENDING'] ?? STATUS.PENDING;

type WorkflowStep = 'payment' | 'collection' | 'result' | 'completed' | 'cancelled';

const getWorkflowStep = (t: any): WorkflowStep => {
  if (t.status === 'CANCELLED') return 'cancelled';
  if (t.status === 'COMPLETED') return 'completed';
  if (t.paymentStatus !== 'PAID') return 'payment';
  if (t.status === 'PENDING') return 'collection';
  if (t.status === 'IN_PROGRESS') return 'result';
  return 'completed';
};

const WORKFLOW_LABELS: Record<WorkflowStep, { step: number; label: string }> = {
  payment:    { step: 1, label: 'Payment' },
  collection: { step: 2, label: 'Sample Collection' },
  result:     { step: 3, label: 'Submit Result' },
  completed:  { step: 3, label: 'Complete' },
  cancelled:  { step: 0, label: 'Cancelled' },
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

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

        {/* Test info */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex gap-4 text-sm">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Test Code</p>
            <p className="font-mono font-bold text-slate-700">{test.testCode}</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Ordered</p>
            <p className="font-semibold text-slate-700">
              {test.recordedAt ? new Date(test.recordedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
            </p>
          </div>
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
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Clinical Remarks (Optional)</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Add any interpretation or notes..."
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm resize-none"
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
          <button onClick={onClose} disabled={submitting} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !resultValue.trim()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'Submit Result'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Test Detail Modal ─── */
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
              Ordered: {test.recordedAt ? new Date(test.recordedAt).toLocaleString('en-IN') : '—'}
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

/* ─── Main Dashboard ─── */
export default function LaboratoryDashboard() {
  const [tests, setTests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [resultModal, setResultModal] = useState<any>(null);
  const [detailModal, setDetailModal] = useState<any>(null);

  const user = getUser();
  const todayStr = new Date().toISOString().split('T')[0];

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

  const handleStart = async (testId: number) => {
    setActionLoading(testId);
    try {
      const updated = await startLabTest(testId);
      setTests(prev => prev.map(t => t.testId === testId ? updated : t));
      setStats((s: any) => ({ ...s, pending: s.pending - 1, inProgress: s.inProgress + 1 }));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handleSubmitResult = async (testId: number, val: string, remarks: string, file?: File) => {
    try {
      const updated = await submitLabResult(testId, val, remarks, file);
      setTests(prev => prev.map(t => t.testId === testId ? updated : t));
      setStats((s: any) => ({ ...s, inProgress: s.inProgress - 1, completed: s.completed + 1 }));
    } catch (e) { console.error(e); }
  };

  const handleCancel = async (testId: number) => {
    if (!confirm('Cancel this test?')) return;
    setActionLoading(testId);
    try {
      const updated = await cancelLabTest(testId);
      setTests(prev => prev.map(t => t.testId === testId ? updated : t));
      setStats((s: any) => ({ ...s, pending: s.pending - 1, cancelled: s.cancelled + 1 }));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handleMarkPayment = async (testId: number) => {
    setActionLoading(testId);
    try {
      const updated = await markLabPaymentPaid(testId);
      setTests(prev => prev.map(t => t.testId === testId ? { ...t, paymentStatus: 'PAID' } : t));
    } catch (e) { console.error(e); alert('Failed to mark payment.'); }
    finally { setActionLoading(null); }
  };

  const handleSampleCollected = async (testId: number) => {
    setActionLoading(testId);
    try {
      const updated = await markSampleCollected(testId);
      setTests(prev => prev.map(t => t.testId === testId ? updated : t));
    } catch (e) { console.error(e); alert('Failed to mark sample collected.'); }
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

  /* Today's tests */
  const todayTests = tests.filter(t =>
    t.recordedAt ? new Date(t.recordedAt).toISOString().split('T')[0] === todayStr : false
  );

  /* Most requested tests for insight */
  const testFreq: Record<string, number> = {};
  tests.forEach(t => { testFreq[t.testName] = (testFreq[t.testName] || 0) + 1; });
  const topTests = Object.entries(testFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = topTests[0]?.[1] || 1;

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
          { label: 'Total Tests',  value: stats.total || 0,       icon: FlaskConical, bg: 'bg-slate-100', text: 'text-slate-600', filter: 'ALL' },
          { label: 'Pending',      value: stats.pending || 0,     icon: Clock,        bg: 'bg-slate-100', text: 'text-slate-600', filter: 'PENDING' },
          { label: 'In Progress',  value: stats.inProgress || 0,  icon: Activity,     bg: 'bg-slate-100', text: 'text-slate-600', filter: 'IN_PROGRESS' },
          { label: 'Completed',    value: stats.completed || 0,   icon: CheckCircle,  bg: 'bg-slate-100', text: 'text-slate-600', filter: 'COMPLETED' },
        ].map(s => (
          <button key={s.label} onClick={() => setFilterStatus(s.filter)}
            className={`bg-white rounded-2xl p-5 shadow-sm border flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left ${filterStatus === s.filter ? 'border-slate-400 ring-2 ring-slate-200' : 'border-slate-100'}`}>
            <div className={`p-3 rounded-xl ${s.bg}`}><s.icon className={s.text} size={22} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium leading-tight">{s.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{s.value}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 shrink-0">
            <FlaskConical className="text-slate-600" size={20} />
            Lab Test Queue
            {filterStatus !== 'ALL' && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge(filterStatus).bg} ${badge(filterStatus).text}`}>
                {badge(filterStatus).label}
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

        {/* Status Filter Tabs */}
        <div className="px-5 pt-3 flex gap-1.5 flex-wrap">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => {
            const count = s === 'ALL' ? tests.length : tests.filter(t => t.status === s).length;
            const cfg = s === 'ALL' ? null : badge(s);
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
                <p className="font-medium">No tests found.</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Test</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Patient</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Doctor</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Ordered</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Workflow Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => {
                    const cfg = badge(t.status);
                    const isLoading = actionLoading === t.testId;
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
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {t.recordedAt ? new Date(t.recordedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>{cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {(() => {
                            const workflowStep = getWorkflowStep(t);
                            const { step, label } = WORKFLOW_LABELS[workflowStep];

                            return (
                              <div className="w-max">
                                {/* Mini progress dots */}
                                {workflowStep !== 'cancelled' && (
                                  <div className="flex items-center gap-1 mb-2">
                                    {[1, 2, 3].map(n => (
                                      <div
                                        key={n}
                                        className={`h-1.5 rounded-full transition-all ${
                                          workflowStep === 'completed' || n < step
                                            ? 'w-6 bg-emerald-500'
                                            : n === step
                                              ? 'w-6 bg-slate-800'
                                              : 'w-3 bg-slate-200'
                                        }`}
                                      />
                                    ))}
                                    <span className="text-[10px] font-bold text-slate-400 ml-1">
                                      {workflowStep === 'completed' ? '3/3 Done' : `Step ${step}/3`}
                                    </span>
                                  </div>
                                )}

                                {/* Single sequential action button */}
                                {workflowStep === 'payment' && (
                                  <button
                                    onClick={() => handleMarkPayment(t.testId)}
                                    disabled={isLoading}
                                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-60"
                                  >
                                    {isLoading ? '…' : 'Mark Paid'}
                                  </button>
                                )}

                                {workflowStep === 'collection' && (
                                  <button
                                    onClick={() => handleSampleCollected(t.testId)}
                                    disabled={isLoading}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-60"
                                  >
                                    {isLoading ? '…' : <><Play size={12} /> Collect Sample</>}
                                  </button>
                                )}

                                {workflowStep === 'result' && (
                                  <button
                                    onClick={() => setResultModal(t)}
                                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                                  >
                                    <Send size={12} /> Upload Result
                                  </button>
                                )}

                                {workflowStep === 'completed' && (
                                  <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-200">
                                    <CheckCircle size={14} /> Workflow Complete
                                  </span>
                                )}

                                {workflowStep === 'cancelled' && (
                                  <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold px-4 py-2 rounded-xl border border-red-200">
                                    <Ban size={14} /> Cancelled
                                  </span>
                                )}

                                {workflowStep !== 'completed' && workflowStep !== 'cancelled' && (
                                  <p className="text-[10px] font-semibold text-slate-400 mt-1.5">{label}</p>
                                )}

                                {/* Cancel & View */}
                                <div className="flex gap-3 mt-2">
                                  <button onClick={() => setDetailModal(t)} className="text-[10px] font-bold text-slate-500 hover:text-slate-700 uppercase underline">View Details</button>
                                  {(t.status === 'PENDING' || t.status === 'IN_PROGRESS') && (
                                    <button onClick={() => handleCancel(t.testId)} disabled={isLoading} className="text-[10px] font-bold text-rose-500 hover:text-rose-700 uppercase underline">Cancel Test</button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-5 py-3 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
            <span>Showing {filtered.length} of {tests.length} tests</span>
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

