import { useNavigate } from "react-router-dom";
import { getUser } from "../../../utils/token";
import TableStatusBadge from "../../common/TableStatusBadge";
import { TableViewButton, TableEditButton, TableDeleteButton, TableActionCell } from "../../common/TableActions";
import { tableRowClass, tableCellClass } from "../../common/DataTable";

interface Patient {
  id?: number;
  registrationNo?: string;
  name: string;
  age: number;
  gender: string;
  mobile: string;
  bloodGroup?: string;
  status?: string;
}

interface Props {
  patient: Patient;
  onView: (patient: Patient) => void;
  onDelete: (id: number) => void;
}

export default function PatientRow({ patient, onView, onDelete }: Props) {
  const navigate = useNavigate();
  const user = getUser();
  const basePath = user?.role === "RECEPTIONIST" ? "/receptionist" : "/admin";
  const isAdmin = user?.role === "ADMIN";

  return (
    <tr className={tableRowClass}>
      <td className={`${tableCellClass} font-semibold`}>{patient.registrationNo}</td>
      <td className={tableCellClass}>{patient.name}</td>
      <td className={tableCellClass}>{patient.age}</td>
      <td className={tableCellClass}>{patient.gender}</td>
      <td className={tableCellClass}>{patient.mobile}</td>
      <td className={tableCellClass}>{patient.bloodGroup}</td>
      <td className={tableCellClass}>
        <TableStatusBadge status={patient.status || "—"} />
      </td>
      <TableActionCell>
        <TableViewButton onClick={() => onView(patient)} title="View" />
        <TableEditButton
          onClick={() => navigate(`${basePath}/patients/edit/${patient.id}`)}
          title="Edit"
        />
        {isAdmin && (
          <TableDeleteButton
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this patient?")) {
                if (patient.id) onDelete(patient.id);
              }
            }}
            title="Delete"
          />
        )}
      </TableActionCell>
    </tr>
  );
}
