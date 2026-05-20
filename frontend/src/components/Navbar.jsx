import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import { ShoppingCart, Heart, RefreshCw, User, LogOut, Shield, Menu, X, Star, Globe, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { setIsCartOpen, cartCount } = useCart();
  const { setIsWishlistOpen, wishlistItems } = useWishlist();
  const { compareItems } = useCompare();
  const { language, setLanguage, currency, setCurrency, t } = useLanguageCurrency();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-aura-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-widest text-white font-sans hover:opacity-85 transition-opacity">
              A U R A
            </span>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">{t('home')}</Link>
            <Link to="/shop" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">{t('shop')}</Link>
            
            {/* Compare Link */}
            <Link to="/compare" className="relative flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              <RefreshCw className="h-4 w-4" />
              <span>{t('compare')}</span>
              {compareItems.length > 0 && (
                <span className="absolute -top-2.5 -right-3 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-aura-primary px-1 text-[10px] font-bold text-white">
                  {compareItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* Right Action Icons (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Localization / Currency Selectors */}
            <div className="flex items-center gap-3 border-r border-white/10 pr-4">
              {/* Language */}
              <div className="flex items-center gap-1 text-gray-400">
                <Globe className="h-3.5 w-3.5" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value="EN" className="bg-[#0f0f19]">EN</option>
                  <option value="ES" className="bg-[#0f0f19]">ES</option>
                  <option value="FR" className="bg-[#0f0f19]">FR</option>
                </select>
              </div>

              {/* Currency */}
              <div className="flex items-center gap-0.5 text-gray-400">
                <DollarSign className="h-3.5 w-3.5" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value="USD" className="bg-[#0f0f19]">USD</option>
                  <option value="EUR" className="bg-[#0f0f19]">EUR</option>
                  <option value="INR" className="bg-[#0f0f19]">INR</option>
                </select>
              </div>
            </div>

            {/* Wishlist Toggle Button */}
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="relative rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart Toggle Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-aura-primary px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 rounded-xl bg-white/5 p-1.5 pr-3 text-sm font-semibold text-white hover:bg-white/10 transition-all border border-white/5"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-aura-primary text-xs font-bold uppercase text-white">
                      {user.name.charAt(0)}
                    </div>
                    <span className="max-w-[80px] truncate text-xs">{user.name.split(' ')[0]}</span>
                    
                    {/* Loyalty Star Badge */}
                    <div className="flex items-center gap-0.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{user.loyaltyPoints}</span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-aura-card p-2 shadow-glass backdrop-blur-md"
                      >
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                        >
                          <User className="h-4 w-4" />
                          <span>{t('dashboard')}</span>
                        </Link>
                        
                        {user.role === 'ROLE_ADMIN' && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-aura-secondary hover:bg-white/5 hover:text-white"
                          >
                            <Shield className="h-4 w-4" />
                            <span>{t('admin_panel')}</span>
                          </Link>
                        )}
                        
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                            navigate('/auth');
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t('sign_out')}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="rounded-xl bg-gradient-to-r from-aura-primary to-aura-secondary px-5 py-2 text-xs font-bold text-white shadow-neon hover:opacity-90 transition-all"
                >
                  {t('sign_in')}
                </Link>
              )}
            </div>

          </div>

          {/* Hamburger Mobile Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-lg p-2 text-gray-400"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-aura-primary px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Links */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#0a0a0f] px-4 py-4"
          >
            <div className="flex flex-col gap-3">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white">{t('home')}</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white">{t('shop')}</Link>
              <Link to="/compare" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white">{t('compare')} ({compareItems.length})</Link>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWishlistOpen(true);
                }} 
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white"
              >
                <Heart className="h-4 w-4 text-red-500" />
                <span>{t('wishlist')} ({wishlistItems.length})</span>
              </button>

              <div className="flex items-center gap-4 px-3 py-2 border-t border-white/5 mt-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value="EN" className="bg-[#0f0f19]">EN</option>
                  <option value="ES" className="bg-[#0f0f19]">ES</option>
                  <option value="FR" className="bg-[#0f0f19]">FR</option>
                </select>
                
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value="USD" className="bg-[#0f0f19]">USD</option>
                  <option value="EUR" className="bg-[#0f0f19]">EUR</option>
                  <option value="INR" className="bg-[#0f0f19]">INR</option>
                </select>
              </div>

              {user ? (
                <div className="border-t border-white/5 pt-3">
                  <div className="flex items-center gap-3 px-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aura-primary text-sm font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <div className="flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 w-max">
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        <span>{user.loyaltyPoints} points</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                    <User className="h-4 w-4" />
                    <span>{t('dashboard')}</span>
                  </Link>
                  {user.role === 'ROLE_ADMIN' && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-aura-secondary hover:bg-white/5 hover:text-white">
                      <Shield className="h-4 w-4" />
                      <span>{t('admin_panel')}</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/auth');
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('sign_out')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 block w-full rounded-xl bg-gradient-to-r from-aura-primary to-aura-secondary py-2.5 text-center text-sm font-bold text-white"
                >
                  {t('sign_in')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
