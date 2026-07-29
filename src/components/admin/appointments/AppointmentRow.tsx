import { UserCheck } from "lucide-react";
import type { Appointment } from "../../../types/appointment";
import { getUser } from "../../../utils/token";
import TableStatusBadge from "../../common/TableStatusBadge";
import {
  TableViewButton,
  TableEditButton,
  TableDeleteButton,
  TableCustomActionButton,
  TableActionCell,
} from "../../common/TableActions";
import { tableRowClass, tableCellClass } from "../../common/DataTable";

interface AppointmentRowProps {
  appointment: Appointment;
  onView: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  onTriage?: (appointment: Appointment) => void;
}

export default function AppointmentRow({
  appointment,
  onView,
  onEdit,
  onDelete,
  onTriage,
}: AppointmentRowProps) {
  const user = getUser();
  const isAdmin = user?.role === "ADMIN";
  const status = appointment.status?.toUpperCase() ?? "";

  return (
    <tr className={tableRowClass}>
      <td className={tableCellClass}>{appointment.patientName}</td>
      <td className={`${tableCellClass} font-semibold`}>{appointment.patientId}</td>
      <td className={tableCellClass}>{appointment.doctorName}</td>
      <td className={tableCellClass}>{appointment.department}</td>
      <td className={tableCellClass}>{appointment.appointmentDate}</td>
      <td className={tableCellClass}>{appointment.appointmentTime}</td>
      <td className={tableCellClass}>
        <TableStatusBadge status={appointment.status || "—"} />
      </td>
      <TableActionCell>
        {onTriage &&
          (status === "WAITING_FOR_VITALS" ||
            (status === "SCHEDULED" && appointment.paymentStatus === "PAID")) && (
            <TableCustomActionButton
              onClick={() => onTriage(appointment)}
              title="Take Vitals & Check-in"
              icon={UserCheck}
              variant="indigo"
            />
          )}
        <TableViewButton onClick={() => onView(appointment)} title="View" />
        <TableEditButton onClick={() => onEdit(appointment)} title="Edit" />
        {isAdmin && (
          <TableDeleteButton onClick={() => onDelete(appointment)} title="Delete" />
        )}
      </TableActionCell>
    </tr>
  );
}
