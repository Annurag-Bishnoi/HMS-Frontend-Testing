import { useEffect, useState } from 'react';
import { Pill, RefreshCw, Search, FileText, X, ChevronRight, BarChart2 } from 'lucide-react';
import { getUser } from '../../../utils/token';
import { getPatientByUserId } from '../../../api/patientService';
import { getPrescriptionsByPatientId } from '../../../api/prescriptionService';

function RxModal({ rx, onClose }: { rx: any; onClose: () => void }) {
  const handlePrint = () => window.print();
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 text-white flex justify-between items-start shrink-0">
          <div>
            <p className="text-purple-200 text-xs">Prescription #{rx.prescriptionId}</p>
            <h3 className="font-bold text-lg mt-0.5">Dr. {rx.doctorName}</h3>
            <p className="text-purple-200 text-sm">{rx.createdAt ? new Date(rx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/30 transition">
              🖨️ Print
            </button>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition"><X size={18} /></button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase text-emerald-500 tracking-wider mb-1">Diagnosis</p>
            <p className="font-bold text-emerald-800">{rx.diagnosis}</p>
            {rx.notes && <p className="text-sm text-emerald-700 mt-1 italic">{rx.notes}</p>}
          </div>
          <div>
            <p className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2"><Pill size={14} className="text-purple-600" /> Medications ({rx.medications?.length || 0})</p>
            {rx.medications?.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">#</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Medicine</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Dosage</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Frequency</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rx.medications.map((m: any, i: number) => (
                      <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                        <td className="px-6 py-4 text-slate-400">{i + 1}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{m.medicineName}</td>
                        <td className="px-6 py-4 text-slate-600">{m.dosage}</td>
                        <td className="px-6 py-4"><span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded">{m.frequency}</span></td>
                        <td className="px-6 py-4 text-slate-600">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-slate-400 italic text-sm">No medications.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const user = getUser();
      if (!user?.userId) return;
      const patient = await getPatientByUserId(String(user.userId));
      const rxs = await getPrescriptionsByPatientId(String(patient.patientId));
      setPrescriptions(Array.isArray(rxs)
        ? [...rxs].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = search.trim()
    ? prescriptions.filter(rx =>
        rx.diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
        rx.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
        rx.medications?.some((m: any) => m.medicineName?.toLowerCase().includes(search.toLowerCase()))
      )
    : prescriptions;

  // Removed topDrugs logic

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-64px)]"><RefreshCw className="animate-spin text-purple-600" size={32} /></div>;

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3"><Pill className="text-purple-600" size={30} /> My Prescriptions</h1>
          <p className="text-slate-500 mt-1">{prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''} from your doctors</p>
        </div>
        <button onClick={init} className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 shadow-sm transition">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by drug, diagnosis, doctor…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white" />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center text-slate-400 shadow-sm border border-slate-100">
            <Pill size={52} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium text-lg">No prescriptions found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Doctor</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Diagnosis</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Drugs</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rx => (
                  <tr key={rx.prescriptionId} onClick={() => setSelected(rx)} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">Dr. {rx.doctorName}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-700">{rx.diagnosis}</td>
                    <td className="px-6 py-4 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded-full">{rx.medications?.length || 0}</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <RxModal rx={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
