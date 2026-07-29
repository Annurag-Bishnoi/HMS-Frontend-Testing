import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, Activity, ClipboardList, Pill, Save, CheckCircle, 
  Search, Plus, Trash2, ArrowLeft, Clock, User, FileText, FlaskConical 
} from 'lucide-react';
import DocumentViewerModal from '../../components/common/DocumentViewerModal';
import { getAppointmentById } from '../../api/appointmentService';
import { startConsultation, getVisitsByAppointmentId, searchCiel, completeEncounter, getVisitsByPatientId } from '../../api/visitService';
import { getPatientById } from '../../api/patientService';
import { requestAdmission } from '../../api/ipdService';
import { getUser } from '../../utils/token';

interface MedicationDto {
  medicineName: string;
  medicationCode?: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity?: string;
}

  interface LabTestDto {
    testCode: string;
    testName: string;
    status?: string;
    documentUrl?: string;
    resultValue?: string;
  }

export default function ClinicalWorkspace() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [appointment, setAppointment] = useState<any>(null);
  const [visit, setVisit] = useState<any>(null);

  const [diagnosis, setDiagnosis] = useState('');
  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [notes, setNotes] = useState('');
  
  const [patientDetails, setPatientDetails] = useState<any>(null);
  
  const [medications, setMedications] = useState<MedicationDto[]>([]);
  const [labTests, setLabTests] = useState<LabTestDto[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<'diagnosis' | 'medication' | 'test'>('diagnosis');
  const [searchLoading, setSearchLoading] = useState(false);

  const [leftTab, setLeftTab] = useState<'current' | 'history'>('current');
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [showLabsModal, setShowLabsModal] = useState(false);
  const [showIpdModal, setShowIpdModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedHistoryVisit, setSelectedHistoryVisit] = useState<any>(null);
  const [viewReportUrl, setViewReportUrl] = useState<string | null>(null);

  useEffect(() => {
    if (appointmentId) {
      initWorkspace();
    }
  }, [appointmentId]);

  const initWorkspace = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const appt = await getAppointmentById(appointmentId!);
      setAppointment(appt);

      if (appt.status === 'READY_FOR_DOCTOR' || appt.status === 'SCHEDULED' || appt.status === 'READY_FOR_CONSULTATION') {
        await startConsultation(appointmentId!);
      }

      const visits = await getVisitsByAppointmentId(appointmentId!);
      if (visits && visits.length > 0) {
        setVisit(visits[0]);
        if (visits[0].diagnosis) setDiagnosis(visits[0].diagnosis);
        if (visits[0].diagnosisCode) setDiagnosisCode(visits[0].diagnosisCode);
        if (visits[0].notes) setNotes(visits[0].notes);
        if (visits[0].medications && visits[0].medications.length > 0) {
          setMedications(visits[0].medications);
        }
        if (visits[0].labTests && visits[0].labTests.length > 0) {
          setLabTests(visits[0].labTests);
        }
      }

      // Fetch patient history
      if (appt.patientId) {
         setHistoryLoading(true);
         getVisitsByPatientId(String(appt.patientId)).then(hist => {
             // filter out current visit, sort by date
             const pastVisits = hist
                .filter((v: any) => v.visitId !== (visits.length > 0 ? visits[0].visitId : -1))
                .sort((a: any, b: any) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
             setPatientHistory(pastVisits);
         }).catch(console.error).finally(() => setHistoryLoading(false));

         getPatientById(String(appt.patientId)).then(setPatientDetails).catch(console.error);
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to initialize workspace.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchType]);

  const performSearch = async () => {
    try {
      setSearchLoading(true);
      const results = await searchCiel(searchQuery, searchType);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectConcept = (concept: any) => {
    if (searchType === 'diagnosis') {
      setDiagnosis(concept.conceptName);
      setDiagnosisCode(concept.cielId.toString());
      setSearchQuery('');
    } else if (searchType === 'medication') {
      setMedications([...medications, {
        medicineName: concept.conceptName,
        medicationCode: concept.cielId.toString(),
        dosage: '1 tab', // Kept for backend compatibility, but hidden in UI
        frequency: '1-0-1 (BID)',
        duration: '5 days',
        instructions: 'After meal',
        quantity: '10'
      }]);
      setSearchQuery('');
    } else if (searchType === 'test') {
      setLabTests([...labTests, {
        testName: concept.conceptName,
        testCode: concept.cielId.toString()
      }]);
      setSearchQuery('');
    }
    setSearchResults([]);
  };

  const removeMedication = (index: number) => {
    const newMeds = [...medications];
    newMeds.splice(index, 1);
    setMedications(newMeds);
  };

  const removeLabTest = (index: number) => {
    const newTests = [...labTests];
    newTests.splice(index, 1);
    setLabTests(newTests);
  };

  const calculateFrequencyMultiplier = (freq: string): number => {
    if (freq.includes('1-0-1')) return 2;
    if (freq.includes('1-0-0')) return 1;
    if (freq.includes('0-0-1')) return 1;
    if (freq.includes('1-1-1-1')) return 4;
    if (freq.includes('1-1-1')) return 3;
    if (freq.includes('STAT')) return 1;
    return 1;
  };

  const updateMedication = (index: number, field: keyof MedicationDto, value: any) => {
    const newMeds = [...medications];
    newMeds[index] = { ...newMeds[index], [field]: value };
    
    // Auto-calculate quantity
    if (field === 'frequency' || field === 'duration') {
      const med = newMeds[index];
      const freqMultiplier = calculateFrequencyMultiplier(med.frequency);
      // Extract number from duration string (e.g. "5 days" -> 5)
      const match = med.duration.match(/\d+/);
      const days = match ? parseInt(match[0]) : 1;
      newMeds[index].quantity = (freqMultiplier * days).toString();
    }

    setMedications(newMeds);
  };

  const handleAdmitToIPD = () => {
    if (!diagnosis) {
      alert("Please enter an admission diagnosis before requesting IPD admission.");
      return;
    }
    setShowIpdModal(true);
  };

  const confirmAdmitToIPD = async () => {
    if (!visit?.visitId || !appointment?.patientId || !appointment?.doctorId) return;
    try {
      setSubmitting(true);
      // First, complete the OPD encounter so the consultation fee is billed
      await completeEncounter(visit.visitId, {
        diagnosis,
        diagnosisCode,
        notes,
        medications,
        labTests
      });
      
      // Then, request IPD Admission
      await requestAdmission({
        patientId: appointment.patientId,
        admittingDoctorId: appointment.doctorId,
        admissionDiagnosis: diagnosis
      });
      
      setShowIpdModal(false);
      // We will show a nice success toast/message in production, for now just log it so it doesn't interrupt flow with a browser popup.
      console.log("Patient successfully referred to IPD. Bed manager has been notified.");
      navigate('/doctor/dashboard');
    } catch (err: any) {
      alert("Error requesting admission: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmWaitForLabs = async () => {
    if (!visit?.visitId) return;
    try {
      setSubmitting(true);
      await completeEncounter(visit.visitId, {
        diagnosis,
        diagnosisCode,
        notes,
        medications,
        labTests,
        status: 'WAITING_FOR_LABS'
      });
      setShowLabsModal(false);
      navigate('/doctor/dashboard');
    } catch (err: any) {
      alert("Error pausing encounter: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleWaitForLabs = () => {
    setShowLabsModal(true);
  };

  const handleSubmit = async () => {
    if (!visit?.visitId) return;
    try {
      setSubmitting(true);
      await completeEncounter(visit.visitId, {
        diagnosis,
        diagnosisCode,
        notes,
        medications,
        labTests
      });
      setShowSuccessModal(true);
    } catch (err: any) {
      alert("Error completing encounter: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <Activity className="animate-spin text-blue-600 mb-4" size={48} />
        <h2 className="text-xl font-medium text-slate-700">Loading Clinical Workspace...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4 border border-red-200">
          {error}
        </div>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
          &larr; Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50 overflow-hidden">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="text-blue-600"/> {appointment?.patientName}
            </h1>
            <p className="text-sm text-slate-500 font-medium">ID: #{appointment?.patientId} &bull; Appointment: #{appointment?.id}</p>
          </div>
        </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-medium border border-amber-100">
              <Clock size={16} /> IN CONSULTATION
            </div>
            <button 
              onClick={handleWaitForLabs}
              disabled={submitting || labTests.length === 0}
              className="bg-amber-100 text-amber-700 border border-amber-200 px-5 py-2.5 rounded-lg font-bold hover:bg-amber-200 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <Activity size={18}/> Wait for Labs
            </button>

            <button 
              onClick={handleAdmitToIPD}
              disabled={submitting}
              className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-100 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              Admit to IPD
            </button>

            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? <Activity className="animate-spin" size={18}/> : <CheckCircle size={18}/>}
              Complete Encounter
            </button>
          </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Context (Vitals & History) */}
        <div className="w-[350px] bg-white border-r border-slate-200 overflow-y-auto flex flex-col z-20 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)] relative">
          
          <div className="sticky top-0 bg-slate-800 p-2 z-30 shadow flex gap-1">
             <button 
                onClick={() => setLeftTab('current')} 
                className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${leftTab === 'current' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
             >
                Current Vitals
             </button>
             <button 
                onClick={() => setLeftTab('history')} 
                className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${leftTab === 'history' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
             >
                Patient History
             </button>
          </div>

          {leftTab === 'current' ? (
            <div className="flex-1 flex flex-col">
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Activity size={16}/> Triage Vitals
                </h3>
                {visit?.vitals && visit.vitals.length > 0 ? (
                  <div className="space-y-3">
                    {visit.vitals.map((vital: any) => (
                      <div key={vital.vitalId} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-sm font-medium text-slate-600">{vital.conceptName}</span>
                        <span className="text-sm font-bold text-slate-800">{vital.vitalValue} <span className="text-xs text-slate-400 font-normal">{vital.unit}</span></span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No vitals recorded by triage.</p>
                )}
              </div>



              <div className="p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <ClipboardList size={16}/> Chief Complaint
                </h3>
                <p className="text-sm text-slate-700 bg-amber-50 p-3 rounded-lg border border-amber-100 font-medium">
                  {appointment?.reasonForVisit || "Not specified"}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 flex-1 flex flex-col">
               <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Clock size={16}/> Past Appointments
               </h3>
               {historyLoading ? (
                  <div className="flex justify-center py-8"><Activity className="animate-spin text-blue-500" size={24}/></div>
               ) : patientHistory.length === 0 ? (
                  <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">No past records found.</p>
               ) : (
                  <div className="space-y-4">
                     {patientHistory.map((hist: any) => (
                        <div key={hist.visitId} className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden text-sm">
                           <div className="bg-slate-200 px-3 py-2 font-bold text-slate-700 flex justify-between items-center text-xs">
                              <span>{new Date(hist.visitDate).toLocaleDateString()}</span>
                              <span className="font-medium text-slate-500">Dr. {hist.doctorName}</span>
                           </div>
                           <div className="p-3 space-y-3">
                              <div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</div>
                                 <div className="font-semibold text-slate-800">{hist.diagnosis || 'None'}</div>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-2 mt-2 border-t border-slate-200">
                                {hist.notes && (
                                  <button onClick={() => setSelectedHistoryVisit(hist)} className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-100" title="Clinical Notes">
                                    <ClipboardList size={14} /> Notes
                                  </button>
                                )}
                                {hist.medications && hist.medications.length > 0 && (
                                  <button onClick={() => setSelectedHistoryVisit(hist)} className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-semibold hover:bg-blue-100 transition-colors border border-blue-100" title="Prescriptions">
                                    <Pill size={14} /> {hist.medications.length} Rx
                                  </button>
                                )}
                                {hist.labTests && hist.labTests.length > 0 && (
                                  <button onClick={() => setSelectedHistoryVisit(hist)} className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-semibold hover:bg-emerald-100 transition-colors border border-emerald-100" title="Lab Results">
                                    <FlaskConical size={14} /> {hist.labTests.length} Labs
                                  </button>
                                )}
                                {!hist.notes && (!hist.medications || hist.medications.length === 0) && (!hist.labTests || hist.labTests.length === 0) && (
                                  <span className="text-xs text-slate-400 italic">No additional details recorded.</span>
                                )}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
          )}
        </div>

        {/* Center Panel: Notes & CIEL Search */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          {/* Notes Area */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Stethoscope className="text-blue-500"/> Clinical Diagnosis & Notes
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Diagnosis</label>
                {diagnosisCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-emerald-500" size={20}/>
                      <div>
                        <div className="font-bold text-emerald-900">{diagnosis}</div>
                        <div className="text-xs text-emerald-600 font-medium">CIEL Code: {diagnosisCode}</div>
                      </div>
                    </div>
                    <button onClick={() => { setDiagnosis(''); setDiagnosisCode(''); }} className="text-emerald-700 hover:text-emerald-900 text-sm font-medium">
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                      placeholder="Search CIEL dictionary for diagnosis..."
                      value={searchType === 'diagnosis' ? searchQuery : ''}
                      onChange={(e) => {
                        setSearchType('diagnosis');
                        setSearchQuery(e.target.value);
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Clinical Notes</label>
                <textarea
                  className="w-full border border-slate-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm min-h-[250px] resize-none"
                  placeholder="Enter detailed subjective and objective notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Orders (Rx & Labs) */}
        <div className="w-[450px] bg-white border-l border-slate-200 overflow-y-auto flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20 relative">
          
          {/* Universal CIEL Order Search */}
          <div className="sticky top-0 bg-slate-800 p-5 z-30">
            <h3 className="text-white font-bold mb-3">Clinical Orders</h3>
            <div className="flex bg-slate-700 rounded-lg p-1 mb-3">
              <button 
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${searchType === 'medication' ? 'bg-blue-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                onClick={() => { setSearchType('medication'); setSearchQuery(''); setSearchResults([]); }}
              >
                Medications
              </button>
              <button 
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${searchType === 'test' ? 'bg-blue-500 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                onClick={() => { setSearchType('test'); setSearchQuery(''); setSearchResults([]); }}
              >
                Lab Tests
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                id="searchBar"
                type="text"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border-none text-white rounded text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={searchType === 'medication' ? "Search CIEL drugs..." : "Search CIEL lab tests..."}
                value={searchType !== 'diagnosis' ? searchQuery : ''}
                onChange={(e) => {
                  if (searchType === 'diagnosis') {
                    setSearchType('medication');
                  }
                  setSearchQuery(e.target.value);
                }}
                onFocus={() => {
                  if (searchType === 'diagnosis') setSearchType('medication');
                }}
              />
            </div>

            {/* Floating Search Results */}
            {searchResults.length > 0 && searchQuery.length >= 2 && (
              <div className="absolute left-5 right-5 top-full mt-2 bg-white rounded-lg shadow-xl border border-slate-200 max-h-64 overflow-y-auto z-50">
                {searchResults.map((result) => (
                  <button
                    key={result.cielId}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-0 flex flex-col transition-colors"
                    onClick={() => handleSelectConcept(result)}
                  >
                    <span className="font-semibold text-slate-800 text-sm">{result.conceptName}</span>
                    <span className="text-xs text-slate-500">{result.conceptClass} • {result.cielId}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 space-y-6">
            
            {/* Medications List */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Pill size={16}/> Prescriptions
              </h4>
              {medications.length === 0 ? (
                <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg text-center border border-slate-100">No medications ordered.</p>
              ) : (
                <div className="space-y-3">
                  {medications.map((med, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group">
                      <button onClick={() => removeMedication(index)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <h5 className="font-bold text-slate-800 text-sm pr-6 mb-2 leading-tight">{med.medicineName}</h5>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <select value={med.frequency} onChange={e => updateMedication(index, 'frequency', e.target.value)} className="text-xs border border-slate-200 rounded p-1.5 focus:border-blue-500 outline-none bg-white">
                          <option value="1-0-1 (BID)">1-0-1 (BID)</option>
                          <option value="1-0-0 (Morning)">1-0-0 (Morning)</option>
                          <option value="0-0-1 (Night)">0-0-1 (Night)</option>
                          <option value="1-1-1 (TID)">1-1-1 (TID)</option>
                          <option value="1-1-1-1 (QID)">1-1-1-1 (QID)</option>
                          <option value="As needed (PRN)">As needed (PRN)</option>
                          <option value="STAT (Immediately)">STAT (Immediately)</option>
                        </select>
                        <div>
                          <input type="text" list="duration-options" value={med.duration} onChange={e => updateMedication(index, 'duration', e.target.value)} className="w-full text-xs border border-slate-200 rounded p-1.5 focus:border-blue-500 outline-none" placeholder="Duration (e.g. 5 days)"/>
                          <datalist id="duration-options">
                            <option value="3 days" />
                            <option value="5 days" />
                            <option value="10 days" />
                            <option value="20 days" />
                            <option value="30 days" />
                          </datalist>
                        </div>
                        <div className="flex gap-1 col-span-2">
                          <select value={med.instructions} onChange={e => updateMedication(index, 'instructions', e.target.value)} className="flex-1 text-xs border border-slate-200 rounded p-1.5 focus:border-blue-500 outline-none bg-white">
                              <option value="After meal">After meal</option>
                              <option value="Before meal">Before meal</option>
                              <option value="Empty stomach">Empty stomach</option>
                              <option value="With food">With food</option>
                          </select>
                          <input type="text" value={med.quantity || ''} onChange={e => updateMedication(index, 'quantity', e.target.value)} className="w-24 text-xs border border-slate-200 rounded p-1.5 focus:border-blue-500 outline-none font-bold text-indigo-700 bg-indigo-50" placeholder="Total Qty" title="Total Quantity"/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lab Tests List */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Activity size={16}/> Lab Tests
              </h4>
              {labTests.length === 0 ? (
                <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg text-center border border-slate-100">No lab tests ordered.</p>
              ) : (
                <div className="space-y-2">
                  {labTests.map((test, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center group">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-700 text-sm leading-tight">{test.testName}</div>
                        <div className="text-xs text-slate-400 font-medium flex gap-3 mt-1">
                           <span>CIEL: {test.testCode}</span>
                           {test.status && (
                             <span className={`font-bold ${test.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                               {test.status}
                             </span>
                           )}
                        </div>
                        {test.resultValue && (
                          <div className="mt-1 text-xs text-slate-600 font-medium bg-white px-2 py-1 inline-block rounded border border-slate-200">
                             Result: {test.resultValue}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {test.status === 'COMPLETED' && test.documentUrl && (
                          <button onClick={() => setViewReportUrl(test.documentUrl!)} className="text-blue-500 hover:text-blue-700 p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md shadow-sm border border-blue-100 transition-all flex items-center gap-1" title="View Report">
                            <FileText size={14} /> <span className="text-xs font-bold">Report</span>
                          </button>
                        )}
                        <button onClick={() => removeLabTest(index)} className="text-slate-300 hover:text-red-500 p-1.5 bg-white rounded-md shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Wait for Labs UI Modal */}
      {showLabsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FlaskConical size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Wait for Lab Results?</h2>
              <p className="text-slate-500 text-sm mb-6">
                This will pause the current consultation and send the patient to the lab queue. You can resume this consultation once the lab results are uploaded.
              </p>
              
              {labTests.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-3 text-left mb-6 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pending Tests</h4>
                  <ul className="text-sm font-medium text-slate-700 space-y-1">
                    {labTests.map((t, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Activity size={14} className="text-amber-500" /> {t.testName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLabsModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmWaitForLabs}
                  disabled={submitting || labTests.length === 0}
                  className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {submitting ? <Activity className="animate-spin" size={18} /> : "Confirm & Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Consultation Completed!</h2>
              <p className="text-slate-500 text-sm mb-6">
                The encounter has been finalized. Prescriptions and lab orders have been dispatched.
              </p>
              
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/doctor/dashboard');
                }}
                className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admit to IPD UI Modal */}
      {showIpdModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Request IPD Admission?</h2>
              <p className="text-slate-500 text-sm mb-6">
                This will complete the current OPD encounter and request a bed for the patient in the Inpatient Department (IPD). The Bed Manager will be notified.
              </p>
              
              <div className="bg-slate-50 rounded-lg p-3 text-left mb-6 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admission Diagnosis</h4>
                <p className="font-medium text-indigo-700">{diagnosis}</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowIpdModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAdmitToIPD}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {submitting ? <Activity className="animate-spin" size={18} /> : "Admit to IPD"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal for History */}
      {selectedHistoryVisit && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CalendarCheck className="text-blue-600" size={20} />
                Visit Details - {new Date(selectedHistoryVisit.visitDate).toLocaleDateString()}
              </h2>
              <button onClick={() => setSelectedHistoryVisit(null)} className="text-slate-400 hover:text-slate-600">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User size={14} /> Doctor
                </h4>
                <p className="font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  Dr. {selectedHistoryVisit.doctorName}
                </p>
              </div>

              {selectedHistoryVisit.notes && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ClipboardList size={14} /> Clinical Notes
                  </h4>
                  <p className="text-sm text-slate-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                    {selectedHistoryVisit.notes}
                  </p>
                </div>
              )}

              {selectedHistoryVisit.medications && selectedHistoryVisit.medications.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Pill size={14} /> Prescriptions
                  </h4>
                  <div className="space-y-2">
                    {selectedHistoryVisit.medications.map((m: any, i: number) => (
                      <div key={i} className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{m.medicineName}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{m.instructions}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-700">{m.dosage}</p>
                          <p className="text-xs font-medium text-slate-500">{m.frequency} x {m.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedHistoryVisit.labTests && selectedHistoryVisit.labTests.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FlaskConical size={14} /> Lab Results
                  </h4>
                    <div className="space-y-2">
                      {selectedHistoryVisit.labTests.map((t: any, i: number) => (
                        <div key={i} className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg flex justify-between items-center">
                          <span className="font-semibold text-slate-800 text-sm">{t.testName}</span>
                          <div className="flex items-center gap-3">
                            {t.resultValue ? (
                              <span className="font-bold text-emerald-700 text-sm bg-emerald-100 px-2 py-1 rounded">
                                {t.resultValue}
                              </span>
                            ) : t.status === 'COMPLETED' ? (
                              <span className="font-bold text-emerald-700 text-sm bg-emerald-100 px-2 py-1 rounded">
                                Completed
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded">{t.status || 'Pending'}</span>
                            )}
                            {t.status === 'COMPLETED' && t.documentUrl && (
                                <button onClick={() => setViewReportUrl(t.documentUrl)} className="text-blue-500 hover:text-blue-700 p-1.5 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors" title="View Report">
                                  <FileText size={16} />
                                </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-right">
              <button 
                onClick={() => setSelectedHistoryVisit(null)}
                className="px-5 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewReportUrl && (
        <DocumentViewerModal 
           url={viewReportUrl} 
           onClose={() => setViewReportUrl(null)} 
        />
      )}

    </div>
  );
}
