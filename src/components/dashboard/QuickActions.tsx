import {
  UserPlus,
  CalendarPlus,
  FilePlus2,
  CreditCard,
} from "lucide-react";

const actions = [
  {
    title: "Add Patient",
    icon: UserPlus,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "New Appointment",
    icon: CalendarPlus,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Create Prescription",
    icon: FilePlus2,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Generate Bill",
    icon: CreditCard,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="rounded-xl border border-slate-200 p-5 transition hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon size={28} />
              </div>

              <p className="font-semibold">
                {item.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}