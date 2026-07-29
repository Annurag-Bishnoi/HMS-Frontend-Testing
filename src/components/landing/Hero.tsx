import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Users,
  Calendar,
  Siren,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/images/hero/hero-dashboard.png";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pt-32 pb-24">
      {/* Background Blur */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl"></div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-10">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
           🏥 Enterprise Hospital Management Platform
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
           Smart Multi-Role
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Hospital Management
            </span>
           System
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          A unified healthcare platform for administrators, doctors, nurses,
          receptionists, pharmacists and patients with integrated billing,
          analytics and secure electronic medical records.
          </p>

          <div className="mt-8 flex gap-12">

    <div>
        <h2 className="text-4xl font-bold text-blue-600">
            450+
        </h2>

        <p className="text-slate-500">
            Doctors
        </p>
    </div>

    <div>
        <h2 className="text-4xl font-bold text-cyan-600">
            25K+
        </h2>

        <p className="text-slate-500">
            Patients
        </p>
    </div>

    <div>
        <h2 className="text-3xl font-bold text-green-600">
            120+
        </h2>

        <p className="text-slate-500">
            Departments
        </p>
    </div>

</div>




          <div className="mt-10 flex flex-wrap gap-4">
           <button
             onClick={() => navigate("/login")}
           className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:scale-105 hover:bg-blue-700"
>
              Login Portal
              <ArrowRight size={18} />
            </button>

            <button className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:-translate-y-1 hover:scale-105 hover:bg-slate-100">
              <PlayCircle size={18} />
              Explore Features
            </button>
          </div>

                 {/* Some Changes */}

        <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-600">

  <div className="flex items-center gap-2">
    <div className="h-2 w-2 rounded-full bg-green-500"></div>
    <span>HIPAA Inspired Security</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
    <span>Role-Based Access</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
    <span>24×7 Availability</span>
  </div>

</div>

        </motion.div>

 

{/* Right Content */}

<motion.div
  initial={{ opacity: 0, x: 80 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  className="relative flex justify-center lg:justify-end"
>

  {/* Background Glow */}

  <div className="absolute inset-0 -z-10 rounded-full bg-cyan-400/20 blur-[140px]" />

  {/* Main Image */}

  <img
    src={heroImage}
    alt="Modern Hospital"
    className="w-full max-w-3xl rounded-3xl object-cover drop-shadow-2xl"
  />

  {/* Appointment Card */}

  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ repeat: Infinity, duration: 5 }}
    className="absolute left-2 top-12 rounded-2xl bg-white/95 px-5 py-4 shadow-xl backdrop-blur-md"
  >
    <div className="flex items-center gap-3">
      <Users className="text-blue-600" />

      <div>
        <p className="text-xs text-slate-500">
          Today's Appointments
        </p>

        <h3 className="font-bold">
          126
        </h3>
      </div>
    </div>
  </motion.div>

  {/* Bed Card */}

  <motion.div
    animate={{ y: [0, 10, 0] }}
    transition={{ repeat: Infinity, duration: 6 }}
    className="absolute right-4 top-20 rounded-2xl bg-white/95 px-5 py-4 shadow-xl backdrop-blur-md"
  >
    <div className="flex items-center gap-3">
      <Calendar className="text-green-600" />

      <div>
        <p className="text-xs text-slate-500">
          Bed Availability
        </p>

        <h3 className="font-bold">
          18 Beds
        </h3>
      </div>
    </div>
  </motion.div>

  {/* Emergency */}

  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ repeat: Infinity, duration: 4 }}
    className="absolute bottom-10 right-10 rounded-2xl bg-white/95 px-5 py-4 shadow-xl backdrop-blur-md"
  >
    <div className="flex items-center gap-3">
      <Siren className="text-red-600" />

      <div>
        <p className="text-xs text-slate-500">
          Emergency
        </p>

        <h3 className="font-bold text-red-600">
          Active
        </h3>
      </div>
    </div>
  </motion.div>

</motion.div>

        


      

      </div>
    </section>
  );
}