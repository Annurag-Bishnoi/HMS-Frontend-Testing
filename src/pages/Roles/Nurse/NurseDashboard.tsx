import { useEffect, useState } from 'react';
import { Activity, Clock, Search, Filter } from 'lucide-react';
import { getAppointments } from '../../../api/appointmentService';
import type { Appointment } from '../../../types/appointment';
import TriageVitalsModal from '../../../components/admin/appointments/TriageVitalsModal';
import { getUser } from '../../../utils/token';

export default function NurseDashboard() {
  const [opdAppointments, setOpdAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpd, setSelectedOpd] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const user = getUser();

  useEffect(() => {
    fetchData();
  }, [selectedOpd]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appointments = await getAppointments();
      const todayStr = new Date().toISOString().split('T')[0];
      
      const todayOpd = appointments.filter(a => a.appointmentDate === todayStr && a.status !== 'CANCELLED');
      const activeOpd = todayOpd.filter(a => ['SCHEDULED', 'CONFIRMED', 'WAITING_FOR_VITALS'].includes(a.status));
      
      setOpdAppointments(activeOpd);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpd = opdAppointments.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.tokenNumber && a.tokenNumber.toString().includes(searchTerm))
  );

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto bg-slate-50/50">
      
      {/* Welcome Block */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Activity size={120} />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.fullName || user?.username || 'Nurse'}!
          </h1>
          <p className="text-blue-100 mt-2 max-w-xl">
            You have {opdAppointments.length} patients in the queue waiting for vitals today.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Today's Queue</h2>
        <p className="text-slate-500 text-sm mt-1">Record vitals for active OPD patients before they see the doctor.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by patient, doctor, token..." 
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
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      Loading queue...
                    </div>
                  </td>
                </tr>
              ) : filteredOpd.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No patients currently waiting for vitals.
                  </td>
                </tr>
              ) : (
                filteredOpd.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {a.patientName}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">
                      {a.tokenNumber || '-'}
                    </td>
                    <td className="px-6 py-4">
                      Dr. {a.doctorName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={14} />
                        {a.appointmentTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${a.status === 'SCHEDULED' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                        {a.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOpd(a)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-medium transition-colors text-xs"
                      >
                        <Activity size={14} />
                        Record Vitals
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOpd && (
        <TriageVitalsModal
          appointmentId={selectedOpd.id}
          patientName={selectedOpd.patientName}
          onClose={() => setSelectedOpd(null)}
          onSuccess={() => {
            setSelectedOpd(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
