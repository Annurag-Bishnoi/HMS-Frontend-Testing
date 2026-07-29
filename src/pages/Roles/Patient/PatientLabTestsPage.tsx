import { useEffect, useState } from 'react';
import { FlaskConical, RefreshCw, CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react';
import { getUser } from '../../../utils/token';
import { getPatientByUserId } from '../../../api/patientService';
import { getVisitsByPatientId } from '../../../api/visitService';
import DocumentViewerModal from '../../../components/common/DocumentViewerModal';
import DataTable, { tableHeadClass, tableRowClass, tableCellClass } from '../../../components/common/DataTable';


export default function PatientLabTestsPage() {
  const [allLabs, setAllLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [docUrl, setDocUrl] = useState<string | null>(null);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const user = getUser();
      if (!user?.userId) return;
      const patient = await getPatientByUserId(String(user.userId));
      const visits = await getVisitsByPatientId(String(patient.patientId));
      const labs = Array.isArray(visits)
        ? visits.flatMap((v: any) =>
            (v.labTests || []).map((t: any) => ({
              ...t,
              visitDate: v.visitDate,
              doctorName: v.doctorName,
              diagnosis: v.diagnosis,
              visitId: v.visitId,
            }))
          ).sort((a, b) => new Date(b.visitDate || 0).getTime() - new Date(a.visitDate || 0).getTime())
        : [];
      setAllLabs(labs);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = filterStatus === 'ALL' ? allLabs
    : filterStatus === 'PENDING' ? allLabs.filter(t => t.status !== 'COMPLETED')
    : allLabs.filter(t => t.status === 'COMPLETED');

  const pending   = allLabs.filter(t => t.status !== 'COMPLETED').length;
  const completed = allLabs.filter(t => t.status === 'COMPLETED').length;

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-64px)]"><Activity className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3"><FlaskConical className="text-blue-600" size={30} /> Lab Tests</h1>
          <p className="text-slate-500 mt-1">{allLabs.length} test{allLabs.length !== 1 ? 's' : ''} ordered across all visits</p>
        </div>
        <button onClick={init} className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 shadow-sm transition">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Ordered', value: allLabs.length,  bg: 'bg-blue-50',    text: 'text-blue-600',    icon: FlaskConical },
          { label: 'Pending',       value: pending,         bg: 'bg-amber-50',   text: 'text-amber-600',   icon: Clock       },
          { label: 'Completed',     value: completed,       bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg}`}><s.icon className={s.text} size={22} /></div>
            <div><p className="text-xs text-slate-500 font-medium">{s.label}</p><p className="text-2xl font-bold text-slate-800">{s.value}</p></div>
          </div>
        ))}
      </div>

      {/* Pending alert banner */}
      {pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="text-amber-600 shrink-0" size={22} />
          <div>
            <p className="font-bold text-amber-800">{pending} test{pending > 1 ? 's are' : ' is'} pending results</p>
            <p className="text-sm text-amber-700 mt-0.5">Please visit the laboratory or check back later for your results.</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {(['ALL', 'PENDING', 'COMPLETED'] as const).map(f => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filterStatus === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {f.charAt(0) + f.slice(1).toLowerCase()} {f !== 'ALL' && `(${f === 'PENDING' ? pending : completed})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center text-slate-400 shadow-sm border border-slate-100">
          <FlaskConical size={52} className="mx-auto mb-4 opacity-40" />
          <p className="font-medium text-lg">No lab tests found.</p>
          <p className="text-sm mt-1">Lab tests ordered by your doctor will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(
            filtered.reduce((acc: any, t: any) => {
              const key = t.visitId || 'unknown';
              if (!acc[key]) acc[key] = { visitDate: t.visitDate, doctorName: t.doctorName, diagnosis: t.diagnosis, tests: [] };
              acc[key].tests.push(t);
              return acc;
            }, {})
          ).map(([visitId, group]: [string, any]) => (
            <div key={visitId} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">
                    {group.visitDate ? new Date(group.visitDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' }) : 'Unknown Date'}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">Dr. {group.doctorName} {group.diagnosis && `• ${group.diagnosis}`}</p>
                </div>
              </div>
              <DataTable>
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className={tableHeadClass}>Test Name</th>
                    <th className={tableHeadClass}>Status</th>
                    <th className={tableHeadClass}>Result</th>
                    <th className={tableHeadClass}>Document</th>
                  </tr>
                </thead>
                <tbody>
                  {group.tests.map((t: any, i: number) => {
                    const isDone = t.status === 'COMPLETED';
                    return (
                      <tr key={i} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                        <td className={tableCellClass}>
                          <p className="font-semibold text-slate-800">{t.testName}</p>
                          {t.testCode && <p className="text-xs text-slate-400">{t.testCode}</p>}
                        </td>
                        <td className={tableCellClass}>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 ${isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {isDone ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {isDone ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td className={tableCellClass}>
                          {isDone && t.resultValue ? (
                            <div>
                              <span className="font-bold text-slate-800">{t.resultValue}</span>
                              {t.normalRange && <p className="text-xs text-slate-400">Range: {t.normalRange}</p>}
                            </div>
                          ) : <span className="text-slate-400">—</span>}
                        </td>
                        <td className={tableCellClass}>
                          {isDone && t.documentUrl ? (
                            <button onClick={() => setDocUrl(t.documentUrl)}
                               className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 underline">
                              View Doc
                            </button>
                          ) : <span className="text-slate-400">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </DataTable>
            </div>
          ))}
        </div>
      )}
      
      {docUrl && <DocumentViewerModal url={docUrl} onClose={() => setDocUrl(null)} />}
    </div>
  );
}
