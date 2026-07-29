import React from "react";
import { Power } from "lucide-react";
import type { InventoryItem } from "../../../api/pharmacyService";
import DataTable, { TableEmptyRow } from "../../common/DataTable";
import { tableHeadClass, tableHeadActionsClass, tableRowClass, tableCellClass } from "../../common/DataTable";
import TableStatusBadge from "../../common/TableStatusBadge";
import {
  TableViewButton,
  TableEditButton,
  TableCustomActionButton,
  TableActionCell,
} from "../../common/TableActions";

interface InventoryTableProps {
  inventory: InventoryItem[];
  onView: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onToggleStatus: (item: InventoryItem) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <DataTable>
      <thead className="bg-slate-100 border-b border-slate-200">
        <tr>
          <th className={tableHeadClass}>Medicine Name</th>
          <th className={tableHeadClass}>CIEL ID</th>
          <th className={tableHeadClass}>Total Stock</th>
          <th className={tableHeadClass}>Reorder Level</th>
          <th className={tableHeadClass}>Status</th>
          <th className={tableHeadClass}>Nearest Expiry</th>
          <th className={tableHeadActionsClass}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {inventory.length === 0 ? (
          <TableEmptyRow colSpan={7} message="No inventory items found." />
        ) : (
          inventory.map((item) => {
            const currentActive = item.isActive ?? item.active ?? true;
            const statusLabel = !currentActive
              ? "Discontinued"
              : item.isLowStock
              ? "Low Stock"
              : "Healthy";

            return (
              <tr key={item.inventoryItemId} className={tableRowClass}>
                <td className={tableCellClass}>{item.medicineName}</td>
                <td className={`${tableCellClass} font-semibold`}>{item.cielConceptId}</td>
                <td className={tableCellClass}>{item.totalStock}</td>
                <td className={tableCellClass}>{item.reorderLevel}</td>
                <td className={tableCellClass}>
                  <TableStatusBadge status={statusLabel} />
                </td>
                <td className={tableCellClass}>
                  {item.nearestExpiryDate
                    ? new Date(item.nearestExpiryDate).toLocaleDateString()
                    : "—"}
                </td>
                <TableActionCell>
                  <TableViewButton onClick={() => onView(item)} title="View Details" />
                  <TableEditButton onClick={() => onEdit(item)} title="Edit Inventory" />
                  <TableCustomActionButton
                    onClick={() => onToggleStatus(item)}
                    title={currentActive ? "Discontinue Item" : "Re-activate Item"}
                    icon={Power}
                    variant={currentActive ? "slate" : "emerald"}
                  />
                </TableActionCell>
              </tr>
            );
          })
        )}
      </tbody>
    </DataTable>
  );
};

export default InventoryTable;
