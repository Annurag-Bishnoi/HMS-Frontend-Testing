import { motion } from "framer-motion";
import {
  UserPlus,
  CalendarCheck,
  Stethoscope,
  FlaskConical,
  Pill,
  CreditCard,
  FileText,
  CheckCircle,
} from "lucide-react";

const workflow = [
  {
    title: "Patient Registration",
    description: "New patient registers in the hospital.",
    icon: UserPlus,
    color: "bg-blue-500",
  },
  {
    title: "Appointment Booking",
    description: "Appointment scheduled with the doctor.",
    icon: CalendarCheck,
    color: "bg-green-500",
  },
  {
    title: "Doctor Consultation",
    description: "Doctor examines the patient.",
    icon: Stethoscope,
    color: "bg-cyan-500",
  },
  {
    title: "Laboratory Tests",
    description: "Required tests are performed.",
    icon: FlaskConical,
    color: "bg-orange-500",
  },
  {
    title: "Prescription",
    description: "Doctor prescribes medicines.",
    icon: Pill,
    color: "bg-pink-500",
  },
  {
    title: "Billing",
    description: "Payment and invoice generation.",
    icon: CreditCard,
    color: "bg-purple-500",
  },
  {
    title: "Medical Records",
    description: "Reports stored securely.",
    icon: FileText,
    color: "bg-red-500",
  },
  {
    title: "Treatment Complete",
    description: "Patient receives complete care.",
    icon: CheckCircle,
    color: "bg-emerald-600",
  },
];

export default function Workflow() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Hospital Workflow
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Complete Patient Journey
          </h2>

          <p className="mt-4 text-slate-500 max-w-3xl mx-auto">
            From registration to discharge, every step is managed
            efficiently through our Hospital Management System.
          </p>
        </div>

        <div className="relative">

          <div className="absolute left-8 top-0 h-full w-1 bg-blue-100"></div>

          <div className="space-y-10">

            {workflow.map((step, index) => {

              const Icon = step.icon;

              return (

                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  className="relative flex items-start gap-8"
                >

                  <div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-xl ${step.color}`}
                  >
                    <Icon size={28} />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-xl transition w-full">

                    <h3 className="text-xl font-bold text-slate-800">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-slate-500 leading-7">
                      {step.description}
                    </p>

                  </div>

                </motion.div>

              );

            })}

          </div>

        </div>

      </div>
    </section>
  );
}