import { useState } from "react";
import { Mail, AlertCircle, X, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactAdminModal({ isOpen, onClose }: ContactAdminModalProps) {
  const [issue, setIssue] = useState("");
  const [userType, setUserType] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!issue || !userType) {
      alert("Please fill in both the issue and your user type.");
      return;
    }

    setIsSending(true);
    // Simulate sending an email
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      
      // Auto close after showing success
      setTimeout(() => {
        setIsSent(false);
        setIssue("");
        setUserType("");
        onClose();
      }, 2500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {isSent ? (
            <div className="flex flex-col items-center justify-center p-10 text-center animate-fade-in">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle size={32} />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-800">Email Sent Successfully!</h3>
              <p className="text-slate-500">The administrator has been notified and will assist you shortly.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Mail size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Contact Admin</h2>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <AlertCircle size={20} className="mt-0.5 shrink-0 text-blue-500" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Administrator Contact</h4>
                    <p className="mt-1 text-sm text-blue-700">
                      Email: <span className="font-bold">anuragbishnoi.teach@gmail.com</span>
                    </p>
                    <p className="mt-1 text-sm text-blue-700">
                      Use the form below to send an automated request directly to the admin regarding login issues.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Your User Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="" disabled>Select user type...</option>
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="Laboratory">Laboratory Staff</option>
                      <option value="Billing">Billing / Accountant</option>
                      <option value="Patient">Patient</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      What is the issue? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      placeholder="E.g., I forgot my password, my account is locked, etc."
                      rows={4}
                      className="w-full resize-none rounded-xl border border-slate-200 p-3 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                <button
                  onClick={onClose}
                  disabled={isSending}
                  className="rounded-xl px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-70"
                >
                  {isSending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Mail
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
