import { useEffect, useState } from 'react';
import { BedDouble, Users, AlertCircle, RefreshCw, CheckCircle, CreditCard, XCircle, Info, Clock, User } from 'lucide-react';
import { getWards, getBeds, getPendingAdmissions, assignBed, cancelAdmission, getAdmissionsByStatus } from '../../../api/ipdService';

export default function IPDBedManager() {
  const [wards, setWards] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [activeAdmissions, setActiveAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<number | null>(null);
  const [paymentModalData, setPaymentModalData] = useState<{ admissionId: number; bedId: number; patientName: string } | null>(null);
  const [selectedOccupiedBed, setSelectedOccupiedBed] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(false); // background refresh
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [w, b, p, a] = await Promise.all([
        getWards(), 
        getBeds(), 
        getPendingAdmissions(),
        getAdmissionsByStatus('ADMITTED')
      ]);
      setWards(w);
      setBeds(b);
      setPending(p);
      setActiveAdmissions(a);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignBed = async (admissionId: number, bedId: number) => {
    try {
      console.log(`Attempting to assign bed ${bedId} to admission ${admissionId}`);
      setAssigning(admissionId);
      await assignBed(admissionId, bedId);
      await fetchData(); // Refresh data
    } catch (e: any) {
      console.error("Failed to assign bed", e);
      alert(`Failed to assign bed: ${e.response?.data?.message || 'It might be occupied.'}`);
    } finally {
      setAssigning(null);
      setPaymentModalData(null);
    }
  };

  const handleCancelAdmission = async (admissionId: number) => {
    try {
      setAssigning(admissionId);
      await cancelAdmission(admissionId);
      await fetchData(); // Refresh data
    } catch (e: any) {
      console.error("Failed to cancel admission", e);
      alert(`Failed to cancel admission: ${e.response?.data?.message || 'Error occurred.'}`);
    } finally {
      setAssigning(null);
      setPaymentModalData(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-h-screen overflow-y-auto bg-slate-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">IPD Bed Management</h1>
          <p className="text-slate-500 text-sm mt-1">Assign beds to incoming patients and manage ward capacity.</p>
        </div>
        <button 
          onClick={() => fetchData(true)} 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm font-medium text-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-indigo-500" : "text-indigo-500"} /> 
          Refresh Status
        </button>
      </div>

      {/* Pending Admissions */}
      <div>
        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
          <AlertCircle size={20} className="text-amber-500" />
          Pending Admissions ({pending.length})
        </h2>
        
        {pending.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500">
            No patients waiting for admission.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map(p => (
              <div key={p.id} className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{p.patientName}</h3>
                    <p className="text-xs text-slate-500">Admitting Dr: {p.doctorName}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Waiting
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700">Diagnosis:</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{p.admissionDiagnosis}</p>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Assign to Available Bed:</p>
                  <select 
                    className="w-full text-sm p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                    onChange={(e) => {
                      const bId = parseInt(e.target.value, 10);
                      if (bId) {
                        setPaymentModalData({ admissionId: p.id, bedId: bId, patientName: p.patientName });
                      }
                      e.target.value = "";
                    }}
                    defaultValue=""
                    disabled={assigning === p.id}
                  >
                    <option value="" disabled>Select a Bed...</option>
                    {wards.map(w => (
                      <optgroup key={w.id} label={w.name}>
                        {beds.filter(b => b.wardId === w.id && b.status === 'AVAILABLE').map(b => (
                          <option key={b.id} value={b.id}>{b.bedNumber}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ward Status */}
      <div>
        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
          <BedDouble size={20} className="text-indigo-500" />
          Ward Status
        </h2>

        <div className="space-y-6">
          {wards.map(w => {
            const wardBeds = beds.filter(b => b.wardId === w.id);
            const occupiedCount = wardBeds.filter(b => b.status === 'OCCUPIED').length;
            const availableCount = wardBeds.filter(b => b.status === 'AVAILABLE').length;

            return (
              <div key={w.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800">{w.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Capacity: {w.capacity} • Daily Charge: ₹{w.dailyCharge}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{availableCount}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Available</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-500">{occupiedCount}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Occupied</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {wardBeds.map(b => (
                    <button 
                      key={b.id} 
                      onClick={() => {
                        if (b.status === 'OCCUPIED') {
                          const adm = activeAdmissions.find(a => a.bedNumber === b.bedNumber && a.wardName === w.name);
                          if (adm) setSelectedOccupiedBed({ bed: b, admission: adm, ward: w });
                        }
                      }}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        b.status === 'AVAILABLE' 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:shadow-md cursor-pointer'
                      }`}
                    >
                      <BedDouble size={24} />
                      <span className="font-bold">{b.bedNumber}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold">
                        {b.status}
                      </span>
                      {b.status === 'OCCUPIED' && <Info size={12} className="absolute top-2 right-2 opacity-50" />}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {paymentModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Verify Admission Payment</h3>
                <p className="text-slate-500 text-xs mt-0.5">Patient: <span className="font-semibold text-slate-700">{paymentModalData.patientName}</span></p>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-slate-700 mb-6">
                Please confirm if the patient has successfully paid the required IPD admission deposit. 
                <br /><br />
                If the payment has <b>not</b> been made, the admission request must be cancelled to clear the doctor's queue.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleAssignBed(paymentModalData.admissionId, paymentModalData.bedId)}
                  disabled={assigning === paymentModalData.admissionId}
                  className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <CheckCircle size={18} /> Yes, Payment Received (Assign Bed)
                </button>
                <button
                  onClick={() => handleCancelAdmission(paymentModalData.admissionId)}
                  disabled={assigning === paymentModalData.admissionId}
                  className="w-full flex justify-center items-center gap-2 bg-white border-2 border-red-100 text-red-600 font-bold py-3 px-4 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                >
                  <XCircle size={18} /> No, Cancel IPD Request
                </button>
                <button
                  onClick={() => setPaymentModalData(null)}
                  disabled={assigning === paymentModalData.admissionId}
                  className="w-full text-slate-500 font-semibold py-2 mt-2 hover:text-slate-700 transition-colors disabled:opacity-50"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bed Details Modal */}
      {selectedOccupiedBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <BedDouble className="text-indigo-600" size={20} />
                Bed {selectedOccupiedBed.bed.bedNumber} Details
              </h3>
              <button onClick={() => setSelectedOccupiedBed(null)} className="p-1 hover:bg-slate-200 rounded-full">
                <XCircle size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Patient Name</p>
                  <p className="font-bold text-slate-800 text-lg">{selectedOccupiedBed.admission.patientName}</p>
                  <p className="text-xs text-slate-500 mt-1">Doctor: Dr. {selectedOccupiedBed.admission.doctorName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase mb-1 flex items-center gap-1">
                    <CheckCircle size={12} /> Advance Paid
                  </p>
                  <p className="font-bold text-emerald-900">Yes (1 Day Room)</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase mb-1 flex items-center gap-1">
                    <Clock size={12} /> Days Admitted
                  </p>
                  <p className="font-bold text-blue-900">
                    {Math.max(1, Math.ceil((Date.now() - new Date(selectedOccupiedBed.admission.admissionDate).getTime()) / (1000 * 3600 * 24)))} Day(s)
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Admitted On</p>
                <p className="font-semibold text-slate-700">{new Date(selectedOccupiedBed.admission.admissionDate).toLocaleString()}</p>
                <p className="text-xs text-slate-500 font-bold uppercase mt-3 mb-1">Diagnosis</p>
                <p className="font-medium text-slate-700">{selectedOccupiedBed.admission.admissionDiagnosis}</p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
