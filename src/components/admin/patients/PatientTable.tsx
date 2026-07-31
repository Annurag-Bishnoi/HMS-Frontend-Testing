import { useState, useEffect } from "react";
import PatientRow from "./PatientRow";
import PatientDetailsModal from "./PatientDetailsModal";
import Pagination from "../../common/Pagination";
import DataTable, { TableEmptyRow } from "../../common/DataTable";
import { tableHeadClass, tableHeadActionsClass } from "../../common/DataTable";
import { getPatients, updatePatientStatus } from "../../../api/patientService";
import type { Patient } from "../../../api/patientService";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

interface Props {
  search: string;
  department: string;
  status: string;
}

export default function PatientTable({ search, status }: Omit<Props, 'department'>) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data.reverse());
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (patient: Patient) => {
    try {
      const newStatus = patient.status === "Admitted" ? false : true;
      await updatePatientStatus(patient.id!.toString(), newStatus);
      await fetchPatients();
    } catch (err: any) {
      showToast("Failed to change status: " + (err.response?.data?.message || err.message, "error"));
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      String(patient.id).toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "All" || patient.status === status;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + rowsPerPage);

  if (loading) {
    return <div className="text-center py-10">Loading patients...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <>
      <DataTable>
        <thead className="bg-slate-100 border-b border-slate-200">
          <tr>
            <th className={tableHeadClass}>ID</th>
            <th className={tableHeadClass}>Patient</th>
            <th className={tableHeadClass}>Age</th>
            <th className={tableHeadClass}>Gender</th>
            <th className={tableHeadClass}>Phone</th>
            <th className={tableHeadClass}>Blood Group</th>
            <th className={tableHeadClass}>Status</th>
            <th className={tableHeadActionsClass}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length > 0 ? (
            currentPatients.map((patient) => (
              <PatientRow
                key={patient.id}
                patient={patient as any}
                onView={setSelectedPatient}
                onToggleStatus={handleToggleStatus}
              />
            ))
          ) : (
            <TableEmptyRow colSpan={8} message="No patients found." />
          )}
        </tbody>
      </DataTable>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
      />

      <PatientDetailsModal
        patient={selectedPatient as any}
        onClose={() => setSelectedPatient(null)}
      />
    </>
  );
}
