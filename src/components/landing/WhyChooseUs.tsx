import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock3,
  Cpu,
  Smartphone,
  Database,
  Headphones,
} from "lucide-react";

const reasons = [
  {
    title: "Enterprise Security",
    description: "JWT authentication, encrypted records and role-based access.",
    icon: ShieldCheck,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "24×7 Availability",
    description: "Reliable cloud platform with high uptime for hospital operations.",
    icon: Clock3,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Smart Automation",
    description: "Reduce paperwork with intelligent workflows and automation.",
    icon: Cpu,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Responsive Design",
    description: "Works seamlessly across desktop, tablet and mobile devices.",
    icon: Smartphone,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Centralized Database",
    description: "Securely manage patients, doctors, appointments and reports.",
    icon: Database,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Dedicated Support",
    description: "Continuous technical support and future scalability.",
    icon: Headphones,
    color: "bg-red-100 text-red-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Why Choose Us
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Built for Modern Healthcare
          </h2>

          <p className="mt-4 max-w-3xl mx-auto text-slate-500">
            Our Hospital Management System combines security, automation and
            scalability to deliver an exceptional healthcare experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {reasons.map((item, index) => {

            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all"
              >
                <div
                  className={`inline-flex rounded-2xl p-4 ${item.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-800">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-500">
                  {item.description}
                </p>

              </motion.div>
            );

          })}

        </div>

      </div>
    </section>
  );
}