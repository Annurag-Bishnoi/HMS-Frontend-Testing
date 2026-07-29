import { useEffect, useState } from 'react';
import { Activity, Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import { getAdmissionsByStatus, addNursingChart, getNursingCharts } from '../../../api/ipdService';

function NursingChartModal({ admission, onClose }: { admission: any; onClose: () => void }) {
  const [temp, setTemp] = useState('');
  const [bp, setBp] = useState('');
  const [hr, setHr] = useState('');
  const [spo2, setSpo2] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    getNursingCharts(admission.id).then(setHistory).catch(console.error);
  }, [admission.id]);

  const handleSubmit = async () => {
    if (!temp && !bp && !hr && !spo2 && !notes) return;
    try {
      setSubmitting(true);
      await addNursingChart(admission.id, {
        temperature: temp ? parseFloat(temp) : null,
        bloodPressure: bp,
        heartRate: hr ? parseInt(hr) : null,
        spo2: spo2 ? parseInt(spo2) : null,
        nursingNotes: notes
      });
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to save charts');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl flex max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* Left side: Form */}
        <div className="w-1/2 flex flex-col border-r border-slate-200">
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-lg text-slate-800">Add Nursing Chart</h3>
            <p className="text-sm text-slate-500">Patient: {admission.patientName} • Bed: {admission.bedNumber}</p>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Temp (°F)</label>
                <input type="number" step="0.1" value={temp} onChange={e => setTemp(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="e.g. 98.6" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Blood Pressure</label>
                <input type="text" value={bp} onChange={e => setBp(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="e.g. 120/80" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Heart Rate</label>
                <input type="number" value={hr} onChange={e => setHr(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="e.g. 72" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SpO2 (%)</label>
                <input type="number" value={spo2} onChange={e => setSpo2(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="e.g. 98" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nursing Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 resize-none" placeholder="Add observations..."></textarea>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow hover:bg-emerald-700">Save Chart</button>
          </div>
        </div>

        {/* Right side: History */}
        <div className="w-1/2 flex flex-col bg-slate-50">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-bold text-lg text-slate-800">Chart History</h3>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {history.length === 0 ? (
              <p className="text-slate-500 italic text-sm text-center mt-10">No charts recorded yet.</p>
            ) : (
              history.map(h => (
                <div key={h.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-indigo-600">{h.nurseName}</span>
                    <span className="text-xs font-bold text-slate-400">{new Date(h.recordedAt).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-2 bg-slate-50 p-2 rounded">
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold">Temp</span><span className="font-semibold">{h.temperature || '-'}</span></div>
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold">BP</span><span className="font-semibold">{h.bloodPressure || '-'}</span></div>
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold">HR</span><span className="font-semibold">{h.heartRate || '-'}</span></div>
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold">SpO2</span><span className="font-semibold">{h.spo2 || '-'}</span></div>
                  </div>
                  {h.nursingNotes && <p className="text-slate-600 mt-2 border-t pt-2 border-slate-100">{h.nursingNotes}</p>}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function NurseIPDDashboard() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [selectedAdmission]); // refresh when modal closes

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAdmissionsByStatus('ADMITTED');
      setAdmissions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && admissions.length === 0) {
    return <div className="p-6 text-slate-500">Loading IPD patients...</div>;
  }

  return (
    <div className="p-6 space-y-8 max-h-screen overflow-y-auto bg-slate-50">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">IPD Nursing Station</h1>
        <p className="text-slate-500 text-sm mt-1">Manage admitted patients and record shift vitals.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {admissions.map(a => (
          <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{a.patientName}</h3>
                <p className="text-xs font-bold text-indigo-600 mt-0.5">{a.bedNumber} • {a.wardName}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                Admitted
              </span>
            </div>
            
            <div className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
              <span className="font-semibold text-slate-700">Diagnosis:</span> {a.admissionDiagnosis}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
              <span>Dr. {a.doctorName}</span>
              <span className="flex items-center gap-1"><Clock size={12}/> Since {new Date(a.admissionDate).toLocaleDateString()}</span>
            </div>

            <button 
              onClick={() => setSelectedAdmission(a)}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Activity size={16} />
              Open Nursing Chart
            </button>
          </div>
        ))}
        {admissions.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
            No patients currently admitted in the wards.
          </div>
        )}
      </div>

      {selectedAdmission && (
        <NursingChartModal 
          admission={selectedAdmission} 
          onClose={() => setSelectedAdmission(null)} 
        />
      )}
    </div>
  );
}
