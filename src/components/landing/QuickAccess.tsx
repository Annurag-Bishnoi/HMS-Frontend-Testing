import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  Stethoscope,
  FileText,
  Pill,
  BarChart3,
} from "lucide-react";

const cards = [
  {
    title: "Patient Management",
    description: "Register and manage patient records efficiently.",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Appointments",
    description: "Schedule and manage appointments with doctors.",
    icon: CalendarCheck,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Doctor Portal",
    description: "Manage doctors, departments and availability.",
    icon: Stethoscope,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
  {
    title: "Medical Records",
    description: "Secure Electronic Medical Record management.",
    icon: FileText,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    title: "Pharmacy",
    description: "Medicine inventory and prescription tracking.",
    icon: Pill,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Billing & Analytics",
    description: "Invoices, payments and hospital reports.",
    icon: BarChart3,
    color: "text-red-600",
    bg: "bg-red-100",
  },
];

export default function QuickAccess() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <h2 className="text-4xl font-bold text-slate-800">
            Everything You Need
          </h2>

          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Powerful modules designed to simplify hospital operations and
            improve patient care.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-2xl"
              >
                <div
                  className={`h-16 w-16 rounded-2xl flex items-center justify-center ${card.bg}`}
                >
                  <Icon className={card.color} size={32} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-800">
                  {card.title}
                </h3>

                <p className="mt-3 text-slate-500 leading-7">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}