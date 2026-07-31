import type { Doctor } from "../../../types/doctor";
import TableStatusBadge from "../../common/TableStatusBadge";
import { TableViewButton, TableEditButton, TableCustomActionButton, TableActionCell } from "../../common/TableActions";
import { tableRowClass, tableCellClass } from "../../common/DataTable";
import { Power } from "lucide-react";

interface DoctorRowProps {
  doctor: Doctor;
  onView: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
  onToggleStatus: (doctor: Doctor) => void;
}

export default function DoctorRow({
  doctor,
  onView,
  onEdit,
  onToggleStatus,
}: DoctorRowProps) {
  return (
    <tr className={tableRowClass}>
      <td className={tableCellClass}>{doctor?.name || "Unknown"}</td>
      <td className={tableCellClass}>{doctor?.department || "General"}</td>
      <td className={tableCellClass}>{doctor?.specialization || "N/A"}</td>
      <td className={tableCellClass}>
        <div className="flex flex-col">
          <span className="text-sm text-slate-800">{doctor?.phone || "No Phone"}</span>
          <span className="text-xs text-slate-500">{doctor?.email || "No Email"}</span>
        </div>
      </td>
      <td className={tableCellClass}>{doctor?.experience || 0} Years</td>
      <td className={tableCellClass}>
        <TableStatusBadge
          status={doctor?.status || "Unknown"}
          variant={doctor?.status === "Active" ? "green" : "red"}
        />
      </td>
      <TableActionCell>
        <TableViewButton onClick={() => onView(doctor)} title="View" />
        <TableEditButton onClick={() => onEdit(doctor)} title="Edit" />
        <TableCustomActionButton
          icon={Power}
          onClick={() => onToggleStatus(doctor)}
          title={doctor?.status === "Active" ? "Mark as Inactive" : "Mark as Active"}
          variant={doctor?.status === "Active" ? "amber" : "emerald"}
        />
      </TableActionCell>
    </tr>
  );
}
