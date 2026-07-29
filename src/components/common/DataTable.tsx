import type { ReactNode } from "react";

export const tableRowClass =
  "border-b hover:bg-slate-50 transition-colors cursor-pointer group";

export const tableCellClass = "px-6 py-4";

export const tableHeadClass =
  "px-6 py-4 text-left font-semibold text-slate-700";

export const tableHeadActionsClass =
  "px-6 py-4 text-center font-semibold text-slate-700";

interface DataTableProps {
  children: ReactNode;
}

export default function DataTable({ children }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">{children}</table>
      </div>
    </div>
  );
}

interface EmptyRowProps {
  colSpan: number;
  message?: string;
}

export function TableEmptyRow({
  colSpan,
  message = "No records found.",
}: EmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10 text-center text-slate-500">
        {message}
      </td>
    </tr>
  );
}
