import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import { Globe, Shield, RefreshCw } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguageCurrency();

  return (
    <footer className="w-full border-t border-white/5 bg-[#030305] pt-16 pb-8 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <span className="text-xl font-extrabold tracking-widest text-white">A U R A</span>
            <p className="text-sm leading-relaxed text-gray-500">
              Crafting curate minimalist lifestyle items engineered with high-end premium aesthetics and local cognitive features.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white">Collections</span>
            <Link to="/shop" className="text-sm hover:text-white transition-colors">Tech & Audio</Link>
            <Link to="/shop" className="text-sm hover:text-white transition-colors">Minimalist Apparel</Link>
            <Link to="/shop" className="text-sm hover:text-white transition-colors">Home Living</Link>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white">Information</span>
            <Link to="/compare" className="text-sm hover:text-white transition-colors">Product Comparison</Link>
            <span className="text-sm cursor-pointer hover:text-white transition-colors">Shipping & Returns</span>
            <span className="text-sm cursor-pointer hover:text-white transition-colors">Terms of Service</span>
          </div>

          {/* Newsletters Signup */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-white">Newsletter</span>
            <p className="text-sm text-gray-500">Receive private discounts and early luxury catalog updates directly.</p>
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/5">
              <input 
                type="email" 
                placeholder="Enter private email" 
                className="w-full bg-transparent px-3 py-1.5 text-xs text-white focus:outline-none placeholder-gray-600"
              />
              <button className="rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Aura E-Commerce. All rights reserved. Locally Secured AI Platform.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> 256-bit SSL</span>
            <span className="flex items-center gap-1"><RefreshCw className="h-3.5 w-3.5" /> 30-Day Escrow</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
