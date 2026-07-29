import { useState } from "react";
import { X } from "lucide-react";
import DataTable, { TableEmptyRow } from "../../common/DataTable";
import { tableHeadClass, tableHeadActionsClass, tableRowClass, tableCellClass } from "../../common/DataTable";
import TableStatusBadge from "../../common/TableStatusBadge";
import { TableViewButton, TableActionCell } from "../../common/TableActions";

interface LabTestsTableProps {
  labTests: any[];
}

export default function LabTestsTable({ labTests }: LabTestsTableProps) {
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  return (
    <>
      <DataTable>
        <thead className="bg-slate-100 border-b border-slate-200">
          <tr>
            <th className={tableHeadClass}>Test Code</th>
            <th className={tableHeadClass}>Test Name</th>
            <th className={tableHeadClass}>Patient</th>
            <th className={tableHeadClass}>Assigned By</th>
            <th className={tableHeadClass}>Recorded At</th>
            <th className={tableHeadClass}>Status</th>
            <th className={tableHeadActionsClass}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {labTests.length === 0 ? (
            <TableEmptyRow colSpan={7} message="No laboratory tests found." />
          ) : (
            labTests.map((test) => (
              <tr key={test.testId} className={tableRowClass}>
                <td className={`${tableCellClass} font-semibold`}>{test.testCode}</td>
                <td className={tableCellClass}>{test.testName}</td>
                <td className={tableCellClass}>{test.patientName}</td>
                <td className={tableCellClass}>Dr. {test.doctorName}</td>
                <td className={tableCellClass}>
                  {test.recordedAt ? new Date(test.recordedAt).toLocaleString() : "—"}
                </td>
                <td className={tableCellClass}>
                  <TableStatusBadge status={test.status} />
                </td>
                <TableActionCell>
                  {test.status === "COMPLETED" ? (
                    <TableViewButton
                      onClick={() => setSelectedResult(test)}
                      title="View Result"
                    />
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </TableActionCell>
              </tr>
            ))
          )}
        </tbody>
      </DataTable>

      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Test Result</h2>
                <p className="text-sm text-slate-500">{selectedResult.testName}</p>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Result Value</h3>
                  <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                    <p className="text-slate-900 font-medium">
                      {selectedResult.resultValue || "No result data recorded."}
                    </p>
                  </div>
                </div>

                {selectedResult.remarks && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Remarks / Notes</h3>
                    <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
                      <p className="text-slate-800 text-sm whitespace-pre-wrap">
                        {selectedResult.remarks}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-slate-500">Patient</p>
                    <p className="text-sm font-medium text-slate-700">{selectedResult.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Doctor</p>
                    <p className="text-sm font-medium text-slate-700">
                      Dr. {selectedResult.doctorName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
