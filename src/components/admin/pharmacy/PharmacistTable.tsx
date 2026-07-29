import { Lock, Power } from "lucide-react";
import DataTable, { TableEmptyRow } from "../../common/DataTable";
import { tableHeadClass, tableHeadActionsClass, tableRowClass, tableCellClass } from "../../common/DataTable";
import TableStatusBadge from "../../common/TableStatusBadge";
import {
  TableViewButton,
  TableEditButton,
  TableCustomActionButton,
  TableActionCell,
} from "../../common/TableActions";

interface PharmacistTableProps {
  pharmacists: any[];
  onView: (staff: any) => void;
  onEdit: (staff: any) => void;
  onDelete: (staff: any) => void;
  onToggleStatus: (staff: any) => void;
  actionLoading: number | null;
}

export default function PharmacistTable({
  pharmacists,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  actionLoading,
}: PharmacistTableProps) {
  return (
    <DataTable>
      <thead className="bg-slate-100 border-b border-slate-200">
        <tr>
          <th className={tableHeadClass}>ID</th>
          <th className={tableHeadClass}>Pharmacist</th>
          <th className={tableHeadClass}>Username</th>
          <th className={tableHeadClass}>Email</th>
          <th className={tableHeadClass}>Phone</th>
          <th className={tableHeadClass}>Status</th>
          <th className={tableHeadActionsClass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {pharmacists.length === 0 ? (
          <TableEmptyRow colSpan={7} message="No pharmacists found." />
        ) : (
          pharmacists.map((staff) => {
            const isLoading = actionLoading === staff.userId;
            return (
              <tr key={staff.userId} className={tableRowClass}>
                <td className={`${tableCellClass} font-semibold`}>{staff.userId}</td>
                <td className={tableCellClass}>{staff.fullName}</td>
                <td className={tableCellClass}>@{staff.username}</td>
                <td className={tableCellClass}>{staff.email || "—"}</td>
                <td className={tableCellClass}>{staff.phone || "—"}</td>
                <td className={tableCellClass}>
                  <div className="flex flex-col items-start gap-1">
                    <TableStatusBadge
                      status={staff.active ? "Active" : "Inactive"}
                      variant={staff.active ? "green" : "red"}
                    />
                    {staff.accountLocked && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>
                </td>
                <TableActionCell>
                  <TableViewButton onClick={() => onView(staff)} title="View Details & Reset Password" />
                  <TableEditButton
                    onClick={() => onEdit(staff)}
                    disabled={isLoading}
                    title="Edit Staff Details"
                  />
                  <TableCustomActionButton
                    onClick={() => onToggleStatus(staff)}
                    disabled={isLoading}
                    title={staff.active ? "Deactivate Staff" : "Activate Staff"}
                    icon={Power}
                    variant={staff.active ? "slate" : "emerald"}
                  />
                </TableActionCell>
              </tr>
            );
          })
        )}
      </tbody>
    </DataTable>
  );
}
