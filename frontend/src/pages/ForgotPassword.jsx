import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, KeyRound, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPassword = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Trigger email, 2 = Set new password
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendToken = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const msg = await forgotPassword(email);
      setSuccess(msg);
      setTimeout(() => {
        setStep(2);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const msg = await resetPassword(token, newPassword);
      setSuccess(msg);
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16 bg-aura-bg">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/5 bg-aura-card/30 p-8 shadow-glass backdrop-blur-md"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="rounded-2xl bg-aura-primary/10 p-3 text-aura-primary mb-3">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {step === 1 ? "Reset Password" : "Establish New Password"}
          </h2>
          <p className="mt-1.5 text-xs text-gray-500 max-w-[280px]">
            {step === 1 
              ? "Request a secure password recovery token." 
              : "Enter the reset token printed on your backend server logs."}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-semibold text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400">
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendToken} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-600" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:border-aura-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aura-primary to-aura-secondary py-3.5 text-xs font-bold text-white shadow-neon hover:opacity-90 active:scale-98 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <span>DISPATCH RECOVERY TOKEN</span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Reset Token (UUID)</label>
              <input
                type="text"
                required
                placeholder="Paste reset token here"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-3 px-4 text-sm text-white placeholder-gray-600 focus:border-aura-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">New Password</label>
              <input
                type="password"
                required
                placeholder="Choose new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-3 px-4 text-sm text-white placeholder-gray-600 focus:border-aura-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aura-primary to-aura-secondary py-3.5 text-xs font-bold text-white shadow-neon hover:opacity-90 active:scale-98 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>RESET PASSWORD</span>
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
