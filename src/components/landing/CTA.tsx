import { motion } from "framer-motion";
import { ArrowRight, Phone, CalendarCheck } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-24">

      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-700 via-cyan-600 to-blue-500"></div>

      {/* Decorative circles */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white">
            Start Your Digital Healthcare Journey
          </span>

          <h2 className="mt-8 text-5xl font-bold text-white leading-tight">
            Transform Your Hospital <br />
            With Smart Healthcare Solutions
          </h2>

          <p className="mt-8 max-w-3xl mx-auto text-lg text-blue-100 leading-8">
            Improve patient care, automate hospital workflows,
            manage appointments, doctors, billing and medical
            records from one secure platform.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-6">

            <button
              className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 shadow-xl transition hover:scale-105"
            >
              Get Started
              <ArrowRight size={20} />
            </button>

            <button
              className="flex items-center gap-2 rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
            >
              <CalendarCheck size={20} />
              Book Demo
            </button>

          </div>

          <div className="mt-14 flex justify-center gap-10 text-white">

            <div className="text-center">
              <h3 className="text-4xl font-bold">99.9%</h3>
              <p className="mt-2 text-blue-100">
                System Uptime
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-4xl font-bold">500+</h3>
              <p className="mt-2 text-blue-100">
                Hospitals
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-4xl font-bold">24×7</h3>
              <p className="mt-2 text-blue-100">
                Support
              </p>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}