import { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import type { Appointment } from "../../../types/appointment";
import type { Patient } from "../../../api/patientService";
import type { Doctor } from "../../../types/doctor";
import { User, Stethoscope, Calendar, Clock, Activity, FileText } from "lucide-react";
import { getUser } from "../../../utils/token";

interface AppointmentFormProps {
  initialData?: Appointment;
  patients: Patient[];
  doctors: Doctor[];
  onSubmit: (appointment: Partial<Appointment>) => void;
}

export default function AppointmentForm({ initialData, patients, doctors, onSubmit }: AppointmentFormProps) {
  const user = getUser();
  const basePath = user?.role === "RECEPTIONIST" ? "/receptionist" : "/admin";

  const [formData, setFormData] = useState<Partial<Appointment>>(
    initialData ?? {
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      consultationType: "OPD",
      status: "SCHEDULED",
      reasonForVisit: "",
      notes: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, option: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: option ? option.value : "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Convert patients and doctors to react-select options
  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.registrationNo})`,
  }));

  const doctorOptions = doctors.map((d) => ({
    value: d.id,
    label: `${d.name} (${d.department})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl bg-white p-8 shadow-sm border border-slate-100 animate-fade-in">
      
      {/* People Section */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 pb-2 border-b border-slate-100">
          <User className="text-blue-600" size={20} />
          Participants
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Patient <span className="text-red-500">*</span></label>
            <Select
              options={patientOptions}
              value={patientOptions.find((opt) => String(opt.value) === String(formData.patientId)) || null}
              onChange={(option) => handleSelectChange("patientId", option)}
              isDisabled={!!initialData?.patientId}
              placeholder="Search by name or ID..."
              className="react-select-container"
              classNamePrefix="react-select"
              required
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderRadius: '0.75rem',
                  borderColor: state.isFocused ? '#3b82f6' : '#e2e8f0',
                  padding: '0.15rem',
                  boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                  '&:hover': {
                    borderColor: '#cbd5e1'
                  }
                }),
              }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Doctor <span className="text-red-500">*</span></label>
            <Select
              options={doctorOptions}
              value={doctorOptions.find((opt) => String(opt.value) === String(formData.doctorId)) || null}
              onChange={(option) => handleSelectChange("doctorId", option)}
              isDisabled={!!initialData?.doctorId}
              placeholder="Search by doctor name..."
              className="react-select-container"
              classNamePrefix="react-select"
              required
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderRadius: '0.75rem',
                  borderColor: state.isFocused ? '#3b82f6' : '#e2e8f0',
                  padding: '0.15rem',
                  boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                  '&:hover': {
                    borderColor: '#cbd5e1'
                  }
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 pb-2 border-b border-slate-100 mt-8">
          <Calendar className="text-blue-600" size={20} />
          Schedule Details
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Appointment Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar size={16} className="text-slate-400" />
              </div>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Time Slot <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Clock size={16} className="text-slate-400" />
              </div>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Consultation Type</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Activity size={16} className="text-slate-400" />
              </div>
              <select
                name="consultationType"
                value={formData.consultationType}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-slate-200 py-3 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="OPD">OPD</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          {initialData && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FileText size={16} className="text-slate-400" />
                </div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-slate-200 py-3 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-semibold text-slate-800"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="CHECKED_IN">Checked In</option>
                  <option value="READY_FOR_DOCTOR">Ready For Doctor</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Clinical Details Section */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 pb-2 border-b border-slate-100 mt-8">
          <Stethoscope className="text-blue-600" size={20} />
          Clinical Details
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Chief Complaint / Reason for Visit <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3">
                <FileText size={16} className="text-slate-400" />
              </div>
              <textarea
                name="reasonForVisit"
                value={formData.reasonForVisit}
                onChange={handleChange}
                rows={2}
                placeholder="E.g., Severe headache for 2 days"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Internal Notes (Optional)</label>
            <div className="relative">
              <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3">
                <FileText size={16} className="text-slate-400" />
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Any notes for the doctor or staff"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
        <Link
          to={`${basePath}/appointments`}
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          {initialData ? "Save Changes" : "Book Appointment"}
        </button>
      </div>
    </form>
  );
}