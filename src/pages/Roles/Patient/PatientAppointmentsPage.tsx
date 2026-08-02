import { useEffect, useState, useMemo } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, RefreshCw, Search, Filter, Stethoscope } from 'lucide-react';
import { getUser } from '../../../utils/token';
import { getPatientByUserId } from '../../../api/patientService';
import { getAppointments } from '../../../api/appointmentService';
import DataTable, { tableHeadClass, tableRowClass, tableCellClass } from '../../../components/common/DataTable';


const STATUS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  SCHEDULED:        { label: 'Scheduled',       bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400'    },
  CONFIRMED:        { label: 'Confirmed',        bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-400'  },
  READY_FOR_DOCTOR: { label: 'Ready for Doctor', bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  IN_CONSULTATION:  { label: 'In Consultation',  bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-400'  },
  COMPLETED:        { label: 'Completed',         bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  CANCELLED:        { label: 'Cancelled',         bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400'     },
};
const badge = (s?: string) => STATUS[s ?? 'SCHEDULED'] ?? STATUS.SCHEDULED;

const FILTERS = ['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const;

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<typeof FILTERS[number]>('ALL');

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      const user = getUser();
      if (!user?.userId) return;
      const patient = await getPatientByUserId(String(user.userId));
      const all = await getAppointments();
      const mine = Array.isArray(all)
        ? all.filter((a: any) => String(a.patientId) === String(patient.patientId))
            .sort((a: any, b: any) => (b.appointmentDate || '').localeCompare(a.appointmentDate || ''))
        : [];
      setAppointments(mine);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let list = [...appointments];
    if (filter === 'UPCOMING') list = list.filter(a => (a.appointmentDate || '') >= todayStr && a.status !== 'CANCELLED' && a.status !== 'COMPLETED');
    else if (filter !== 'ALL') list = list.filter(a => a.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.doctorName?.toLowerCase().includes(q) || a.reasonForVisit?.toLowerCase().includes(q) || a.appointmentDate?.includes(q));
    }
    return list;
  }, [appointments, filter, search]);

  const upcoming = appointments.filter(a => (a.appointmentDate || '') >= todayStr && a.status !== 'CANCELLED' && a.status !== 'COMPLETED').length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-64px)]"><RefreshCw className="animate-spin text-teal-600" size={32} /></div>;

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Appointments</h1>
          <p className="text-slate-500 mt-1">All your scheduled and past hospital visits</p>
        </div>
        <button onClick={init} className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 shadow-sm transition">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',    value: appointments.length, bg: 'bg-blue-50',    text: 'text-blue-600',    icon: Calendar    },
          { label: 'Upcoming', value: upcoming,            bg: 'bg-amber-50',   text: 'text-amber-600',   icon: Clock       },
          { label: 'Completed',value: completed,           bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg}`}><s.icon className={s.text} size={22} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by doctor, reason, date…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400 shrink-0" />
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${filter === f ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium">No appointments found.</p>
          </div>
        ) : (
          <DataTable>
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>Date & Time</th>
                <th className={tableHeadClass}>Doctor</th>
                <th className={tableHeadClass}>Type</th>
                <th className={tableHeadClass}>Reason</th>
                <th className={tableHeadClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const cfg = badge(a.status);
                const isToday = a.appointmentDate === todayStr;
                return (
                  <tr key={a.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${isToday ? 'bg-teal-50/30' : ''}`}>
                    <td className={tableCellClass}>
                      <p className="font-semibold text-slate-800">
                        {a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        {isToday && <span className="ml-2 text-[10px] bg-teal-100 text-teal-700 font-bold px-1.5 rounded">TODAY</span>}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.appointmentTime || '—'}</p>
                    </td>
                    <td className={tableCellClass}>
                      <div>
                        <p className="font-semibold text-slate-800">{a.doctorName || '—'}</p>
                        <p className="text-xs text-slate-400">{a.department || ''}</p>
                      </div>
                    </td>
                    <td className={tableCellClass}><span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded">{a.consultationType || 'OPD'}</span></td>
                    <td className="px-6 py-4 text-slate-600 max-w-[150px] truncate">{a.reasonForVisit || '—'}</td>
                    <td className={tableCellClass}>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        )}
      </div>
      <p className="text-xs text-slate-400 text-right">Showing {filtered.length} of {appointments.length} appointments</p>
    </div>
  );
}
