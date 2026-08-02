
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Users,
  CalendarDays,
  Activity,
} from "lucide-react";

import heroImage from "../../assets/images/hero/hero-dashboard.png";

export default function LoginIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col items-center"
    >
      {/* Heading */}
      <div className="mb-8 max-w-xl text-center lg:text-left">

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-slate-900"
        >
          Smart Hospital
          <span className="text-blue-600"> Management System</span>
        </motion.h1>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          Secure, Fast and Intelligent Healthcare Management Platform
          designed for Hospitals, Doctors, Nurses, Receptionists,
          Laboratories and Patients.
        </p>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4">

          <Feature text="Patient Management" />

          <Feature text="Appointment Scheduling" />

          <Feature text="Billing & Payments" />

          <Feature text="Analytics Dashboard" />

        </div>
      </div>

      {/* Image */}
      <motion.div
        whileHover={{
          scale: 1.02,
        }}
        transition={{
          duration: 0.3,
        }}
        className="relative"
      >

        <img
          src={heroImage}
          alt="Hospital Management System"
          className="w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl"
        />

        {/* Doctors */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-5 left-5 rounded-2xl bg-white px-5 py-4 shadow-xl"
        >
          <div className="flex items-center gap-3">

            <Users className="text-blue-600" size={24} />

            <div>

              <h3 className="text-2xl font-bold text-blue-600">
                500+
              </h3>

              <p className="text-sm text-slate-500">
                Doctors
              </p>

            </div>

          </div>
        </motion.div>

        {/* Patients */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute right-5 bottom-8 rounded-2xl bg-white px-5 py-4 shadow-xl"
        >
          <div className="flex items-center gap-3">

            <Activity className="text-green-600" size={24} />

            <div>

              <h3 className="text-2xl font-bold text-green-600">
                25K+
              </h3>

              <p className="text-sm text-slate-500">
                Patients
              </p>

            </div>

          </div>
        </motion.div>

        {/* Departments */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-6 rounded-2xl bg-white px-5 py-4 shadow-xl"
        >
          <div className="flex items-center gap-3">

            <CalendarDays
              className="text-purple-600"
              size={24}
            />

            <div>

              <h3 className="text-2xl font-bold text-purple-600">
                18+
              </h3>

              <p className="text-sm text-slate-500">
                Departments
              </p>

            </div>

          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}

interface FeatureProps {
  text: string;
}

function Feature({ text }: FeatureProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-3 shadow-md">

      <CheckCircle2
        size={20}
        className="text-blue-600"
      />

      <span className="font-medium text-slate-700">
        {text}
      </span>

    </div>
  );
}