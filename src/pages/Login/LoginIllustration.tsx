import { motion } from "framer-motion";
import heroImage from "../../assets/images/hero/hero-dashboard.png";

export default function LoginIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >

      <img
        src={heroImage}
        alt="Hospital Dashboard"
        className="w-full max-w-xl rounded-3xl shadow-2xl"
      />

      <div className="absolute -top-6 left-0 rounded-2xl bg-white p-4 shadow-xl">
        <h3 className="font-bold text-blue-600">500+</h3>
        <p className="text-sm text-slate-500">
          Doctors
        </p>
      </div>

      <div className="absolute right-0 bottom-10 rounded-2xl bg-white p-4 shadow-xl">
        <h3 className="font-bold text-green-600">
          25K+
        </h3>

        <p className="text-sm text-slate-500">
          Patients
        </p>
      </div>

    </motion.div>
  );
}