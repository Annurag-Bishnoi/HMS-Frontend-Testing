import type { Doctor } from "../../../types/doctor";
import DoctorRow from "./DoctorRow";
import DataTable, { TableEmptyRow } from "../../common/DataTable";
import { tableHeadClass, tableHeadActionsClass } from "../../common/DataTable";

type DoctorTableProps = {
  doctors: Doctor[];
  onView: (doc: Doctor) => void;
  onEdit: (doc: Doctor) => void;
  onToggleStatus: (doc: Doctor) => void;
};

export default function DoctorTable({
  doctors,
  onView,
  onEdit,
  onToggleStatus,
}: DoctorTableProps) {
  return (
    <DataTable>
      <thead className="bg-slate-100 border-b border-slate-200">
        <tr>
          <th className={tableHeadClass}>Name</th>
          <th className={tableHeadClass}>Department</th>
          <th className={tableHeadClass}>Specialization</th>
          <th className={tableHeadClass}>Experience</th>
          <th className={tableHeadClass}>Status</th>
          <th className={tableHeadActionsClass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <DoctorRow
              key={doctor.id}
              doctor={doctor}
              onView={onView}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
            />
          ))
        ) : (
          <TableEmptyRow colSpan={6} message="No doctors found." />
        )}
      </tbody>
    </DataTable>
  );
}
