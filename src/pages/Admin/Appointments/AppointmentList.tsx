import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../utils/token";
import AppointmentHeader from "../../../components/admin/appointments/AppointmentHeader";
import AppointmentStats from "../../../components/admin/appointments/AppointmentStats";
import AppointmentToolbar from "../../../components/admin/appointments/AppointmentToolbar";
import AppointmentTable from "../../../components/admin/appointments/AppointmentTable";
import AppointmentDetailsModal from "../../../components/admin/appointments/AppointmentDetailsModal";
import TriageVitalsModal from "../../../components/admin/appointments/TriageVitalsModal";
import Pagination from "../../../components/common/Pagination";

import { getAppointments, cancelAppointment, markPaymentPaid } from "../../../api/appointmentService";
import type { Appointment } from "../../../types/appointment";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

export default function AppointmentList() {
  const navigate = useNavigate();
  const user = getUser();
  const basePath = user?.role === "RECEPTIONIST" ? "/receptionist" : "/admin";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTriageOpen, setIsTriageOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data.reverse());
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleTriage = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsTriageOpen(true);
  };

  const handleEdit = (appointment: Appointment) => {
    navigate(`${basePath}/appointments/${appointment.id}/edit`);
  };

  const handleDelete = async (appointment: Appointment) => {
    const confirmed = await showConfirm(
      `Are you sure you want to cancel the appointment for ${appointment.patientName}?`
    );

    if (!confirmed) return;

    try {
      await cancelAppointment(appointment.id);
      await fetchAppointments();
    } catch (err) {
      showToast("Failed to cancel appointment", "error");
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchesSearch = 
        app.patientName.toLowerCase().includes(search.toLowerCase()) ||
        app.doctorName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All Status" || app.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, status]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const currentAppointments = filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  return (
    <div className="space-y-6">
      <AppointmentHeader />

      <AppointmentStats appointments={appointments} />

      <AppointmentToolbar 
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      <AppointmentTable
        appointments={currentAppointments}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTriage={user?.role === "ADMIN" ? handleTriage : undefined}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
          onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        />
      )}

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {isTriageOpen && selectedAppointment && (
        <TriageVitalsModal
          appointmentId={selectedAppointment.id}
          patientName={selectedAppointment.patientName}
          onClose={() => setIsTriageOpen(false)}
          onSuccess={() => {
            setIsTriageOpen(false);
            fetchAppointments(); // Refresh the list so status updates to READY_FOR_DOCTOR
          }}
        />
      )}
    </div>
  );
}
