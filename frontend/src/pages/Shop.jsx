import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import { Search, Sparkles, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Shop = () => {
  const { t, formatPrice } = useLanguageCurrency();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Filter state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search details
  const [searchQuery, setSearchQuery] = useState('');
  const [isSemantic, setIsSemantic] = useState(false); // AI Semantic Search Toggle!
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Sync categoryId from URL parameter
  useEffect(() => {
    const catId = searchParams.get('categoryId');
    if (catId !== null) {
      setSelectedCategory(catId);
    }
  }, [searchParams]);

  // Main catalog fetch effect
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (isSemantic && searchQuery.trim().length > 0) {
          // AI Semantic Vector Embeddings Catalog matching!
          const res = await API.get(`/ai/search?query=${encodeURIComponent(searchQuery)}`);
          setProducts(res.data);
          setTotalPages(1);
          setTotalElements(res.data.length);
        } else {
          // Standard paged JPA catalog filtering
          let url = `/products?page=${page}&size=6&sortBy=${sortBy}&sortDir=${sortDir}`;
          if (selectedCategory) url += `&categoryId=${selectedCategory}`;
          if (priceRange.min > 0) url += `&minPrice=${priceRange.min}`;
          if (priceRange.max < 2000) url += `&maxPrice=${priceRange.max}`;
          
          const res = await API.get(url);
          setProducts(res.data.content);
          setTotalPages(res.data.totalPages);
          setTotalElements(res.data.totalElements);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, priceRange, page, sortBy, sortDir, isSemantic]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(0);
    // Trigger compilation
    setIsSemantic(isSemantic); // Force refetch!
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setIsSemantic(false);
    setPriceRange({ min: 0, max: 2000 });
    setPage(0);
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Search Header panel */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white font-sans">Aura Collections</h1>
          <p className="text-xs text-gray-500 mt-1">Refine luxury goods using classic filtering or semantic vectors.</p>
        </div>

        {/* Dynamic Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl bg-white/5 p-1 border border-white/5 w-72">
            <Search className="h-4 w-4 text-gray-500 ml-3" />
            <input
              type="text"
              placeholder={isSemantic ? "Semantic query (e.g. 'walnut charging stand')" : t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-xs text-white focus:outline-none placeholder-gray-600"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => {
                  setSearchQuery('');
                  if (isSemantic) setIsSemantic(false);
                }} 
                className="text-[10px] text-gray-500 hover:text-white px-2 font-bold"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* AI Semantic Selector button */}
          <button
            type="button"
            onClick={() => {
              setIsSemantic(!isSemantic);
              setPage(0);
            }}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-3 text-xs font-bold transition-all shadow-md cursor-pointer ${
              isSemantic 
                ? 'bg-gradient-to-r from-aura-primary to-aura-secondary text-white shadow-neon' 
                : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI SEMANTIC</span>
          </button>
        </form>
      </div>

      {/* Main Grid: Sidebar + Products List */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <div className="flex flex-col gap-6 md:col-span-1 rounded-2xl border border-white/5 bg-aura-card/20 p-5 shadow-glass h-max">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              <span>Filters</span>
            </span>
            <button 
              onClick={clearFilters}
              className="text-[10px] font-bold text-aura-secondary hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* 1. Category selector */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Categories</span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchParams({});
                  setPage(0);
                }}
                className={`w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-white/5 text-white' 
                    : 'text-gray-400 hover:bg-white/3 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id.toString());
                    setSearchParams({ categoryId: cat.id.toString() });
                    setPage(0);
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                    selectedCategory === cat.id.toString() 
                      ? 'bg-white/5 text-white' 
                      : 'text-gray-400 hover:bg-white/3 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range Slider */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Max Price: {formatPrice(priceRange.max)}</span>
            <input
              type="range"
              min="0"
              max="2000"
              step="20"
              value={priceRange.max}
              onChange={(e) => {
                setPriceRange({ ...priceRange, max: parseFloat(e.target.value) });
                setPage(0);
              }}
              className="w-full accent-aura-primary cursor-pointer"
            />
          </div>

          {/* 3. Catalog Sorter dropdown */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Sort Catalog By</span>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [by, dir] = e.target.value.split('-');
                setSortBy(by);
                setSortDir(dir);
                setPage(0);
              }}
              className="w-full rounded-xl border border-white/5 bg-[#101017] px-3 py-2 text-xs font-semibold text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="id-asc" className="bg-[#101017]">Default Listing</option>
              <option value="price-asc" className="bg-[#101017]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#101017]">Price: High to Low</option>
              <option value="rating-desc" className="bg-[#101017]">Top Customer Rated</option>
            </select>
          </div>

        </div>

        {/* PRODUCTS GRID (Desktop) */}
        <div className="md:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center rounded-2xl border border-white/5 bg-aura-card/10">
              <Sparkles className="h-8 w-8 text-gray-600 mb-2 animate-pulse" />
              <p className="text-sm font-semibold text-gray-400">No premium products match active catalog filters.</p>
              <button onClick={clearFilters} className="mt-3 text-xs font-bold text-aura-primary hover:underline">
                Clear active filter query
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Classic JPA Pagination (Hidden on AI Vector search results since they are absolute score sorted lists) */}
              {!isSemantic && totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                  <span className="text-xs text-gray-500">
                    Showing products {page * 6 + 1} - {Math.min(totalElements, (page + 1) * 6)} of {totalElements}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="rounded-xl border border-white/5 bg-white/3 p-2 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-white/3 disabled:hover:text-gray-400 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <span className="text-xs font-bold text-gray-300">
                      Page {page + 1} of {totalPages}
                    </span>

                    <button
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      disabled={page === totalPages - 1}
                      className="rounded-xl border border-white/5 bg-white/3 p-2 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-white/3 disabled:hover:text-gray-400 transition-all cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>

    </div>
  );
};
