import React from "react";
import { Stethoscope } from "lucide-react";
import type { Prescription } from "../../../api/pharmacyService";
import DataTable, { TableEmptyRow } from "../../common/DataTable";
import { tableHeadClass, tableHeadActionsClass, tableRowClass, tableCellClass } from "../../common/DataTable";
import { TableActionCell } from "../../common/TableActions";

interface PendingPrescriptionsTableProps {
  prescriptions: Prescription[];
  onDispense: (prescription: Prescription) => void;
  onDiscard?: (prescription: Prescription) => void;
}

const PendingPrescriptionsTable: React.FC<PendingPrescriptionsTableProps> = ({
  prescriptions,
  onDispense,
  onDiscard,
}) => {
  return (
    <DataTable>
      <thead className="bg-slate-100 border-b border-slate-200">
        <tr>
          <th className={tableHeadClass}>Prescription ID</th>
          <th className={tableHeadClass}>Patient</th>
          <th className={tableHeadClass}>Doctor</th>
          <th className={tableHeadClass}>Medicines</th>
          <th className={tableHeadClass}>Date Created</th>
          <th className={tableHeadActionsClass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {prescriptions.length === 0 ? (
          <TableEmptyRow colSpan={6} message="No pending prescriptions at the moment." />
        ) : (
          prescriptions.map((prescription) => (
            <tr key={prescription.prescriptionId} className={tableRowClass}>
              <td className={`${tableCellClass} font-semibold`}>
                #PRE-{prescription.prescriptionId}
              </td>
              <td className={tableCellClass}>
                {prescription.patient?.name || `Patient #${prescription.patient?.patientId}`}
              </td>
              <td className={tableCellClass}>
                Dr. {prescription.doctor?.name || prescription.doctor?.doctorId}
              </td>
              <td className="px-6 py-4 text-slate-600 text-xs max-w-[200px] truncate" title={prescription.medications?.map((m: any) => `${m.medicineName} (${m.quantity})`).join(', ')}>
                {prescription.medications?.length 
                  ? prescription.medications.map((m: any) => `${m.medicineName} (${m.quantity})`).join(', ') 
                  : '—'}
              </td>
              <td className={tableCellClass}>
                {new Date(prescription.createdAt).toLocaleString()}
              </td>
              <TableActionCell>
                <div className="flex gap-2">
                  <button
                    onClick={() => onDispense(prescription)}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-200 transition-colors"
                  >
                    <Stethoscope size={16} />
                    Dispense
                  </button>
                  {onDiscard && (
                    <button
                      onClick={() => onDiscard(prescription)}
                      className="inline-flex items-center gap-2 rounded-lg bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200 transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </TableActionCell>
            </tr>
          ))
        )}
      </tbody>
    </DataTable>
  );
};

export default PendingPrescriptionsTable;
