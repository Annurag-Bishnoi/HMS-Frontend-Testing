import { useEffect, useState } from 'react';
import {
  Users, Activity, FileText, Pill, X, Calendar,
  Search, RefreshCw, FlaskConical
} from 'lucide-react';
import { getDoctorByUserId } from '../../../api/doctorService';
import { getVisitsByPatientId, getVisitsByDoctorId } from '../../../api/visitService';
import { getUser } from '../../../utils/token';
import DocumentViewerModal from '../../../components/common/DocumentViewerModal';
import PatientHistoryModal from '../../../components/common/PatientHistoryModal';

export default function DoctorPatientsPage() {
  const [doctorVisits, setDoctorVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [docUrl, setDocUrl] = useState<string | null>(null);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const user = getUser();
      if (!user) return;
      const doc = await getDoctorByUserId(String(user.userId));
      if (doc) {
        const visits = await getVisitsByDoctorId(String(doc.id));
        setDoctorVisits(Array.isArray(visits) ? visits : []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openHistory = async (patientId: string, name: string) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(name);
  };

  // Build unique patient list
  const patientsMap = new Map<string, any>();
  doctorVisits.forEach((v: any) => {
    const pid = String(v.patientId);
    if (!patientsMap.has(pid)) {
      patientsMap.set(pid, { id: pid, name: v.patientName, lastVisit: v.visitDate, lastDiagnosis: v.diagnosis, totalVisits: 1 });
    } else {
      const p = patientsMap.get(pid)!;
      p.totalVisits += 1;
      if (v.visitDate && new Date(v.visitDate) > new Date(p.lastVisit)) {
        p.lastVisit = v.visitDate;
        p.lastDiagnosis = v.diagnosis;
      }
    }
  });
  const allPatients = Array.from(patientsMap.values())
    .sort((a, b) => new Date(b.lastVisit || 0).getTime() - new Date(a.lastVisit || 0).getTime());

  const filtered = search.trim()
    ? allPatients.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))
    : allPatients;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-64px)] overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Patients</h1>
          <p className="text-slate-500 mt-1">
            {allPatients.length} unique patient{allPatients.length !== 1 ? 's' : ''} treated · {doctorVisits.length} total visits
          </p>
        </div>
        <button onClick={init} className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50"><Users className="text-blue-600" size={22} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Patients</p>
            <p className="text-2xl font-bold text-slate-800">{allPatients.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50"><Activity className="text-emerald-600" size={22} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Consultations</p>
            <p className="text-2xl font-bold text-slate-800">{doctorVisits.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50"><Calendar className="text-purple-600" size={22} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Seen Today</p>
            <p className="text-2xl font-bold text-slate-800">
              {doctorVisits.filter((v: any) => {
                const d = v.visitDate ? new Date(v.visitDate).toISOString().split('T')[0] : '';
                return d === new Date().toISOString().split('T')[0];
              }).length}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search patients by name…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* ── Table / List ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {allPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Users size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium">No patients found.</p>
            {search && <p className="text-sm mt-1">Try a different search term.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Patient</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Patient ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Visits</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Last Visit</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Last Diagnosis</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{p.name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">#{p.id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {p.totalVisits}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-emerald-700 font-medium">{p.lastDiagnosis || '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openHistory(p.id, p.name)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-sm px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-2"
                      >
                        <FileText size={15} /> View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Patient History Modal ── */}
      {selectedPatientId && (
        <PatientHistoryModal 
          patientId={selectedPatientId} 
          patientName={selectedPatientName} 
          onClose={() => setSelectedPatientId(null)} 
        />
      )}

      {docUrl && <DocumentViewerModal url={docUrl} onClose={() => setDocUrl(null)} />}
    </div>
  );
}
