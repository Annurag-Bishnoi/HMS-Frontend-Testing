import { motion } from "framer-motion";
import {
  Shield,
  Stethoscope,
  UserRound,
  ClipboardPlus,
  Pill,
  Wallet,
  ArrowRight,
} from "lucide-react";

const portals = [
  {
    title: "Administrator",
    description:
      "Manage users, departments, reports and complete hospital operations.",
    icon: Shield,
    color: "from-blue-600 to-cyan-500",
  },
  {
    title: "Doctor",
    description:
      "View appointments, patient history and write prescriptions.",
    icon: Stethoscope,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Receptionist",
    description:
      "Register patients and manage appointments efficiently.",
    icon: ClipboardPlus,
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Patient",
    description:
      "Book appointments, view prescriptions and medical reports.",
    icon: UserRound,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Pharmacist",
    description:
      "Manage medicines, prescriptions and inventory.",
    icon: Pill,
    color: "from-red-500 to-pink-500",
  },
  {
    title: "Accountant",
    description:
      "Generate invoices, payments and financial reports.",
    icon: Wallet,
    color: "from-indigo-500 to-violet-500",
  },
];

export default function RolePortals() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Multi Role Access
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Dedicated Portal For Every User
          </h2>

          <p className="mt-4 text-slate-500 max-w-3xl mx-auto">
            Secure role-based dashboards ensure every user gets the right
            tools and information to perform their responsibilities efficiently.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {portals.map((portal, index) => {
            const Icon = portal.icon;

            return (
              <motion.div
                key={portal.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-md hover:shadow-2xl transition-all"
              >
                <div
                  className={`inline-flex rounded-2xl bg-gradient-to-r ${portal.color} p-4 text-white shadow-lg`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-800">
                  {portal.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-500">
                  {portal.description}
                </p>

                <button className="mt-8 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white transition-all group-hover:bg-blue-600">
                  Access Portal
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}