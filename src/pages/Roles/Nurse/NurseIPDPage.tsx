import { useEffect, useState } from 'react';
import { Activity, Clock, HeartPulse, Thermometer, FileText, X, Search, Filter } from 'lucide-react';
import { getAdmissionsByStatus, addNursingChart, getNursingCharts } from '../../../api/ipdService';

function NursingChartModal({ admission, onClose }: { admission: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    systolicBP: '',
    diastolicBP: '',
    heartRate: '',
    temperature: '',
    spo2: '',
    nursingNotes: ''
  });

  useEffect(() => {
    getNursingCharts(admission.id).then(setHistory).catch(console.error);
  }, [admission.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.temperature && !formData.systolicBP && !formData.diastolicBP && !formData.heartRate && !formData.spo2 && !formData.nursingNotes) {
      setError("Please fill at least one field.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      const bpString = (formData.systolicBP || formData.diastolicBP) 
        ? `${formData.systolicBP || '--'}/${formData.diastolicBP || '--'}`
        : undefined;

      await addNursingChart(admission.id, {
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        bloodPressure: bpString,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
        spo2: formData.spo2 ? parseInt(formData.spo2) : undefined,
        nursingNotes: formData.nursingNotes || undefined
      });
      
      const newHistory = await getNursingCharts(admission.id);
      setHistory(newHistory);
      
      setFormData({
        systolicBP: '',
        diastolicBP: '',
        heartRate: '',
        temperature: '',
        spo2: '',
        nursingNotes: ''
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to save nursing chart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-5xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="w-full md:w-1/2 flex flex-col border-r border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Add Nursing Chart</h3>
                <p className="text-sm text-slate-500">IPD Patient: <span className="font-semibold text-slate-700">{admission.patientName}</span></p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors md:hidden">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
            
            <form id="ipd-vitals-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <HeartPulse size={16} className="text-rose-500" />
                    Blood Pressure (mmHg)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input type="number" name="systolicBP" value={formData.systolicBP} onChange={handleChange} placeholder="Systolic (e.g. 120)" className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm" />
                    </div>
                    <span className="text-slate-400 font-medium">/</span>
                    <div className="flex-1 relative">
                      <input type="number" name="diastolicBP" value={formData.diastolicBP} onChange={handleChange} placeholder="Diastolic (e.g. 80)" className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <HeartPulse size={16} className="text-rose-500" />
                    Heart Rate (bpm)
                  </label>
                  <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} placeholder="e.g. 72" className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Thermometer size={16} className="text-orange-500" />
                    Temperature (°F)
                  </label>
                  <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="e.g. 98.6" className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" />
                    SpO2 (%)
                  </label>
                  <input type="number" name="spo2" value={formData.spo2} onChange={handleChange} placeholder="e.g. 98" className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm" />
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText size={16} className="text-slate-500" />
                    Nursing Notes
                  </label>
                  <textarea name="nursingNotes" value={formData.nursingNotes} onChange={handleChange} placeholder="Any observed symptoms, medication given..." rows={3} className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm resize-none" />
                </div>
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors">Cancel</button>
            <button type="submit" form="ipd-vitals-form" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
              {loading ? 'Saving...' : 'Save Chart'}
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col bg-slate-50 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors hidden md:block">
            <X size={20} />
          </button>
          <div className="px-6 py-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
            <h3 className="font-bold text-lg text-slate-800">Chart History</h3>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {history.length === 0 ? (
              <p className="text-slate-500 italic text-sm text-center mt-10">No charts recorded yet.</p>
            ) : (
              history.map(h => (
                <div key={h.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-indigo-600">{h.nurseName}</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{new Date(h.recordedAt).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold mb-0.5">Temp</span><span className="font-semibold text-slate-700">{h.temperature || '-'}</span></div>
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold mb-0.5">BP</span><span className="font-semibold text-slate-700">{h.bloodPressure || '-'}</span></div>
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold mb-0.5">HR</span><span className="font-semibold text-slate-700">{h.heartRate || '-'}</span></div>
                    <div><span className="block text-[10px] uppercase text-slate-500 font-bold mb-0.5">SpO2</span><span className="font-semibold text-slate-700">{h.spo2 || '-'}</span></div>
                  </div>
                  {h.nursingNotes && <p className="text-slate-600 mt-2 border-t pt-3 border-slate-100 text-sm leading-relaxed">{h.nursingNotes}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NurseIPDPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedAdmission]);

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

  const filteredAdmissions = admissions.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.wardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.bedNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto bg-slate-50/50">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">IPD Patients</h1>
        <p className="text-slate-500 text-sm mt-1">Manage and record charts for currently admitted patients.</p>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, ward, bed..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Bed & Ward</th>
                <th className="px-6 py-4">Attending Doctor</th>
                <th className="px-6 py-4">Admitted Since</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      Loading patients...
                    </div>
                  </td>
                </tr>
              ) : filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No admitted patients found.
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {a.patientName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-600">{a.bedNumber}</span>
                        <span className="text-slate-500">•</span>
                        <span>{a.wardName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      Dr. {a.doctorName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={14} />
                        {new Date(a.admissionDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedAdmission(a)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg font-medium transition-colors text-xs"
                      >
                        <Activity size={14} />
                        Manage Chart
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
