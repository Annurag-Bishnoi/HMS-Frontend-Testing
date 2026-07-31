import { useEffect, useState } from 'react';
import { FileText, X, Clock, Search, Filter } from 'lucide-react';
import { getAppointments } from '../../../api/appointmentService';
import { getVitalsByAppointment } from '../../../api/vitalsService';
import type { Appointment } from '../../../types/appointment';

function OPDHistoryModal({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) {
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVitalsByAppointment(appointment.id)
      .then(setVitals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appointment.id]);

  const groupedVitals = vitals.reduce((acc: any, v: any) => {
    const time = new Date(v.recordedAt).toLocaleString();
    if (!acc[time]) acc[time] = [];
    acc[time].push(v);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg text-slate-800">OPD Vitals History</h3>
            <p className="text-sm text-slate-500">{appointment.patientName} • Dr. {appointment.doctorName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto bg-slate-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
              <p className="text-slate-500 font-medium text-sm">Loading vitals...</p>
            </div>
          ) : vitals.length === 0 ? (
            <div className="text-center py-10 text-slate-500 italic">No vitals found for this visit.</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedVitals).map(([time, items]: [string, any]) => (
                <div key={time} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Clock size={14} /> Recorded At</span>
                    <span className="text-sm font-bold text-indigo-600">{time}</span>
                  </div>
                  <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map((v: any) => (
                      <div key={v.vitalId} className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{v.conceptName}</span>
                        <span className="font-semibold text-slate-700 text-sm">
                          {v.vitalValue} {v.unit && <span className="text-xs text-slate-400 font-medium ml-0.5">{v.unit}</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NurseOPDHistoryPage() {
  const [opdHistory, setOpdHistory] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewHistoryOpd, setViewHistoryOpd] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appointments = await getAppointments();
      const todayStr = new Date().toISOString().split('T')[0];
      
      const todayOpd = appointments.filter(a => a.appointmentDate === todayStr && a.status !== 'CANCELLED');
      const pastOpd = todayOpd.filter(a => ['READY_FOR_DOCTOR', 'IN_CONSULTATION', 'WAITING_FOR_LABS', 'COMPLETED'].includes(a.status));
      
      setOpdHistory(pastOpd);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = opdHistory.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto bg-slate-50/50">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">OPD History</h1>
        <p className="text-slate-500 text-sm mt-1">View vitals for today's OPD patients that have already been recorded.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by patient or doctor..." 
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Token</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      Loading history...
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No OPD history for today.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {a.patientName}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">
                      {a.tokenNumber || '-'}
                    </td>
                    <td className="px-6 py-4">
                      Dr. {a.doctorName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        {a.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setViewHistoryOpd(a)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors text-xs"
                      >
                        <FileText size={14} />
                        View Vitals
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewHistoryOpd && (
        <OPDHistoryModal
          appointment={viewHistoryOpd}
          onClose={() => setViewHistoryOpd(null)}
        />
      )}
    </div>
  );
}
