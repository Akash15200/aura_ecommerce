import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const Auth = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        const msg = await register(formData.name, formData.email, formData.password);
        setSuccessMsg(msg);
        
        // Dynamic wait and redirect to OTP screen!
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        }, 1500);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16 bg-aura-bg">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/5 bg-aura-card/30 p-8 shadow-glass backdrop-blur-md"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-2xl font-extrabold tracking-widest text-white">A U R A</span>
          <p className="mt-1 text-xs text-gray-500 font-medium">Curated Luxury Minimalist Lifestyle</p>
        </div>

        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {isLogin ? "Sign In to Aura" : "Create Private Account"}
        </h2>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-semibold text-red-400">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field (Sign Up Only) */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-600" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:border-aura-primary focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-600" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:border-aura-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-600" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-3 pl-11 pr-11 text-sm text-white placeholder-gray-600 focus:border-aura-primary focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-gray-600 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>

          {/* Forgot Password Link (Login Only) */}
          {isLogin && (
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-aura-secondary hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
          )}

          {/* Submit Button */}
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
                <span>{isLogin ? "AUTHENTICATE" : "REGISTER"}</span>
              </>
            )}
          </button>

        </form>

        {/* View toggles */}
        <div className="mt-6 text-center text-xs text-gray-500">
          {isLogin ? (
            <p>
              New to Aura?{" "}
              <button 
                onClick={() => setIsLogin(false)} 
                className="font-bold text-white hover:underline ml-1"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button 
                onClick={() => setIsLogin(true)} 
                className="font-bold text-white hover:underline ml-1"
              >
                Sign in instead
              </button>
            </p>
          )}
        </div>

      </motion.div>
    </div>
  );
};
