import { motion } from "framer-motion";
import {
  UserPlus,
  CalendarDays,
  Stethoscope,
  ClipboardList,
  Pill,
  FlaskConical,
  CreditCard,
  HeartPulse,
  ShieldCheck,
  BarChart3,
  FileText,
  BellRing,
} from "lucide-react";

const features = [
  {
    title: "Patient Management",
    desc: "Register, update and maintain patient records.",
    icon: UserPlus,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Appointment Scheduling",
    desc: "Book appointments with doctors in real time.",
    icon: CalendarDays,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Doctor Management",
    desc: "Manage doctors, departments and schedules.",
    icon: Stethoscope,
    color: "from-cyan-500 to-sky-500",
  },
  {
    title: "Electronic Medical Records",
    desc: "Secure digital patient medical history.",
    icon: ClipboardList,
    color: "from-indigo-500 to-violet-500",
  },
  {
    title: "Pharmacy Management",
    desc: "Inventory and prescription management.",
    icon: Pill,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Laboratory",
    desc: "Manage laboratory tests and reports.",
    icon: FlaskConical,
    color: "from-orange-500 to-yellow-500",
  },
  {
    title: "Billing & Payments",
    desc: "Generate invoices and payment receipts.",
    icon: CreditCard,
    color: "from-red-500 to-orange-500",
  },
  {
    title: "Emergency Care",
    desc: "Fast emergency patient handling workflow.",
    icon: HeartPulse,
    color: "from-red-600 to-pink-500",
  },
  {
    title: "Security",
    desc: "Role based authentication and authorization.",
    icon: ShieldCheck,
    color: "from-slate-600 to-slate-800",
  },
  {
    title: "Analytics Dashboard",
    desc: "Monitor hospital performance with insights.",
    icon: BarChart3,
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    title: "Medical Reports",
    desc: "Download reports securely anytime.",
    icon: FileText,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Notifications",
    desc: "Appointment reminders and alerts.",
    icon: BellRing,
    color: "from-amber-500 to-orange-500",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            Modules
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Complete Hospital Management Solution
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-slate-500">
            Powerful enterprise modules designed to automate every hospital
            operation while ensuring security, efficiency and better patient care.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                }}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-2xl"
              >

                <div
                  className={`inline-flex rounded-2xl bg-gradient-to-r ${feature.color} p-4 text-white shadow-lg`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {feature.desc}
                </p>

              </motion.div>

            );

          })}

        </div>

      </div>
    </section>
  );
}