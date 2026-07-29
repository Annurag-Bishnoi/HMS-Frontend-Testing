import React, { useState } from 'react';
import { X, Activity, Thermometer, HeartPulse, Scale, FileText } from 'lucide-react';
import { recordSimpleVitals } from '../../../api/visitService';

interface TriageVitalsModalProps {
  appointmentId: string;
  patientName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TriageVitalsModal({ appointmentId, patientName, onClose, onSuccess }: TriageVitalsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    systolicBP: '',
    diastolicBP: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    weight: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        systolicBP: formData.systolicBP ? parseInt(formData.systolicBP) : null,
        diastolicBP: formData.diastolicBP ? parseInt(formData.diastolicBP) : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        respiratoryRate: formData.respiratoryRate ? parseInt(formData.respiratoryRate) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        notes: formData.notes || ''
      };

      await recordSimpleVitals(appointmentId, payload);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to record vitals and hand over.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Check-in & Triage Vitals</h2>
              <p className="text-sm text-slate-500">Patient: <span className="font-semibold text-slate-700">{patientName}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <strong>Note:</strong> Saving these vitals will mark the patient as <strong>Ready for Doctor</strong> and add them to the doctor's active queue.
          </div>

          <form id="triage-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Blood Pressure */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <HeartPulse size={16} className="text-rose-500" />
                  Blood Pressure (mmHg)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      name="systolicBP"
                      value={formData.systolicBP}
                      onChange={handleChange}
                      placeholder="Systolic (e.g. 120)"
                      className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                    />
                  </div>
                  <span className="text-slate-400 font-medium">/</span>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      name="diastolicBP"
                      value={formData.diastolicBP}
                      onChange={handleChange}
                      placeholder="Diastolic (e.g. 80)"
                      className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <HeartPulse size={16} className="text-rose-500" />
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  placeholder="e.g. 72"
                  className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Thermometer size={16} className="text-orange-500" />
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="e.g. 98.6"
                  className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
              </div>

              {/* Respiratory Rate */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Activity size={16} className="text-blue-500" />
                  Resp. Rate (breaths/min)
                </label>
                <input
                  type="number"
                  name="respiratoryRate"
                  value={formData.respiratoryRate}
                  onChange={handleChange}
                  placeholder="e.g. 16"
                  className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Scale size={16} className="text-emerald-500" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 70.5"
                  className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText size={16} className="text-slate-500" />
                  Triage Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any observed symptoms, allergies, or context..."
                  rows={3}
                  className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm resize-none"
                />
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="triage-form"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-indigo-600/20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              'Save Vitals & Handover'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
