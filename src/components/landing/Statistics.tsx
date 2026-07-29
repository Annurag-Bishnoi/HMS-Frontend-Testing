// import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  Users,
  Stethoscope,
  Building2,
  Activity,
  FileText,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    title: "Patients Served",
    value: 25000,
    suffix: "+",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Doctors",
    value: 500,
    suffix: "+",
    icon: Stethoscope,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Departments",
    value: 120,
    suffix: "+",
    icon: Building2,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Medical Records",
    value: 1000000,
    suffix: "+",
    icon: FileText,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "System Uptime",
    value: 99.9,
    suffix: "%",
    icon: Activity,
    color: "bg-purple-100 text-purple-600",
    decimal: true,
  },
  {
    title: "Secure Platform",
    value: 24,
    suffix: "/7",
    icon: ShieldCheck,
    color: "bg-red-100 text-red-600",
  },
];

export default function Statistics() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800">
            Trusted Healthcare Platform
          </h2>

          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Our Hospital Management System empowers hospitals with
            secure, reliable and intelligent healthcare solutions.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color}`}
                >
                  <Icon size={30} />
                </div>

              <h3 className="mt-6 text-5xl font-extrabold text-slate-800">
               {item.value}
               {item.suffix}
              </h3>

                <p className="mt-4 text-slate-500 text-lg">
                  {item.title}
                </p>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}