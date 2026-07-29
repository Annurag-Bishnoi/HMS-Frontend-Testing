import { useEffect, useState } from 'react';
import { Stethoscope, RefreshCw, Calendar, Pill, FlaskConical, X, ChevronRight, Activity, Bed } from 'lucide-react';
import { getUser } from '../../../utils/token';
import { getPatientByUserId } from '../../../api/patientService';
import { getVisitsByPatientId } from '../../../api/visitService';
import { getAdmissionsByPatient, getDailyRounds } from '../../../api/ipdService';

function VisitDetailModal({ visit, onClose }: { visit: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-5 text-white flex justify-between items-start shrink-0">
          <div>
            <p className="text-slate-400 text-xs">Visit Record</p>
            <h3 className="font-bold text-lg mt-0.5">
              {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
            </h3>
            <p className="text-slate-300 text-sm">Dr. {visit.doctorName}</p>
          </div>
          <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition"><X size={18} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-[10px] font-bold uppercase text-emerald-500 tracking-wider mb-1">Diagnosis</p>
              <p className="font-bold text-emerald-800">{visit.diagnosis || 'Not recorded'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Visit Status</p>
              <p className="font-bold text-slate-700">{visit.status || '—'}</p>
            </div>
          </div>
          {visit.notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase text-amber-500 tracking-wider mb-1">Clinical Notes</p>
              <p className="text-sm text-amber-900 whitespace-pre-wrap">{visit.notes}</p>
            </div>
          )}
          {visit.vitals?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Vitals</p>
              <div className="flex flex-wrap gap-2">
                {visit.vitals.map((v: any) => (
                  <span key={v.vitalId} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg font-medium">
                    {v.conceptName}: <strong>{v.vitalValue}</strong> {v.unit}
                  </span>
                ))}
              </div>
            </div>
          )}
          {visit.medications?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1"><Pill size={11}/> Medications</p>
              <div className="space-y-2">
                {visit.medications.map((m: any, i: number) => (
                  <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <div className="flex justify-between">
                      <p className="font-bold text-amber-900 text-sm">{m.medicineName}</p>
                      <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded">{m.frequency}</span>
                    </div>
                    <p className="text-xs text-amber-700 mt-0.5">{m.dosage} · {m.duration}{m.instructions ? ` · ${m.instructions}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {visit.labTests?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1"><FlaskConical size={11}/> Lab Tests</p>
              <div className="space-y-2">
                {visit.labTests.map((t: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm">
                    <span className="font-semibold text-slate-700">{t.testName}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdmissionDetailModal({ admission, onClose }: { admission: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-5 text-white flex justify-between items-start shrink-0">
          <div>
            <p className="text-amber-200 text-xs font-bold uppercase tracking-wider">Hospital Stay</p>
            <h3 className="font-bold text-lg mt-0.5">
              {admission.admissionDate ? new Date(admission.admissionDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
            </h3>
            <p className="text-amber-100 text-sm">Dr. {admission.doctorName} • Ward {admission.wardName} (Bed {admission.bedNumber})</p>
          </div>
          <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition"><X size={18} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Diagnosis</p>
              <p className="font-bold text-slate-800 text-lg">{admission.admissionDiagnosis || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${admission.status === 'DISCHARGED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {admission.status}
              </span>
            </div>
          </div>

          {admission.rounds && admission.rounds.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1"><Stethoscope size={12}/> Daily Clinical Rounds</p>
              <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {admission.rounds.map((r: any, idx: number) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Stethoscope size={14} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-700 text-sm">Dr. {r.doctorName}</h4>
                        <time className="text-[10px] font-bold text-slate-400">{new Date(r.roundDate).toLocaleDateString('en-IN', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}</time>
                      </div>
                      <p className="text-sm text-slate-600">{r.clinicalNotes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {admission.dischargeSummary && (
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5">
              <p className="text-[10px] font-bold uppercase text-amber-600 tracking-wider mb-2">Discharge Summary</p>
              <p className="text-sm text-amber-900 whitespace-pre-wrap">{admission.dischargeSummary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PatientVisitHistoryPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const user = getUser();
      if (!user?.userId) return;
      const patient = await getPatientByUserId(String(user.userId));
      const patientId = String(patient.patientId);

      const vs = await getVisitsByPatientId(patientId);
      setVisits(Array.isArray(vs)
        ? [...vs].sort((a, b) => new Date(b.visitDate || 0).getTime() - new Date(a.visitDate || 0).getTime())
        : []);

      try {
        const adms = await getAdmissionsByPatient(patientId);
        if (Array.isArray(adms)) {
          const admissionsWithRounds = await Promise.all(adms.map(async (adm) => {
            try {
              const rounds = await getDailyRounds(adm.id);
              return { ...adm, rounds: Array.isArray(rounds) ? rounds : [] };
            } catch (e) {
              return { ...adm, rounds: [] };
            }
          }));
          setAdmissions(admissionsWithRounds.sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()));
        }
      } catch (ipdErr) {
        console.error(ipdErr);
      }

    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-64px)]"><Activity className="animate-spin text-teal-600" size={32} /></div>;

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3"><Stethoscope className="text-teal-600" size={30} /> Visit History</h1>
          <p className="text-slate-500 mt-1">{visits.length} consultation{visits.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button onClick={init} className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 shadow-sm transition">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Visits',   value: visits.length,                                                          bg: 'bg-teal-50',    text: 'text-teal-600',   icon: Stethoscope },
          { label: 'With Diagnosis', value: visits.filter(v => v.diagnosis).length,                                  bg: 'bg-emerald-50', text: 'text-emerald-600',icon: Activity    },
          { label: 'Medications',    value: visits.reduce((s, v) => s + (v.medications?.length || 0), 0),            bg: 'bg-amber-50',   text: 'text-amber-600',  icon: Pill        },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg}`}><s.icon className={s.text} size={22} /></div>
            <div><p className="text-xs text-slate-500 font-medium">{s.label}</p><p className="text-2xl font-bold text-slate-800">{s.value}</p></div>
          </div>
        ))}
      </div>

      {/* IPD Admissions */}
      {admissions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Bed className="text-amber-500" size={24} /> Inpatient Hospital Stays
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Admission Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Doctor & Ward</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Diagnosis</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((adm: any) => (
                  <tr key={adm.id} onClick={() => setSelectedAdmission(adm)} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {adm.admissionDate ? new Date(adm.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">Dr. {adm.doctorName}</p>
                      <p className="text-xs text-slate-400">Ward {adm.wardName}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{adm.admissionDiagnosis || '—'}</td>
                    <td className="px-6 py-4 flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${adm.status === 'DISCHARGED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {adm.status}
                      </span>
                      <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OPD Visit Cards */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Stethoscope className="text-teal-600" size={24} /> Outpatient Consultations
        </h2>
        {visits.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center text-slate-400 shadow-sm border border-slate-100">
            <Stethoscope size={52} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium text-lg">No visit records yet.</p>
            <p className="text-sm mt-1">Your consultations will appear here after each visit.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Doctor</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Diagnosis</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Items</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((v: any) => (
                  <tr key={v.visitId} onClick={() => setSelectedVisit(v)} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {v.visitDate ? new Date(v.visitDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">Dr. {v.doctorName}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-700">{v.diagnosis || '—'}</p>
                      {v.notes && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{v.notes}</p>}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        {v.medications?.length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-bold">
                            <Pill size={10} /> {v.medications.length}
                          </span>
                        )}
                        {v.labTests?.length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-bold">
                            <FlaskConical size={10} /> {v.labTests.length}
                          </span>
                        )}
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

      {selectedVisit && <VisitDetailModal visit={selectedVisit} onClose={() => setSelectedVisit(null)} />}
      {selectedAdmission && <AdmissionDetailModal admission={selectedAdmission} onClose={() => setSelectedAdmission(null)} />}
    </div>
  );
}
