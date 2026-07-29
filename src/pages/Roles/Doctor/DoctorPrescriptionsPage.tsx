import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Pill, Search, RefreshCw, FileText, X, Calendar,
  User, Activity, ChevronDown, Printer, BarChart2,
  CheckCircle, Clock
} from 'lucide-react';
import { getDoctorByUserId } from '../../../api/doctorService';
import { getPrescriptionsByDoctorId, type PrescriptionResponse } from '../../../api/prescriptionService';
import { getUser } from '../../../utils/token';
import PatientHistoryModal from '../../../components/common/PatientHistoryModal';

/* ─── Status Badge ─────────────────────────────────── */
const STATUS: Record<string, { label: string; bg: string; text: string }> = {
  CREATED:   { label: 'Issued',    bg: 'bg-blue-50',    text: 'text-blue-700'    },
  DISPENSED: { label: 'Dispensed', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-50',     text: 'text-red-600'     },
};
const badge = (s?: string) => STATUS[s ?? 'CREATED'] ?? STATUS.CREATED;

/* ─── Printable Rx ─────────────────────────────────── */
function PrintableRx({ rx, doctorInfo }: { rx: PrescriptionResponse; doctorInfo: any }) {
  return (
    <div id="printable-rx" className="hidden print:block bg-white p-10 text-black font-mono text-sm">
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-2xl font-bold">MediCare Hospital</h1>
        <p className="text-sm">Doctor Prescription / Medical Certificate</p>
      </div>
      <div className="flex justify-between mb-4 text-xs">
        <div>
          <p><strong>Patient:</strong> {rx.patientName}</p>
          <p><strong>Patient ID:</strong> #{rx.patientId}</p>
          <p><strong>Diagnosis:</strong> {rx.diagnosis}</p>
        </div>
        <div className="text-right">
          <p><strong>Dr.</strong> {rx.doctorName}</p>
          <p><strong>Date:</strong> {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString('en-IN') : ''}</p>
          <p><strong>Rx #:</strong> {rx.prescriptionId}</p>
        </div>
      </div>
      <table className="min-w-full">
        <thead className="bg-slate-100 border-b border-slate-200">
          <tr className="bg-gray-200">
            <th className="px-6 py-4 text-left font-semibold text-slate-700">#</th>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">Medicine</th>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">Dosage</th>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">Frequency</th>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">Duration</th>
            <th className="px-6 py-4 text-left font-semibold text-slate-700">Instructions</th>
          </tr>
        </thead>
        <tbody>
          {rx.medications.map((m, i) => (
            <tr key={i}>
              <td className="px-6 py-4 border border-black  text-center">{i + 1}</td>
              <td className="px-6 py-4 border border-black  font-bold">{m.medicineName}</td>
              <td className="px-6 py-4 border border-black">{m.dosage}</td>
              <td className="px-6 py-4 border border-black">{m.frequency}</td>
              <td className="px-6 py-4 border border-black">{m.duration}</td>
              <td className="px-6 py-4 border border-black">{m.instructions || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rx.notes && <p className="mt-4 text-xs"><strong>Notes:</strong> {rx.notes}</p>}
      <div className="mt-10 text-right text-xs">
        <p>________________________</p>
        <p className="font-bold">Dr. {rx.doctorName}</p>
        <p>Signature & Stamp</p>
      </div>
    </div>
  );
}

/* ─── Detail Modal ─────────────────────────────────── */
function PrescriptionModal({ rx, onClose, doctorInfo }: { rx: PrescriptionResponse; onClose: () => void; doctorInfo: any }) {
  const { label, bg, text } = badge(rx.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-slate-200 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Pill size={18} className="text-slate-500" />
              <span className="font-bold text-lg text-slate-800">Prescription #{rx.prescriptionId}</span>
              <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${bg} ${text}`}>{label}</span>
            </div>
            <p className="text-slate-500 text-sm">{rx.patientName} &bull; {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">

          {/* Patient + Diagnosis */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1"><User size={11}/> Patient</p>
              <p className="font-bold text-slate-800">{rx.patientName}</p>
              <p className="text-sm text-slate-500">ID #{rx.patientId}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Diagnosis</p>
              <p className="font-bold text-slate-800">{rx.diagnosis}</p>
            </div>
          </div>

          {/* Medications Table */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Pill size={15} className="text-blue-600" /> Medications Prescribed ({rx.medications.length})
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">#</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Medicine</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Dosage</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Frequency</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Duration</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {rx.medications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400 italic">No medications in this prescription.</td>
                    </tr>
                  ) : (
                    rx.medications.map((m, i) => (
                      <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                        <td className="px-6 py-4 text-slate-500 font-medium">{i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{m.medicineName}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{m.dosage}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">{m.frequency}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{m.duration}</td>
                        <td className="px-6 py-4 text-slate-500 italic text-xs">{m.instructions || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Notes */}
          {rx.notes && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Clinical Notes</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{rx.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden printable version */}
      <PrintableRx rx={rx} doctorInfo={doctorInfo} />
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'TODAY' | 'THIS_WEEK'>('ALL');
  const [sortField, setSortField] = useState<'date' | 'patient' | 'drugs'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<PrescriptionResponse | null>(null);

  // History Modal State
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const user = getUser();
      if (!user) return;
      const doc = await getDoctorByUserId(String(user.userId));
      if (doc) {
        setDoctorInfo(doc);
        const data = await getPrescriptionsByDoctorId(String(doc.id));
        setPrescriptions(data);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  /* ── Derived Stats ── */
  const totalToday    = prescriptions.filter(p => p.createdAt?.startsWith(todayStr)).length;
  const totalThisWeek = prescriptions.filter(p => p.createdAt && new Date(p.createdAt) >= weekAgo).length;
  const uniquePatients = new Set(prescriptions.map(p => p.patientId)).size;

  // Top 5 most prescribed drugs
  const drugCount: Record<string, number> = {};
  prescriptions.forEach(p => p.medications?.forEach(m => {
    drugCount[m.medicineName] = (drugCount[m.medicineName] || 0) + 1;
  }));
  const topDrugs = Object.entries(drugCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxDrugCount = topDrugs[0]?.[1] || 1;

  /* ── Filtered & Sorted List ── */
  const list = useMemo(() => {
    let l = [...prescriptions];

    if (filter === 'TODAY')     l = l.filter(p => p.createdAt?.startsWith(todayStr));
    if (filter === 'THIS_WEEK') l = l.filter(p => p.createdAt && new Date(p.createdAt) >= weekAgo);

    if (search.trim()) {
      const q = search.toLowerCase();
      l = l.filter(p =>
        p.patientName?.toLowerCase().includes(q) ||
        p.diagnosis?.toLowerCase().includes(q) ||
        p.medications?.some(m => m.medicineName?.toLowerCase().includes(q))
      );
    }

    l.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date')    cmp = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (sortField === 'patient') cmp = (a.patientName || '').localeCompare(b.patientName || '');
      if (sortField === 'drugs')   cmp = (a.medications?.length || 0) - (b.medications?.length || 0);
      return sortAsc ? cmp : -cmp;
    });

    return l;
  }, [prescriptions, search, filter, sortField, sortAsc]);

  const toggleSort = (f: typeof sortField) => {
    if (sortField === f) setSortAsc(v => !v);
    else { setSortField(f); setSortAsc(false); }
  };

  const SortIcon = ({ f }: { f: typeof sortField }) => (
    <ChevronDown size={13} className={`inline ml-1 transition-transform ${sortField === f && sortAsc ? 'rotate-180' : ''} ${sortField !== f ? 'opacity-30' : ''}`} />
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-64px)] overflow-y-auto print:hidden">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Pill className="text-blue-600" size={30} /> My Prescriptions
          </h1>
          <p className="text-slate-500 mt-1">All prescriptions you have issued to patients</p>
        </div>
        <button onClick={init} className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition shadow-sm">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Issued',     value: prescriptions.length, icon: FileText,    bg: 'bg-blue-50',    tc: 'text-blue-600'    },
          { label: "Today's Rx",       value: totalToday,            icon: Clock,       bg: 'bg-amber-50',   tc: 'text-amber-600'   },
          { label: 'This Week',         value: totalThisWeek,         icon: Calendar,   bg: 'bg-purple-50',  tc: 'text-purple-600'  },
          { label: 'Unique Patients',   value: uniquePatients,        icon: User,        bg: 'bg-emerald-50', tc: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg}`}><s.icon className={s.tc} size={22} /></div>
            <div>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: Table */}
      <div className="space-y-4">

          {/* Search & Filter bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by patient, diagnosis, or medication…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>
            <div className="flex gap-2">
              {(['ALL', 'TODAY', 'THIS_WEEK'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'ALL' ? 'All' : f === 'TODAY' ? 'Today' : 'This Week'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {list.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Pill size={48} className="mx-auto mb-4 opacity-40" />
                <p className="font-medium">No prescriptions found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Rx #</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700" onClick={() => toggleSort('patient')}>
                        Patient <SortIcon f="patient" />
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Diagnosis</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700" onClick={() => toggleSort('drugs')}>
                        Drugs <SortIcon f="drugs" />
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700" onClick={() => toggleSort('date')}>
                        Date <SortIcon f="date" />
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(rx => {
                      const { label, bg, text } = badge(rx.status);
                      const isToday = rx.createdAt?.startsWith(todayStr);
                      return (
                        <tr key={rx.prescriptionId} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${isToday ? 'bg-amber-50/10' : ''}`} onClick={() => setSelected(rx)}>
                          <td className="px-6 py-4 text-slate-500 font-mono text-sm">#{rx.prescriptionId}</td>
                          <td className="px-6 py-4">
                            <div>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setSelectedPatientId(String(rx.patientId)); 
                                  setSelectedPatientName(rx.patientName); 
                                }}
                                className="font-semibold text-slate-800 hover:text-blue-600 hover:underline text-left flex items-center gap-1 text-sm"
                              >
                                {rx.patientName} <FileText size={12} className="text-slate-400" />
                              </button>
                              <p className="text-xs text-slate-400 mt-0.5">ID #{rx.patientId}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-emerald-700 max-w-[160px] truncate">{rx.diagnosis}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(rx.medications || []).slice(0, 2).map((m, i) => (
                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{m.medicineName}</span>
                              ))}
                              {(rx.medications?.length || 0) > 2 && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">+{(rx.medications.length - 2)}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            {isToday && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">TODAY</span>}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={e => { e.stopPropagation(); setSelected(rx); }}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5"
                            >
                              <FileText size={14} /> View Rx
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 text-right">Showing {list.length} of {prescriptions.length} prescriptions</p>
        </div>

      {/* Detail Modal */}
      {selected && (
        <PrescriptionModal
          rx={selected}
          onClose={() => setSelected(null)}
          doctorInfo={doctorInfo}
        />
      )}

      {/* History Modal */}
      {selectedPatientId && (
        <PatientHistoryModal
          patientId={selectedPatientId}
          patientName={selectedPatientName}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
}
