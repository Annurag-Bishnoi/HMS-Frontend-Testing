import {
  HeartPulse,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from "lucide-react";

import{
    FaFacebookF,
    FaLinkedinIn,
    FaGithub,
}from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}

          <div>

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-600 p-3">

                <HeartPulse className="text-white" />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Mediora HMS
                </h2>

                <p className="text-sm text-slate-400">
                  Smart Hospital Platform
                </p>

              </div>

            </div>

            <p className="mt-6 leading-7">
              A modern Hospital Management System designed to simplify
              patient care, appointments, billing, prescriptions and
              hospital administration through one intelligent platform.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="mb-6 text-xl font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">

              <li><a href="#">Home</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Doctors</a></li>
              <li><a href="#">Departments</a></li>
              <li><a href="#">Contact</a></li>

            </ul>

          </div>

          {/* Portals */}

          <div>

            <h3 className="mb-6 text-xl font-semibold text-white">
              Portals
            </h3>

            <ul className="space-y-3">

              <li><a href="#">Admin Portal</a></li>
              <li><a href="#">Doctor Portal</a></li>
              <li><a href="#">Reception Portal</a></li>
              <li><a href="#">Patient Portal</a></li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-6 text-xl font-semibold text-white">
              Contact
            </h3>

            <div className="space-y-5">

              <div className="flex items-center gap-3">

                <Phone className="text-blue-500" />

                <span>+91 7828723118</span>

              </div>

              <div className="flex items-center gap-3">

                <Mail className="text-blue-500" />

                <span>support@mediora.com</span>

              </div>

              <div className="flex items-center gap-3">

                <MapPin className="text-blue-500" />

                <span>Bengaluru, India</span>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-16 flex flex-col gap-6 border-t border-slate-800 pt-8 md:flex-row md:items-center md:justify-between">

          <p className="text-sm">
            © 2026 Mediora HMS. All Rights Reserved.
          </p>

         
         <div className="flex gap-4 text-xl">

         <FaFacebookF className="cursor-pointer hover:text-blue-500 transition" />
         <FaLinkedinIn className="cursor-pointer hover:text-blue-500 transition" />
         <FaGithub className="cursor-pointer hover:text-white transition" />
         </div>

        </div>

      </div>

      {/* Scroll Top */}

      <button
        className="fixed bottom-8 right-8 rounded-full bg-blue-600 p-4 text-white shadow-xl hover:scale-110 transition"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp />
      </button>

    </footer>
  );
}