import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Menu,
  X,
  LogIn,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "Departments", href: "#departments" },
  { name: "Roles", href: "#roles" },
  { name: "Analytics", href: "#analytics" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

        {/* Logo */}
        <motion.a
          href="#home"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex cursor-pointer items-center gap-3"
        >
          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-3 shadow-lg">
            <HeartPulse className="text-white" size={26} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Mediora
            </h1>

            <p className="text-xs text-slate-500">
              Hospital Management
            </p>
          </div>
        </motion.a>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="font-medium text-slate-600 transition duration-300 hover:text-blue-600"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Desktop Login Button */}
        <div className="hidden lg:block">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-105"
          >
            <LogIn size={18} />
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-white lg:hidden"
          >
            <div className="flex flex-col px-6 py-5">

              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b py-3 font-medium text-slate-700 transition hover:text-blue-600"
                >
                  {item.name}
                </a>
              ))}

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white"
              >
                <LogIn size={18} />
                Login
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}