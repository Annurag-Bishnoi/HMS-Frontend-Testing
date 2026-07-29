import { useEffect, useState } from 'react';
import { Stethoscope, LogOut, CheckCircle, Clock, FileText } from 'lucide-react';
import { getDoctorAdmissions, addDailyRound, getDailyRounds, dischargePatient, getNursingCharts } from '../../../api/ipdService';

function DailyRoundModal({ admission, onClose, onDischarge }: { admission: any; onClose: () => void; onDischarge: () => void }) {
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rounds, setRounds] = useState<any[]>([]);
  const [charts, setCharts] = useState<any[]>([]);

  const [dischargeSummary, setDischargeSummary] = useState('');

  useEffect(() => {
    getDailyRounds(admission.id).then(setRounds).catch(console.error);
    getNursingCharts(admission.id).then(setCharts).catch(console.error);
  }, [admission.id]);

  const handleAddRound = async () => {
    if (!notes.trim()) return;
    try {
      setSubmitting(true);
      await addDailyRound(admission.id, notes);
      const updated = await getDailyRounds(admission.id);
      setRounds(updated);
      setNotes('');
    } catch (e) {
      console.error(e);
      alert('Failed to add round notes');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDischarge = async () => {
    if (!dischargeSummary.trim()) {
      alert("Please provide a discharge summary.");
      return;
    }
    try {
      setSubmitting(true);
      await dischargePatient(admission.id, dischargeSummary);
      onDischarge();
    } catch (e) {
      console.error(e);
      alert('Failed to discharge patient');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl flex max-h-[90vh] overflow-hidden shadow-2xl flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl text-slate-800">IPD Patient Management</h3>
            <p className="text-sm text-slate-500">Patient: {admission.patientName} • Bed: {admission.bedNumber} ({admission.wardName})</p>
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300">Close</button>
        </div>
        


        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-8">
          
          {/* Rounds Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Stethoscope className="text-emerald-500" size={20} /> Clinical Notes (Rounds)
            </h4>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">New Round Note</label>
                <textarea 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)} 
                  className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 resize-none focus:ring-2 focus:ring-emerald-500 outline-none h-32" 
                  placeholder="Enter clinical notes, progress, and new orders..."
                ></textarea>
                <div className="mt-3 flex justify-end">
                  <button onClick={handleAddRound} disabled={submitting || !notes.trim()} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                    {submitting ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col space-y-3 max-h-60 overflow-y-auto pr-2">
                <label className="text-sm font-bold text-slate-700">Past Notes</label>
                {rounds.length === 0 ? <p className="text-sm text-slate-500">No notes yet.</p> : rounds.map(r => (
                  <div key={r.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800">Dr. {r.doctorName}</span>
                      <span className="text-xs font-bold text-slate-400">{new Date(r.roundDate).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-600 whitespace-pre-wrap">{r.clinicalNotes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vitals Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Nursing Vitals</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {charts.length === 0 ? <p className="text-sm text-slate-500">No vitals recorded by nurses yet.</p> : charts.map(h => (
                <div key={h.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-indigo-600">Nurse: {h.nurseName}</span>
                    <span className="text-xs font-bold text-slate-400">{new Date(h.recordedAt).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 bg-white p-3 rounded-lg border border-slate-100">
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Temp</span><span className="font-bold text-slate-800">{h.temperature ? `${h.temperature} °F` : '-'}</span></div>
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold mb-1">BP</span><span className="font-bold text-slate-800">{h.bloodPressure || '-'}</span></div>
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold mb-1">HR</span><span className="font-bold text-slate-800">{h.heartRate ? `${h.heartRate} bpm` : '-'}</span></div>
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold mb-1">SpO2</span><span className="font-bold text-slate-800">{h.spo2 ? `${h.spo2} %` : '-'}</span></div>
                  </div>
                  {h.nursingNotes && <p className="text-slate-600 mt-2 text-sm italic">Notes: {h.nursingNotes}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Discharge Section */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <LogOut className="text-amber-500" /> Discharge Patient
            </h4>
            <p className="text-sm text-slate-600 mb-4">
              Discharging this patient will release the bed and automatically generate the final IPD Bill for their stay. This action cannot be undone.
            </p>
            
            <label className="block text-sm font-bold text-slate-700 mb-2">Discharge Summary <span className="text-red-500">*</span></label>
            <textarea 
              value={dischargeSummary} 
              onChange={e => setDischargeSummary(e.target.value)} 
              className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 resize-none focus:ring-2 focus:ring-amber-500 outline-none h-24 mb-4" 
              placeholder="Final diagnosis, condition on discharge, medications to take home, follow-up instructions..."
            ></textarea>
            
            <div className="flex justify-end">
              <button onClick={handleDischarge} disabled={submitting || !dischargeSummary.trim()} className="px-6 py-2.5 font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow disabled:opacity-50 flex items-center gap-2">
                Confirm Discharge
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function DoctorIPDDashboard() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getDoctorAdmissions();
      // Only show currently admitted patients for management
      setAdmissions(data.filter((a: any) => a.status === 'ADMITTED'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDischargeSuccess = () => {
    setSelectedAdmission(null);
    fetchData(); // Refresh the list
  };

  if (loading && admissions.length === 0) {
    return <div className="p-6 text-slate-500">Loading IPD patients...</div>;
  }

  return (
    <div className="p-6 space-y-8 max-h-screen overflow-y-auto bg-slate-50">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Admitted Patients</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your IPD patients, record daily rounds, and process discharges.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {admissions.map(a => (
          <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{a.patientName}</h3>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">{a.bedNumber} • {a.wardName}</p>
              </div>
            </div>
            
            <div className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
              <span className="font-semibold text-slate-700">Admission Diagnosis:</span> {a.admissionDiagnosis}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1"><Clock size={12}/> Admitted: {new Date(a.admissionDate).toLocaleDateString()}</span>
            </div>

            <button 
              onClick={() => setSelectedAdmission(a)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Stethoscope size={16} />
              Manage Patient
            </button>
          </div>
        ))}
        {admissions.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
            You currently have no admitted patients.
          </div>
        )}
      </div>

      {selectedAdmission && (
        <DailyRoundModal 
          admission={selectedAdmission} 
          onClose={() => setSelectedAdmission(null)} 
          onDischarge={handleDischargeSuccess}
        />
      )}
    </div>
  );
}
