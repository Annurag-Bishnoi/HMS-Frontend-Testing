import { useEffect, useState } from 'react';
import {
  UserPlus, CalendarCheck, Clock,
  CheckCircle, ArrowRight, Activity, CalendarPlus, Search,
  Stethoscope, RefreshCw, FlaskConical, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAppointments } from '../../api/appointmentService';
import { getUser } from '../../utils/token';
import DataTable, { tableHeadClass, tableRowClass, tableCellClass } from '../../components/common/DataTable';

/* ─── Unified status config ─── */
const STATUS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  SCHEDULED:          { label: 'Awaiting Payment',      bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400'    },
  CONFIRMED:          { label: 'Confirmed',              bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-400'  },
  WAITING_FOR_VITALS: { label: 'Awaiting Vitals',       bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-400'  },
  READY_FOR_DOCTOR:   { label: 'Ready for Doctor',      bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  IN_CONSULTATION:    { label: 'In Consultation',       bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-400'  },
  WAITING_FOR_LABS:   { label: 'Waiting for Lab',       bg: 'bg-cyan-50',    text: 'text-cyan-700',    dot: 'bg-cyan-400'    },
  COMPLETED:          { label: 'Completed',             bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  CANCELLED:          { label: 'Cancelled',             bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400'     },
};
const badge = (s?: string) => STATUS[s ?? 'SCHEDULED'] ?? STATUS.SCHEDULED;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const user = getUser();
  const basePath = user?.role === "RECEPTIONIST" ? "/receptionist" : "/admin";

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const appts = await getAppointments();
      setAppointments(Array.isArray(appts) ? appts : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  /* ── Derived stats ── */
  const todayAppts    = appointments.filter(a => a.appointmentDate === todayStr);
  const awaitingAction = todayAppts.filter(a => ['SCHEDULED', 'CONFIRMED', 'WAITING_FOR_VITALS'].includes(a.status));
  const withDoctor    = todayAppts.filter(a => ['READY_FOR_DOCTOR', 'IN_CONSULTATION', 'WAITING_FOR_LABS'].includes(a.status));
  const completedToday = todayAppts.filter(a => a.status === 'COMPLETED');

  /* Today's queue filtered by search, sorted by time */
  const filteredQueue = todayAppts.filter(a =>
    a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    a.reasonForVisit?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const ta = a.tokenNumber ?? 9999;
    const tb = b.tokenNumber ?? 9999;
    return ta - tb || (a.appointmentTime || '').localeCompare(b.appointmentTime || '');
  });

  /* Smart action per status */
  const getAction = (appt: any) => {
    switch (appt.status) {
      case 'WAITING_FOR_VITALS':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600"><Activity size={12} /> Awaiting Vitals (Nurse)</span>;
      case 'READY_FOR_DOCTOR':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600"><Stethoscope size={12} /> With Doctor</span>;
      case 'IN_CONSULTATION':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600"><Stethoscope size={12} /> In Consultation</span>;
      case 'WAITING_FOR_LABS':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600"><FlaskConical size={12} /> Awaiting Labs</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><CheckCircle size={12} /> Done</span>;
      case 'CANCELLED':
        return <span className="text-xs text-red-500 font-medium">Cancelled</span>;
      default:
        return <span className="text-xs text-slate-400">{appt.status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <Activity className="animate-spin text-indigo-600" size={36} />
          <p className="text-slate-500 text-sm font-medium">Loading front desk…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">

      {/* ── Welcome Banner ── */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{greeting()},</p>
            <h1 className="text-2xl md:text-3xl font-bold">{user?.name || 'Receptionist'}</h1>
            <p className="text-slate-400 mt-1 text-sm">Front Desk • Reception</p>
            <p className="text-slate-500 text-xs mt-1">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="bg-slate-800 rounded-2xl px-4 py-3 text-center min-w-[80px]">
              <p className="text-2xl font-bold text-white">{todayAppts.length}</p>
              <p className="text-slate-400 text-xs">Today's Appts</p>
            </div>
            <div className="bg-slate-800 rounded-2xl px-4 py-3 text-center min-w-[80px]">
              <p className="text-2xl font-bold text-orange-400">{awaitingAction.length}</p>
              <p className="text-slate-400 text-xs">Need Action</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Appointments", value: todayAppts.length,       icon: CalendarCheck, bg: 'bg-blue-50',    text: 'text-blue-600',    action: () => navigate(`${basePath}/appointments`) },
          { label: 'Awaiting Action',       value: awaitingAction.length,  icon: AlertCircle,   bg: 'bg-orange-50',  text: 'text-orange-600',  action: () => navigate(`${basePath}/appointments`) },
          { label: 'With Doctor / Labs',    value: withDoctor.length,      icon: Stethoscope,   bg: 'bg-purple-50',  text: 'text-purple-600',  action: () => navigate(`${basePath}/appointments`) },
          { label: 'Completed Today',       value: completedToday.length,  icon: CheckCircle,   bg: 'bg-emerald-50', text: 'text-emerald-600', action: () => navigate(`${basePath}/appointments`) },
        ].map(s => (
          <button
            key={s.label}
            onClick={s.action}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
          >
            <div className={`p-3 rounded-xl ${s.bg}`}>
              <s.icon className={s.text} size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium leading-tight">{s.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{s.value}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Register New Patient', desc: 'Add a new patient and book appointment', icon: UserPlus, color: 'from-slate-600 to-slate-700', path: `${basePath}/patients/add` },
          { label: 'Book Appointment',     desc: 'Schedule a doctor appointment',          icon: CalendarPlus, color: 'from-slate-600 to-slate-700', path: `${basePath}/appointments/add` },
          { label: 'IPD Bed Manager',      desc: 'Assign beds for admitted patients',      icon: Activity, color: 'from-slate-600 to-slate-700', path: `${basePath}/ipd-beds` },
        ].map(n => (
          <button
            key={n.label}
            onClick={() => navigate(n.path)}
            className="bg-white rounded-2xl border border-slate-100 p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group shadow-sm"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${n.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
              <n.icon size={22} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">{n.label}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.desc}</p>
            <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-slate-600">
              Open <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      {/* ── Today's Patient Flow ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center gap-4 flex-wrap">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="text-slate-500" size={20} />
            Today's Patient Flow
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search patient…"
                className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50 w-44"
              />
            </div>
            <button onClick={init} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <CalendarCheck size={44} className="mb-3 opacity-40" />
              <p className="font-medium">No appointments today.</p>
              <button
                onClick={() => navigate('/receptionist/appointments/add')}
                className="mt-3 text-sm text-slate-600 font-semibold hover:underline"
              >
                + Book first appointment
              </button>
            </div>
          ) : (
            <DataTable>
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className={tableHeadClass}>Token</th>
                  <th className={tableHeadClass}>Time</th>
                  <th className={tableHeadClass}>Patient</th>
                  <th className={tableHeadClass}>Doctor</th>
                  <th className={tableHeadClass}>Status</th>
                  <th className={tableHeadClass}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map(appt => {
                  const cfg = badge(appt.status);
                  return (
                    <tr key={appt.id} className={tableRowClass}>
                      <td className={`${tableCellClass} font-mono text-slate-600 font-bold text-sm`}>
                        {appt.tokenNumber ? `#${appt.tokenNumber}` : '—'}
                      </td>
                      <td className={`${tableCellClass} font-mono text-slate-700 font-medium`}>{appt.appointmentTime || '—'}</td>
                      <td className={tableCellClass}>
                        <p className="font-semibold text-slate-800 leading-tight">{appt.patientName}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[150px]">{appt.reasonForVisit || appt.consultationType}</p>
                      </td>
                      <td className={`${tableCellClass} text-slate-600 text-sm`}>{appt.doctorName || '—'}</td>
                      <td className={tableCellClass}>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className={tableCellClass}>{getAction(appt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          )}
        </div>
      </div>
    </div>
  );
}
