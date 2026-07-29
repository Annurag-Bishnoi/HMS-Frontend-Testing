import type { Doctor } from "../../../types/doctor";
import TableStatusBadge from "../../common/TableStatusBadge";
import { TableViewButton, TableEditButton, TableDeleteButton, TableActionCell } from "../../common/TableActions";
import { tableRowClass, tableCellClass } from "../../common/DataTable";

interface DoctorRowProps {
  doctor: Doctor;
  onView: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export default function DoctorRow({
  doctor,
  onView,
  onEdit,
  onDelete,
}: DoctorRowProps) {
  return (
    <tr className={tableRowClass}>
      <td className={tableCellClass}>{doctor.name}</td>
      <td className={tableCellClass}>{doctor.department}</td>
      <td className={tableCellClass}>{doctor.specialization}</td>
      <td className={tableCellClass}>{doctor.experience} Years</td>
      <td className={tableCellClass}>
        <TableStatusBadge
          status={doctor.status}
          variant={doctor.status === "Available" ? "green" : "red"}
        />
      </td>
      <TableActionCell>
        <TableViewButton onClick={() => onView(doctor)} title="View" />
        <TableEditButton onClick={() => onEdit(doctor)} title="Edit" />
        <TableDeleteButton onClick={() => onDelete(doctor)} title="Delete" />
      </TableActionCell>
    </tr>
  );
}
