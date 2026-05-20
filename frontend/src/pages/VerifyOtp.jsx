import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export const VerifyOtp = () => {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const msg = await verifyOtp(email, otp);
      setSuccess(msg);
      setTimeout(() => {
        navigate('/auth');
      }, 1500);
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
          <h2 className="text-xl font-bold text-white">Email Verification</h2>
          <p className="mt-1.5 text-xs text-gray-500 max-w-[280px]">
            Please enter the 6-digit OTP code printed on your backend server logs (or logged console output).
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-3 px-4 text-sm text-white placeholder-gray-600 focus:border-aura-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Verification Code (OTP)</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. 123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-3 px-4 text-center tracking-[8px] text-lg font-bold text-white placeholder-gray-600 focus:border-aura-primary focus:outline-none"
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
              <span>VERIFY ACTIVATION CODE</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
