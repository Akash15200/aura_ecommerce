import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  const { t } = useLanguageCurrency();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await API.get('/categories');
        setCategories(catRes.data);

        // Fetch AI product feed
        const recRes = await API.get('/ai/recommendations');
        setRecommendations(recRes.data);
      } catch (err) {
        console.error("Failed to load catalog feeds: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. LUXURY HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Glow ambient background graphics */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-aura-primary/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 -z-10 h-80 w-80 rounded-full bg-aura-accent/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/3 px-3 py-1.5 text-[10px] font-bold tracking-widest text-aura-secondary uppercase"
          >
            <Sparkles className="h-3 w-3" />
            <span>Introducing The Spring/Summer Collection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl font-sans"
          >
            Curated Luxury. <br />
            <span className="text-gradient">Minimalist Lifestyle.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-xl text-xs sm:text-sm text-gray-500 leading-relaxed font-medium"
          >
            Aura reinvents everyday living. Experience handcrafted stone elements, spatial acoustics, and luxury cardholders matched perfectly via local AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-bold text-black hover:bg-gray-200 active:scale-98 transition-all"
            >
              <span>DISCOVER CATALOG</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <Link
              to="/compare"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <span>COMPARE ITEMS</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-white/5 pb-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wider font-sans">Shop By Category</h2>
            <p className="text-xs text-gray-500 mt-1">Explore our modular collection segments.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/shop?categoryId=${cat.id}`)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-[#09090f] aspect-[4/3] shadow-glass"
            >
              {/* Category BG Image */}
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="h-full w-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-300"
              />

              {/* Category Info Banner */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-lg font-bold text-white tracking-wide">{cat.name}</span>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed max-w-[240px]">
                  {cat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. PERSONALIZED AI RECOMMENDATIONS FEED */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-white/5 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="rounded bg-aura-primary/10 p-1.5 text-aura-primary">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wider font-sans">AI Recommendations</h2>
              <p className="text-xs text-gray-500 mt-1">Tailored catalog feeds compiled in real-time.</p>
            </div>
          </div>
          <Link to="/shop" className="text-xs font-bold text-aura-secondary hover:text-white transition-colors">
            View All Products
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. LUXURY ASSURANCES BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-white/5 bg-aura-card/25 p-8 md:grid-cols-3 text-center">
          
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-xl bg-white/5 p-3 text-white">
              <Compass className="h-6 w-6" />
            </div>
            <span className="text-sm font-bold text-white tracking-wide">Worldwide Express Shipping</span>
            <p className="text-xs text-gray-500 max-w-[200px]">Secure, tracked global courier service straight to your doorstep.</p>
          </div>

          <div className="flex flex-col items-center gap-2 border-y border-white/5 py-6 md:border-y-0 md:border-x md:py-0">
            <div className="rounded-xl bg-white/5 p-3 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-sm font-bold text-white tracking-wide">30-Day Escrow Quality Guarantee</span>
            <p className="text-xs text-gray-500 max-w-[200px]">Return items within 30 days if you aren't completely satisfied.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-xl bg-white/5 p-3 text-white">
              <Heart className="h-6 w-6 text-red-400" />
            </div>
            <span className="text-sm font-bold text-white tracking-wide">5% Loyalty Rewards Gainback</span>
            <p className="text-xs text-gray-500 max-w-[200px]">Accumulate gold loyalty points automatically on checkout.</p>
          </div>

        </div>
      </section>

    </div>
  );
};
