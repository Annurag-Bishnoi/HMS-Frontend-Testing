export default function BedOccupancy() {
  const occupied = 182;
  const total = 250;

  const percentage = (occupied / total) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-semibold">
        Bed Occupancy
      </h2>

      <h1 className="text-5xl font-bold text-blue-600">
        {occupied}
      </h1>

      <p className="text-slate-500">
        Occupied out of {total}
      </p>

      <div className="mt-6 h-4 rounded-full bg-slate-200">

        <div
          className="h-4 rounded-full bg-blue-600"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="mt-3 font-semibold text-blue-600">
        {percentage.toFixed(0)}% Occupied
      </p>

    </div>
  );
}