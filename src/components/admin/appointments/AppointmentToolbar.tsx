interface AppointmentToolbarProps {
  search: string;
  status: string;
  setStatus: (val: string) => void;
}

export default function AppointmentToolbar({
  search,
  setSearch,
  status,
  setStatus,
}: AppointmentToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        placeholder="Search patient or doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
      />

      <div className="flex gap-3">
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="All Status">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="READY_FOR_DOCTOR">Ready</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
