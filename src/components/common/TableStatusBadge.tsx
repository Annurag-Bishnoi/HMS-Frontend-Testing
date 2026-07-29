interface Props {
  status: string;
  variant?: "green" | "blue" | "amber" | "red" | "yellow" | "slate" | "purple";
}

const VARIANT_STYLES: Record<NonNullable<Props["variant"]>, string> = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  slate: "bg-slate-100 text-slate-700",
  purple: "bg-purple-100 text-purple-700",
};

const STATUS_VARIANTS: Record<string, NonNullable<Props["variant"]>> = {
  Admitted: "green",
  Discharged: "blue",
  "Under Treatment": "yellow",
  Available: "green",
  Unavailable: "red",
  Active: "green",
  Inactive: "red",
  SCHEDULED: "yellow",
  COMPLETED: "green",
  READY_FOR_DOCTOR: "blue",
  WAITING_FOR_VITALS: "amber",
  CANCELLED: "red",
  PENDING: "amber",
  IN_PROGRESS: "blue",
  Occupied: "amber",
  Maintenance: "slate",
  Healthy: "green",
  "Low Stock": "red",
  Discontinued: "slate",
  SUCCESS: "green",
  ERROR: "red",
};

export function getStatusVariant(status: string): NonNullable<Props["variant"]> {
  const upper = status?.toUpperCase?.() ?? "";
  return STATUS_VARIANTS[upper] || STATUS_VARIANTS[status] || "slate";
}

export default function TableStatusBadge({ status, variant }: Props) {
  const resolvedVariant = variant ?? getStatusVariant(status);
  const label = status?.replace(/_/g, " ") ?? "—";

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold ${VARIANT_STYLES[resolvedVariant]}`}
    >
      {label}
    </span>
  );
}
