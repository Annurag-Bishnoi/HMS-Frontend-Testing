import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
} from "lucide-react";

const cards = [
  {
    title: "Total Patients",
    value: "25,430",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Appointments",
    value: "1,248",
    icon: Calendar,
    color: "bg-green-500",
  },
  {
    title: "Revenue",
    value: "₹18.5L",
    icon: DollarSign,
    color: "bg-orange-500",
  },
  {
    title: "Hospital Growth",
    value: "+18%",
    icon: TrendingUp,
    color: "bg-purple-500",
  },
];

export default function AnalyticsPreview() {
  return (
    <section className="bg-slate-100 py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Analytics
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Hospital Dashboard Overview
          </h2>

          <p className="mt-4 text-slate-500 max-w-3xl mx-auto">
            Real-time analytics help hospital administrators monitor
            patients, appointments, revenue and operational efficiency.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {cards.map((card, index) => {

            const Icon = card.icon;

            return (

              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="rounded-3xl bg-white p-6 shadow-lg"
              >

                <div
                  className={`inline-flex rounded-2xl p-4 text-white ${card.color}`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-4xl font-bold">
                  {card.value}
                </h3>

                <p className="mt-2 text-slate-500">
                  {card.title}
                </p>

              </motion.div>

            );

          })}

        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl bg-white p-10 shadow-xl"
        >

          <div className="flex items-center justify-between">

            <h3 className="text-2xl font-bold">
              Monthly Performance
            </h3>

            <Activity className="text-blue-600" />
          </div>

          <div className="mt-10 flex items-end justify-between h-72">

            {[45,70,60,90,55,80,100].map((height,index)=>(
              <div
                key={index}
                className="w-12 rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400 transition hover:scale-105"
                style={{height:`${height}%`}}
              />
            ))}

          </div>

        </motion.div>

      </div>
    </section>
  );
}