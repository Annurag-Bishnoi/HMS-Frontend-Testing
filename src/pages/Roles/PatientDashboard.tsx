import { useEffect, useState } from 'react';
import {
  Calendar, Pill, FlaskConical, Activity,
  Heart, User, Phone, MapPin, Droplets,
  CheckCircle, AlertCircle, ArrowRight,
  Stethoscope, Shield, RefreshCw, Clock,
  AlertTriangle, FileText, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/token';
import { getPatientByUserId } from '../../api/patientService';
import { getAppointments } from '../../api/appointmentService';
import { getVisitsByPatientId } from '../../api/visitService';
import { getPrescriptionsByPatientId } from '../../api/prescriptionService';
import { getAdmissionsByPatient } from '../../api/ipdService';
import PatientHistoryModal from '../../components/common/PatientHistoryModal';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const calcAge = (dob?: string) => {
  if (!dob) return null;
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000));
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [pendingLabs, setPendingLabs] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const user = getUser();
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      if (!user?.userId) return;
      const patient = await getPatientByUserId(String(user.userId));
      setPatientInfo(patient);
      const patientId = String(patient.patientId);
      const [allAppts, vs, rxs, adms] = await Promise.all([
        getAppointments(),
        getVisitsByPatientId(patientId),
        getPrescriptionsByPatientId(patientId),
        getAdmissionsByPatient(patientId).catch(() => [])
      ]);
      const mine = Array.isArray(allAppts)
        ? allAppts.filter((a: any) => String(a.patientId) === patientId)
            .sort((a: any, b: any) => (b.appointmentDate || '').localeCompare(a.appointmentDate || ''))
        : [];
      setAppointments(mine);
      const vsArr = Array.isArray(vs) ? vs : [];
      setVisits(vsArr.sort((a, b) => new Date(b.visitDate || 0).getTime() - new Date(a.visitDate || 0).getTime()));
      setPrescriptions(Array.isArray(rxs) ? rxs : []);
      const pending = vsArr.flatMap((v: any) => v.labTests || []).filter((t: any) => t.status !== 'COMPLETED').length;
      setPendingLabs(pending);
      
      const sortedAdms = Array.isArray(adms) 
        ? adms.sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
        : [];
      setAdmissions(sortedAdms);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const upcomingAppts = appointments.filter(a =>
    (a.appointmentDate || '') >= todayStr && a.status !== 'CANCELLED' && a.status !== 'COMPLETED'
  );
  const nextAppt = upcomingAppts[0] ?? null;
  const age = calcAge(patientInfo?.dateOfBirth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-3">
          <Activity className="animate-spin text-teal-600" size={36} />
          <p className="text-slate-500 text-sm font-medium">Loading your health portal…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">

      {/* ── Welcome Banner ── */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative flex justify-between items-start gap-4 flex-wrap">
          <div>
            <p className="text-slate-400 text-sm font-medium">{greeting()},</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-0.5">
              {patientInfo?.fullName || user?.name || 'Patient'}
            </h1>
            <p className="text-slate-400 mt-1 text-sm flex items-center gap-3 flex-wrap">
              {patientInfo?.patientCode && <span className="flex items-center gap-1"><Shield size={13} /> {patientInfo.patientCode}</span>}
              {patientInfo?.bloodGroup && <span className="flex items-center gap-1"><Droplets size={13} /> {patientInfo.bloodGroup}</span>}
              {age && <span className="flex items-center gap-1"><User size={13} /> {age} yrs • {patientInfo?.gender}</span>}
            </p>
            <div className="mt-4">
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <FileText size={14} /> View Full Medical History
              </button>
            </div>
          </div>
          {nextAppt ? (
            <div className="bg-slate-800 rounded-2xl px-5 py-3 text-center shrink-0">
              <p className="text-xs text-slate-400 font-medium mb-0.5">Next Appointment</p>
              <p className="font-bold text-white">{nextAppt.appointmentDate ? new Date(nextAppt.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}</p>
              <p className="text-slate-400 text-xs">{nextAppt.appointmentTime} • {nextAppt.doctorName || 'Doctor'}</p>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-2xl px-5 py-3 text-center shrink-0">
              <p className="text-xs text-slate-400 font-medium">No upcoming</p>
              <p className="font-bold text-white text-sm">appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Stat Cards — clickable → navigate to pages ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Appts',   value: upcomingAppts.length,  icon: Calendar,    bg: 'bg-slate-100',    text: 'text-slate-600',    path: '/patient/appointments'  },
          { label: 'Total Visits',     value: visits.length,         icon: Stethoscope, bg: 'bg-slate-100',    text: 'text-slate-600',    path: '/patient/history'       },
          { label: 'Prescriptions',    value: prescriptions.length,  icon: Pill,        bg: 'bg-slate-100',  text: 'text-slate-600',  path: '/patient/prescriptions' },
          { label: 'Pending Lab Tests',value: pendingLabs,           icon: FlaskConical,bg: 'bg-slate-100',   text: 'text-slate-600',   path: '/patient/labs'          },
        ].map(s => (
          <button key={s.label} onClick={() => navigate(s.path)}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
            <div className={`p-3 rounded-xl ${s.bg}`}><s.icon className={s.text} size={22} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium leading-tight">{s.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{s.value}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* ── Quick Nav ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'My Appointments',  desc: 'View & track all visits',           icon: Calendar,    color: 'from-slate-600 to-slate-700',     path: '/patient/appointments'  },
          { label: 'Visit History',    desc: 'Full consultation records',          icon: Stethoscope, color: 'from-slate-600 to-slate-700',     path: '/patient/history'       },
          { label: 'Prescriptions',    desc: 'Your medications & Rx history',      icon: Pill,        color: 'from-slate-600 to-slate-700', path: '/patient/prescriptions' },
          { label: 'Lab Tests',        desc: 'Pending & completed results',        icon: FlaskConical,color: 'from-slate-600 to-slate-700',  path: '/patient/labs'          },
        ].map(n => (
          <button key={n.label} onClick={() => navigate(n.path)}
            className="bg-white rounded-2xl border border-slate-100 p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group shadow-sm">
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

      {/* ── Profile & Activity Stack ── */}
      <div className="space-y-6">

        {/* Activity: Next appt + Recent visits + Pending labs */}
        <div className="space-y-6">

          {/* Pending Labs Alert */}
          {pendingLabs > 0 && (
            <button onClick={() => navigate('/patient/labs')}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:bg-slate-100 transition-colors text-left">
              <AlertCircle className="text-slate-600 shrink-0" size={22} />
              <div className="flex-1">
                <p className="font-bold text-slate-800">{pendingLabs} lab test{pendingLabs > 1 ? 's' : ''} awaiting results</p>
                <p className="text-sm text-slate-500 mt-0.5">Click to view your pending lab tests</p>
              </div>
              <ArrowRight className="text-slate-600 shrink-0" size={18} />
            </button>
          )}

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Calendar className="text-slate-500" size={18}/> Upcoming Appointments</h3>
              <button onClick={() => navigate('/patient/appointments')} className="text-xs font-semibold text-slate-600 hover:text-slate-800 transition">All →</button>
            </div>
            <div className="overflow-x-auto">
              {upcomingAppts.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Calendar size={36} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No upcoming appointments.</p>
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Date & Time</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Doctor</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppts.slice(0, 4).map(a => (
                      <tr key={a.id} className={`border-b border-slate-100 transition-colors ${a.appointmentDate === todayStr ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">
                            {a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <Clock size={12} /> {a.appointmentTime}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-medium">Dr. {a.doctorName || 'Doctor'}</td>
                        <td className="px-6 py-4">
                          {a.appointmentDate === todayStr ? (
                            <span className="text-[10px] bg-slate-800 text-white font-bold px-2 py-1 rounded-full">TODAY</span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Scheduled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>


          {/* Recent Consultations */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Stethoscope className="text-slate-500" size={18}/> Recent Consultations</h3>
              <button onClick={() => navigate('/patient/history')} className="text-xs font-semibold text-slate-600 hover:text-slate-800 transition">All →</button>
            </div>
            <div className="overflow-x-auto">
              {visits.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Stethoscope size={36} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No consultations yet.</p>
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Doctor</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Diagnosis</th>
                      <th className="px-6 py-4 text-right font-semibold text-slate-700">Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.slice(0, 4).map((v: any) => (
                      <tr key={v.visitId} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 text-slate-500">
                          {v.visitDate ? new Date(v.visitDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-medium">Dr. {v.doctorName}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {v.diagnosis || 'No diagnosis'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => navigate('/patient/history')} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                            <FileText size={14} /> Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recent IPD Admissions */}
          {admissions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-amber-50/30">
                <h3 className="font-bold text-amber-900 flex items-center gap-2">
                  <Activity className="text-amber-600" size={18}/> Recent Hospital Stays (IPD)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Admission Date</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Ward & Bed</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Doctor</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Diagnosis</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions.slice(0, 3).map((adm: any) => (
                      <tr key={adm.id} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 text-slate-700 font-medium">
                          {adm.admissionDate ? new Date(adm.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {adm.wardName || 'N/A'} - {adm.bedNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-medium">Dr. {adm.doctorName}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {adm.admissionDiagnosis || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${adm.status === 'DISCHARGED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {adm.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Full History Modal */}
      {showHistoryModal && patientInfo && (
        <PatientHistoryModal
          patientId={String(patientInfo.patientId)}
          patientName={patientInfo.fullName}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

    </div>
  );
}
