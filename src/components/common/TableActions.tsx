import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface ActionButtonProps {
  onClick: () => void;
  title?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  children?: ReactNode;
}

const VARIANTS = {
  view: "rounded-lg bg-sky-100 p-2 hover:bg-sky-200",
  edit: "rounded-lg bg-yellow-100 p-2 hover:bg-yellow-200",
  delete: "rounded-lg bg-red-100 p-2 hover:bg-red-200",
  indigo: "rounded-lg bg-indigo-100 p-2 hover:bg-indigo-200",
  emerald: "rounded-lg bg-emerald-100 p-2 hover:bg-emerald-200",
  slate: "rounded-lg bg-slate-100 p-2 hover:bg-slate-200",
  amber: "rounded-lg bg-amber-100 p-2 hover:bg-amber-200",
} as const;

const ICON_VARIANTS = {
  view: "text-sky-600",
  edit: "text-yellow-600",
  delete: "text-red-600",
  indigo: "text-indigo-600",
  emerald: "text-emerald-600",
  slate: "text-slate-600",
  amber: "text-amber-600",
} as const;

type ActionVariant = keyof typeof VARIANTS;

function TableActionButton({
  onClick,
  title,
  disabled,
  icon: Icon,
  children,
  variant,
}: ActionButtonProps & { variant: ActionVariant }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${VARIANTS[variant]} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
    >
      {Icon ? <Icon size={18} className={ICON_VARIANTS[variant]} /> : children}
    </button>
  );
}

export function TableViewButton(props: ActionButtonProps) {
  return <TableActionButton {...props} variant="view" icon={props.icon ?? Eye} />;
}

export function TableEditButton(props: ActionButtonProps) {
  return <TableActionButton {...props} variant="edit" icon={props.icon ?? Pencil} />;
}

export function TableDeleteButton(props: ActionButtonProps) {
  return <TableActionButton {...props} variant="delete" icon={props.icon ?? Trash2} />;
}

export function TableCustomActionButton(
  props: ActionButtonProps & { variant?: ActionVariant }
) {
  return (
    <TableActionButton
      {...props}
      variant={props.variant ?? "slate"}
      icon={props.icon}
    />
  );
}

export function TableActionCell({ children }: { children: ReactNode }) {
  return (
    <td className="px-6 py-4">
      <div className="flex justify-center gap-2">{children}</div>
    </td>
  );
}
