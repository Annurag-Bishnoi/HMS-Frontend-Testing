import React, { useEffect, useState } from 'react';
import { X, Activity, FileText, Calendar, Pill, FlaskConical, Stethoscope } from 'lucide-react';
import { getVisitsByPatientId } from '../../api/visitService';
import { getAdmissionsByPatient, getDailyRounds } from '../../api/ipdService';
import DocumentViewerModal from './DocumentViewerModal';

interface PatientHistoryModalProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
}

export default function PatientHistoryModal({ patientId, patientName, onClose }: PatientHistoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [visits, setVisits] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [docUrl, setDocUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [patientId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const fetchedVisits = await getVisitsByPatientId(patientId);
      const sortedVisits = Array.isArray(fetchedVisits)
        ? [...fetchedVisits].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
        : [];
      setVisits(sortedVisits);

      try {
        const fetchedAdmissions = await getAdmissionsByPatient(patientId);
        if (Array.isArray(fetchedAdmissions)) {
            // Fetch rounds for each admission
            const admissionsWithRounds = await Promise.all(
                fetchedAdmissions.map(async (adm) => {
                    try {
                        const rounds = await getDailyRounds(adm.id);
                        return { ...adm, rounds: Array.isArray(rounds) ? rounds : [] };
                    } catch (e) {
                        return { ...adm, rounds: [] };
                    }
                })
            );
            setAdmissions(admissionsWithRounds.sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()));
        }
      } catch (ipdError) {
        console.error("Error fetching IPD admissions:", ipdError);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-800">{patientName}</h3>
              <p className="text-xs text-slate-500">Complete Medical History</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <Activity className="animate-spin text-blue-600 mb-3" size={32} />
              <p className="text-slate-500">Loading history...</p>
            </div>
          ) : visits.length === 0 && admissions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText size={48} className="mx-auto mb-4 opacity-40" />
              <p>No recorded medical history found.</p>
            </div>
          ) : (
            <>
              {/* IPD Admissions Section */}
              {admissions.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">IPD Admissions</h4>
                  <div className="space-y-5">
                    {admissions.map((adm, idx) => (
                      <div key={adm.id ?? idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-amber-50 px-5 py-3 flex justify-between items-center border-b border-slate-200">
                          <div className="font-bold text-amber-800 flex items-center gap-2">
                            <Calendar size={15} className="text-amber-600" />
                            {new Date(adm.admissionDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                          <div className="text-sm font-medium text-amber-700">Dr. {adm.doctorName}</div>
                        </div>
                        <div className="p-5 space-y-4">
                          <div className="flex justify-between text-sm">
                            <div><span className="font-bold text-slate-500">Diagnosis:</span> <span className="font-semibold text-slate-800">{adm.admissionDiagnosis || 'N/A'}</span></div>
                            <div><span className="font-bold text-slate-500">Bed:</span> <span className="font-semibold text-slate-800">{adm.bedNumber || 'N/A'} ({adm.wardName || 'N/A'})</span></div>
                            <div><span className="font-bold text-slate-500">Status:</span> <span className="font-semibold text-slate-800">{adm.status}</span></div>
                          </div>
                          
                          {/* Daily Rounds */}
                          {adm.rounds && adm.rounds.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Stethoscope size={12} /> Clinical Rounds
                              </p>
                              <div className="space-y-2">
                                {adm.rounds.map((r: any, i: number) => (
                                  <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-bold text-slate-700">Dr. {r.doctorName}</span>
                                      <span className="text-xs font-bold text-slate-400">{new Date(r.roundDate).toLocaleString('en-IN')}</span>
                                    </div>
                                    <p className="text-slate-600 whitespace-pre-wrap">{r.clinicalNotes}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Discharge Summary */}
                          {adm.dischargeSummary && (
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Discharge Summary</p>
                                <p className="text-sm text-slate-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100 whitespace-pre-wrap">
                                  {adm.dischargeSummary}
                                </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OPD Visits Section */}
              {visits.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">OPD Visits</h4>
                  <div className="space-y-5">
                    {visits.map((visit, idx) => (
                      <div key={visit.visitId ?? idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Visit Header */}
                        <div className="bg-slate-100 px-5 py-3 flex justify-between items-center border-b border-slate-200">
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            <Calendar size={15} className="text-slate-500" />
                            {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                          </div>
                          <div className="text-sm font-medium text-slate-600">Dr. {visit.doctorName}</div>
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left: Diagnosis, Notes, Vitals */}
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p>
                              <p className="text-sm font-semibold text-slate-800">{visit.diagnosis || 'No diagnosis recorded'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Notes</p>
                              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap min-h-[48px]">
                                {visit.notes || 'No notes recorded.'}
                              </p>
                            </div>
                            {visit.vitals && visit.vitals.length > 0 && (
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Vitals</p>
                                <div className="flex flex-wrap gap-2">
                                  {visit.vitals.map((v: any) => (
                                    <span key={v.vitalId} className="text-xs bg-slate-50 text-slate-700 border border-slate-200 px-2 py-1 rounded font-medium">
                                      {v.conceptName}: <strong>{v.vitalValue}</strong> {v.unit}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right: Medications & Lab Tests */}
                          <div className="space-y-4 md:border-l md:border-slate-100 md:pl-6">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Pill size={12} /> Prescriptions
                              </p>
                              {visit.medications && visit.medications.length > 0 ? (
                                <ul className="space-y-2">
                                  {visit.medications.map((m: any, i: number) => (
                                    <li key={i} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm">
                                      <div className="font-bold text-slate-800">{m.medicineName}</div>
                                      <div className="text-slate-600 text-xs mt-0.5">{m.dosage} • {m.frequency} • {m.duration}</div>
                                      {m.instructions && <div className="text-slate-500 text-xs italic mt-1">{m.instructions}</div>}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-slate-400 italic">None prescribed.</p>
                              )}
                            </div>

                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <FlaskConical size={12} /> Lab Tests
                              </p>
                              {visit.labTests && visit.labTests.length > 0 ? (
                                <ul className="space-y-2">
                                  {visit.labTests.map((t: any, i: number) => (
                                    <li key={i} className="flex flex-col gap-1 bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm">
                                        <div className="flex justify-between items-center">
                                          <span className="font-semibold text-slate-700">{t.testName}</span>
                                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {t.status}
                                          </span>
                                        </div>
                                        {t.resultValue && (
                                          <div className="mt-1 bg-white p-2 rounded border border-slate-100">
                                            <p className="text-sm font-bold text-slate-800">Result: <span className="text-emerald-600">{t.resultValue}</span></p>
                                            {t.remarks && <p className="text-xs text-slate-500 mt-0.5">Remarks: {t.remarks}</p>}
                                          </div>
                                        )}
                                        {t.documentUrl && (
                                        <button onClick={() => setDocUrl(t.documentUrl)}
                                           className="text-[10px] font-bold text-blue-600 hover:underline mt-1 text-left">
                                          View Document
                                        </button>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-slate-400 italic">No lab tests ordered.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {docUrl && (
        <DocumentViewerModal url={docUrl} onClose={() => setDocUrl(null)} />
      )}
    </div>
  );
}
