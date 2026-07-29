import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Rajesh Sharma",
    role: "Senior Cardiologist",
    review:
      "The Hospital Management System has simplified appointment scheduling and patient record management. It saves valuable time every day.",
  },
  {
    name: "Priya Verma",
    role: "Hospital Administrator",
    review:
      "Managing departments, staff and reports has become much easier. The dashboard is intuitive and provides excellent insights.",
  },
  {
    name: "Amit Kumar",
    role: "Patient",
    review:
      "Booking appointments and accessing my prescriptions online is quick and convenient. The experience is smooth and user-friendly.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Testimonials
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            What People Say About Our System
          </h2>

          <p className="mt-4 max-w-3xl mx-auto text-slate-500">
            Trusted by doctors, administrators and patients for delivering a
            seamless healthcare management experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <Quote className="text-blue-600 mb-4" size={36} />

              <p className="leading-7 text-slate-600">
                "{item.review}"
              </p>

              <div className="flex mt-6">
                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="text-slate-500">
                  {item.role}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}