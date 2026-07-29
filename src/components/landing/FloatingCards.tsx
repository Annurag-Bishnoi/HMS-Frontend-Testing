import { motion } from "framer-motion";
import {
  CalendarCheck,
  HeartPulse,
  Users,
  BedDouble,
} from "lucide-react";

export default function FloatingCards() {
  return (
    <>
      {/* Appointment */}

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute top-8 -left-8 w-56 rounded-2xl bg-white shadow-2xl p-4"
      >
        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3">

            <CalendarCheck className="text-blue-600" />

          </div>

          <div>

            <h4 className="font-semibold">
              Appointments
            </h4>

            <p className="text-sm text-slate-500">
              128 Today
            </p>

          </div>

        </div>
      </motion.div>

      {/* Patients */}

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute top-48 -right-10 w-56 rounded-2xl bg-white shadow-2xl p-4"
      >
        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-green-100 p-3">

            <Users className="text-green-600" />

          </div>

          <div>

            <h4 className="font-semibold">
              Patients
            </h4>

            <p className="text-sm text-slate-500">
              25,430 Registered
            </p>

          </div>

        </div>
      </motion.div>

      {/* ICU */}

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute bottom-12 -left-10 w-56 rounded-2xl bg-white shadow-2xl p-4"
      >
        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-orange-100 p-3">

            <BedDouble className="text-orange-600" />

          </div>

          <div>

            <h4 className="font-semibold">
              ICU Beds
            </h4>

            <p className="text-sm text-slate-500">
              18 Available
            </p>

          </div>

        </div>
      </motion.div>

      {/* Satisfaction */}

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute bottom-4 right-0 w-56 rounded-2xl bg-white shadow-2xl p-4"
      >
        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-pink-100 p-3">

            <HeartPulse className="text-pink-600" />

          </div>

          <div>

            <h4 className="font-semibold">
              Satisfaction
            </h4>

            <p className="text-sm text-slate-500">
              98% Positive
            </p>

          </div>

        </div>
      </motion.div>
    </>
  );
}