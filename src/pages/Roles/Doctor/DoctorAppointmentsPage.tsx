import { useEffect, useState, useMemo } from 'react';
import {
  Calendar, Clock, CheckCircle, XCircle, AlertCircle,
  Stethoscope, ChevronRight, RefreshCw, Search, Filter, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDoctorAppointments, getDoctorQueue } from '../../../api/appointmentService';
import { getDoctorByUserId } from '../../../api/doctorService';
import { getUser } from '../../../utils/token';
import PatientHistoryModal from '../../../components/common/PatientHistoryModal';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  SCHEDULED:       { label: 'Scheduled',         bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  CONFIRMED:       { label: 'Confirmed',          bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-500' },
  READY_FOR_DOCTOR:{ label: 'Ready for Doctor',   bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  IN_CONSULTATION: { label: 'In Consultation',    bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-500' },
  COMPLETED:       { label: 'Completed',          bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED:       { label: 'Cancelled',          bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500' },
  NO_SHOW:         { label: 'No Show',            bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400' },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? { label: status, bg: 'bg-slate-50', text: 'text-slate-700', dot: 'bg-slate-400' };

const FILTERS = ['ALL', 'TODAY', 'UPCOMING', 'COMPLETED', 'READY_FOR_DOCTOR', 'CANCELLED'];

export default function DoctorAppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  
  // History Modal State
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState('');

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const user = getUser();
      if (!user) return;
      const doc = await getDoctorByUserId(String(user.userId));
      if (doc) {
        const id = String(doc.id);
        setDoctorId(id);
        const [all, q] = await Promise.all([
          getDoctorAppointments(id, false),
          getDoctorQueue(id),
        ]);
        setAppointments(Array.isArray(all) ? all : []);
        setQueue(Array.isArray(q) ? q : []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let list = [...appointments];
    if (activeFilter === 'TODAY') {
      list = list.filter(a => a.appointmentDate === todayStr);
    } else if (activeFilter === 'UPCOMING') {
      list = list.filter(a => a.appointmentDate > todayStr && (a.status === 'SCHEDULED' || a.status === 'CONFIRMED'));
    } else if (activeFilter !== 'ALL') {
      list = list.filter(a => a.status === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.patientName?.toLowerCase().includes(q) ||
        a.reasonForVisit?.toLowerCase().includes(q) ||
        a.appointmentDate?.includes(q)
      );
    }
    return list.sort((a, b) => {
      const da = a.appointmentDate || '';
      const db = b.appointmentDate || '';
      return db.localeCompare(da);
    });
  }, [appointments, activeFilter, search]);

  // Metrics
  const totalToday   = appointments.filter(a => a.appointmentDate === todayStr).length;
  const completedToday = appointments.filter(a => a.appointmentDate === todayStr && a.status === 'COMPLETED').length;
  const upcoming     = appointments.filter(a => a.appointmentDate > todayStr && (a.status === 'SCHEDULED' || a.status === 'CONFIRMED')).length;
  const waiting      = queue.length;

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
          <h1 className="text-3xl font-bold text-slate-800">My Appointments</h1>
          <p className="text-slate-500 mt-1">Manage your schedule and patient consultations</p>
        </div>
        <button
          onClick={init}
          className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Total",  value: totalToday,     icon: Calendar,   bg: 'bg-blue-50',    text: 'text-blue-600' },
          { label: 'Ready / Queue',  value: waiting,        icon: Clock,      bg: 'bg-amber-50',   text: 'text-amber-600' },
          { label: 'Seen Today',     value: completedToday, icon: CheckCircle,bg: 'bg-emerald-50', text: 'text-emerald-600' },
          { label: 'Upcoming',       value: upcoming,       icon: AlertCircle,bg: 'bg-purple-50',  text: 'text-purple-600' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${m.bg}`}>
              <m.icon className={m.text} size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{m.label}</p>
              <p className="text-2xl font-bold text-slate-800">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Queue Banner – only when patients are waiting */}
      {queue.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Stethoscope size={20} /> {queue.length} Patient{queue.length > 1 ? 's' : ''} Ready for Consultation
              </h3>
              <p className="text-sm text-amber-100 mt-0.5">These patients have been triaged and are waiting for you.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {queue.map(appt => (
              <button
                key={appt.id}
                onClick={() => navigate(`/doctor/workspace/${appt.id}`)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border border-white/30"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {appt.patientName}
                <span className="text-amber-200 text-xs">#{appt.tokenNumber || appt.id}</span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name, reason, or date…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-slate-400 shrink-0" />
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'READY_FOR_DOCTOR' ? 'Ready' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium">No appointments found for this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Patient</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Date & Time</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Reason</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(appt => {
                  const cfg = getStatusConfig(appt.status);
                  const isToday = appt.appointmentDate === todayStr;
                  const canConsult = appt.status === 'READY_FOR_DOCTOR' || appt.status === 'IN_CONSULTATION';
                  return (
                    <tr key={appt.id} className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${isToday ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div>
                          <button 
                            onClick={() => { setSelectedPatientId(String(appt.patientId)); setSelectedPatientName(appt.patientName); }}
                            className="font-semibold text-slate-800 hover:text-blue-600 hover:underline text-left flex items-center gap-1"
                          >
                            {appt.patientName} <FileText size={12} className="text-slate-400" />
                          </button>
                          <div className="text-xs text-slate-500 mt-0.5">ID #{appt.patientId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">
                          {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          {isToday && <span className="ml-2 text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">TODAY</span>}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock size={12} /> {appt.appointmentTime || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {appt.consultationType || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 truncate max-w-[150px] inline-block" title={appt.reasonForVisit}>
                          {appt.reasonForVisit || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {canConsult ? (
                          <button
                            onClick={() => navigate(`/doctor/workspace/${appt.id}`)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Stethoscope size={13} /> Start
                          </button>
                        ) : appt.status === 'COMPLETED' ? (
                          <span className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle size={14} /> Done
                          </span>
                        ) : appt.status === 'CANCELLED' ? (
                          <span className="flex items-center justify-center gap-1 text-xs text-red-400 font-medium">
                            <XCircle size={14} /> Cancelled
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Awaiting</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer count */}
      <p className="text-xs text-slate-400 text-right pb-2">
        Showing {filtered.length} of {appointments.length} appointments
      </p>

      {selectedPatientId && (
        <PatientHistoryModal
          patientId={selectedPatientId}
          patientName={selectedPatientName}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
}
