import { useEffect, useState } from 'react';
import {
  Users, Calendar, Activity, ClipboardList, Stethoscope,
  Clock, CheckCircle, ArrowRight, FlaskConical, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDoctorQueue, getDoctorAppointments } from '../../api/appointmentService';
import { getDoctorByUserId } from '../../api/doctorService';
import { getVisitsByDoctorId } from '../../api/visitService';
import { getDoctorAdmissions } from '../../api/ipdService';
import { getUser } from '../../utils/token';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<any[]>([]);
  const [doctorVisits, setDoctorVisits] = useState<any[]>([]);
  const [ipdPatients, setIpdPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = getUser();
      if (!user) return;
      const doc = await getDoctorByUserId(String(user.userId));
      if (doc) {
        setDoctorInfo(doc);
        const [q, visits, ipd] = await Promise.all([
          getDoctorQueue(String(doc.id)),
          getVisitsByDoctorId(String(doc.id)),
          getDoctorAdmissions()
        ]);
        setQueue(Array.isArray(q) ? q : []);
        setDoctorVisits(Array.isArray(visits) ? visits : []);
        setIpdPatients(Array.isArray(ipd) ? ipd : []);
      }
    } catch (err) {
      console.error('Error fetching doctor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = doctorVisits.filter((v: any) => {
    const d = v.visitDate ? new Date(v.visitDate).toISOString().split('T')[0] : '';
    return d === todayStr;
  }).length;
  const uniquePatients = new Set(doctorVisits.map((v: any) => String(v.patientId))).size;

  // Split queue: returned from labs vs. first-time ready
  const labReturnQueue = queue.filter((a: any) => {
    // Patients who have lab tests that are all completed — returned after labs
    const hasCompletedLabs = a.labTests && a.labTests.length > 0 &&
      a.labTests.every((lt: any) => lt.status === 'COMPLETED');
    return hasCompletedLabs;
  });
  const freshQueue = queue.filter((a: any) => !labReturnQueue.includes(a));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <Activity className="animate-spin text-blue-600" size={36} />
          <p className="text-slate-500 text-sm font-medium">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  const user = getUser();

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">

      {/* ── Welcome Banner ── */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm flex justify-between items-start gap-4 flex-wrap">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{greeting()},</p>
          <h1 className="text-2xl md:text-3xl font-bold">
            Dr. {doctorInfo?.name || user?.name || 'Doctor'}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-300">
            <span className="font-medium">{doctorInfo?.specialization || 'Physician'}</span>
            {doctorInfo?.department && (
              <>
                <span className="text-slate-500">•</span>
                <span>{doctorInfo.department}</span>
              </>
            )}
          </div>
          <p className="text-slate-500 text-xs mt-3">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="shrink-0 text-center bg-slate-800 rounded-2xl px-6 py-3 border border-slate-700">
          <p className="text-3xl font-bold text-white">{queue.length}</p>
          <p className="text-slate-400 text-xs font-medium mt-0.5">
            {queue.length === 1 ? 'Patient waiting' : 'Patients waiting'}
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'In Queue',     value: queue.length,        icon: Clock,       bg: 'bg-amber-50',   text: 'text-amber-600',   action: () => navigate('/doctor/appointments') },
          { label: 'Seen Today',   value: completedToday,      icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-600', action: () => navigate('/doctor/appointments') },
          { label: 'Total Visits', value: doctorVisits.length, icon: Calendar,    bg: 'bg-blue-50',    text: 'text-blue-600',    action: () => navigate('/doctor/appointments') },
          { label: 'My Patients',  value: uniquePatients,      icon: Users,       bg: 'bg-purple-50',  text: 'text-purple-600',  action: () => navigate('/doctor/patients') },
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
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{s.value}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* ── Quick Nav ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'My Appointments', desc: 'Full schedule & start consultation', icon: Calendar,   color: 'from-blue-500 to-blue-600',    path: '/doctor/appointments' },
          { label: 'My Patients',     desc: 'All treated patients & full history', icon: Users,      color: 'from-purple-500 to-purple-600', path: '/doctor/patients' },
          { label: 'Prescriptions',   desc: 'All issued prescriptions',            icon: Stethoscope,color: 'from-emerald-500 to-emerald-600', path: '/doctor/prescriptions' },
        ].map(n => (
          <button
            key={n.label}
            onClick={() => navigate(n.path)}
            className="bg-white rounded-2xl border border-slate-100 p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${n.color} flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm`}>
              <n.icon size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-sm">{n.label}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
          </button>
        ))}
      </div>

      {/* ── Lab Results Returned Queue ── */}
      {labReturnQueue.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-cyan-200 overflow-hidden">
          <div className="p-5 border-b border-cyan-100 flex justify-between items-center bg-cyan-50/50">
            <h3 className="font-bold text-cyan-800 flex items-center gap-2">
              <FlaskConical className="text-cyan-600" size={20} />
              Lab Results Ready — Resume Consultation
            </h3>
            <span className="bg-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-md">
              {labReturnQueue.length} patient{labReturnQueue.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Token</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Patient</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Time</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {labReturnQueue.map((appt: any) => (
                  <tr key={appt.id} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-mono font-bold text-slate-600 text-sm">
                      {appt.tokenNumber ? `#${appt.tokenNumber}` : '—'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{appt.patientName}</td>
                    <td className="px-6 py-4 text-slate-600">{appt.appointmentTime}</td>
                    <td className="px-6 py-4 text-slate-600">{appt.consultationType}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => navigate(`/doctor/workspace/${appt.id}`)}
                        className="inline-flex items-center gap-2 bg-cyan-700 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-cyan-800 transition-colors shadow-sm"
                      >
                        <FlaskConical size={14} /> View Results & Resume
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Main Triage Queue ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Stethoscope className="text-slate-700" size={20} />
            Triage Queue — Patients Ready
          </h3>
          <div className="flex items-center gap-3">
            {freshQueue.length > 0 && (
              <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-md">
                {freshQueue.length} waiting
              </span>
            )}
            <button onClick={fetchData} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {freshQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <ClipboardList size={44} className="mb-3 opacity-40" />
              <p className="font-medium">Queue is clear</p>
              <p className="text-sm mt-1">No patients ready for consultation.</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Token</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Patient</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Time</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Reason</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {freshQueue.map((appt: any) => (
                  <tr key={appt.id} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-mono font-bold text-slate-600 text-sm">
                      {appt.tokenNumber ? `#${appt.tokenNumber}` : '—'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{appt.patientName}</td>
                    <td className="px-6 py-4 text-slate-600">{appt.appointmentTime}</td>
                    <td className="px-6 py-4 text-slate-600">{appt.consultationType}</td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[180px]">{appt.reasonForVisit || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => navigate(`/doctor/workspace/${appt.id}`)}
                        className={`inline-flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm ${appt.status === 'IN_CONSULTATION' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-slate-800'}`}
                      >
                        <Stethoscope size={14} /> {appt.status === 'IN_CONSULTATION' ? 'Resume Consultation' : 'Start Consultation'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── My IPD Patients ── */}
      {ipdPatients.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-indigo-600" size={20} />
              My Admitted IPD Patients
            </h3>
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-md">
              {ipdPatients.length} admitted
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Patient Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Ward / Bed</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Diagnosis</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Admission Date</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {ipdPatients.map((a: any) => (
                  <tr key={a.id} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-semibold text-slate-800">{a.patientName}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {a.wardName ? `${a.wardName} - ${a.bedNumber}` : <span className="text-amber-500 font-medium">Pending Bed Assignment</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{a.admissionDiagnosis}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(a.admissionDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => navigate('/doctor/ipd')}
                        className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                         View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
