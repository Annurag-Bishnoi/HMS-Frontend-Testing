import { Key, X, Eye, EyeOff, RefreshCw, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { resetUserPassword } from "../../../api/adminService";

const genPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  return 'Lab@' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

interface ResetPasswordModalProps {
  user: any;
  onClose: () => void;
}

export default function ResetPasswordModal({ user, onClose }: ResetPasswordModalProps) {
  const [newPass, setNewPass] = useState(() => genPassword());
  const [showPass, setShowPass] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  const handleReset = async () => {
    setLoading(true);
    try {
      await resetUserPassword(user.userId, newPass);
      setDone(true);
    } catch (e) {
      console.error(e);
      alert("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Key size={18} className="text-gray-500" /> Reset Password
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500 mb-6">
            Resetting password for <span className="font-bold text-gray-800">{user.fullName}</span> (@{user.username}).
          </p>

          {done ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle size={20} /> Password reset successfully!
              </div>
              <div className="rounded-xl border bg-gray-50 p-4 font-mono">
                <p className="text-xs text-gray-500 mb-1">New Password</p>
                <p className="text-lg font-bold text-gray-900">{newPass}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => copy(newPass)}
                  className="flex-1 rounded-lg border py-2.5 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                >
                  <Copy size={16} /> Copy
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-bold hover:bg-blue-700 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      className="w-full rounded-lg border py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                    <button
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button
                    onClick={() => setNewPass(genPassword())}
                    className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition"
                    title="Generate new password"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  disabled={loading || !newPass.trim()}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading ? <RefreshCw size={16} className="animate-spin" /> : "Reset Password"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
