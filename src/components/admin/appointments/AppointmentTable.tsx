import type { Appointment } from "../../../types/appointment";
import AppointmentRow from "./AppointmentRow";
import DataTable, { TableEmptyRow } from "../../common/DataTable";
import { tableHeadClass, tableHeadActionsClass } from "../../common/DataTable";

type AppointmentTableProps = {
  appointments: Appointment[];
  onView: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  onTriage?: (appointment: Appointment) => void;
};

export default function AppointmentTable({
  appointments,
  onView,
  onEdit,
  onDelete,
  onTriage,
}: AppointmentTableProps) {
  return (
    <DataTable>
      <thead className="bg-slate-100 border-b border-slate-200">
        <tr>
          <th className={tableHeadClass}>Patient</th>
          <th className={tableHeadClass}>Patient ID</th>
          <th className={tableHeadClass}>Doctor</th>
          <th className={tableHeadClass}>Date</th>
          <th className={tableHeadClass}>Time</th>
          <th className={tableHeadClass}>Status</th>
          <th className={tableHeadActionsClass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onTriage={onTriage}
            />
          ))
        ) : (
          <TableEmptyRow colSpan={7} message="No appointments found." />
        )}
      </tbody>
    </DataTable>
  );
}
