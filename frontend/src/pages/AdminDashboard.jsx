import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import { ShieldCheck, BarChart3, LineChart, PlusCircle, Sparkles, AlertCircle, ShoppingBag, FolderOpen, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const { formatPrice } = useLanguageCurrency();

  const [analytics, setAnalytics] = useState(null);
  const [forecast, setForecast] = useState(0);
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Create Product states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    discountPercentage: '0',
    categoryId: '',
    tags: '',
  });

  // 2. Create Category states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const anaRes = await API.get('/admin/analytics');
        setAnalytics(anaRes.data);

        const foreRes = await API.get('/admin/forecast/next-month');
        setForecast(foreRes.data);

        const catRes = await API.get('/categories');
        setCategories(catRes.data);
        if (catRes.data.length > 0) {
          setProductForm((prev) => ({ ...prev, categoryId: catRes.data[0].id.toString() }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        stockQuantity: parseInt(productForm.stockQuantity),
        discountPercentage: parseFloat(productForm.discountPercentage),
        categoryId: parseInt(productForm.categoryId),
      };
      await API.post('/products', payload);
      setMsg('Product catalog item created successfully.');
      setProductForm({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        imageUrl: '',
        discountPercentage: '0',
        categoryId: categories[0]?.id.toString() || '',
        tags: '',
      });
      // Refresh analytics
      const anaRes = await API.get('/admin/analytics');
      setAnalytics(anaRes.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create product.');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');
    try {
      const res = await API.post('/categories', categoryForm);
      setMsg('Category created successfully.');
      setCategories((prev) => [...prev, res.data]);
      setCategoryForm({ name: '', description: '', imageUrl: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create category.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-aura-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-aura-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-[80vh]">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-6">
        <div className="rounded bg-aura-secondary/15 p-2 text-aura-secondary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white font-sans">AURA CONTROL ROOM</h1>
          <p className="text-xs text-gray-500 mt-1">Manage catalog definitions and review AI linear regression predictions.</p>
        </div>
      </div>

      {msg && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-400">
          {msg}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs font-semibold text-red-400">
          {errorMsg}
        </div>
      )}

      {/* 1. SALES ANALYTICS GRID */}
      {analytics && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Revenue */}
          <div className="rounded-2xl border border-white/5 bg-aura-card/25 p-5 shadow-glass space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Total Revenue</span>
            </span>
            <span className="text-2xl font-black text-white block">{formatPrice(analytics.totalRevenue)}</span>
            <span className="text-[10px] text-gray-500">Gross billing sales from all checkouts.</span>
          </div>

          {/* Orders */}
          <div className="rounded-2xl border border-white/5 bg-aura-card/25 p-5 shadow-glass space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <ShoppingBag className="h-4 w-4" />
              <span>Total Transactions</span>
            </span>
            <span className="text-2xl font-black text-white block">{analytics.totalOrders} orders</span>
            <span className="text-[10px] text-gray-500">Completed checkouts logs.</span>
          </div>

          {/* Average Spent */}
          <div className="rounded-2xl border border-white/5 bg-aura-card/25 p-5 shadow-glass space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              <span>Average spent</span>
            </span>
            <span className="text-2xl font-black text-white block">{formatPrice(analytics.averageOrderValue)}</span>
            <span className="text-[10px] text-gray-500">Financial basket average value.</span>
          </div>

          {/* Coupon codes */}
          <div className="rounded-2xl border border-white/5 bg-aura-card/25 p-5 shadow-glass space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <Percent className="h-4 w-4" />
              <span>Active Coupons</span>
            </span>
            <span className="text-2xl font-black text-white block">{analytics.activeCoupons} codes</span>
            <span className="text-[10px] text-gray-500">Promotions currently in escrow.</span>
          </div>

        </div>
      )}

      {/* 2. AI REVENUE TREND TRENDS PREDICTION */}
      <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-6 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
            <Sparkles className="h-6 w-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 tracking-widest block">Aura Forecasting Core</span>
            <h3 className="text-sm font-bold text-white mt-1">AI Linear Regression Revenue Prediction</h3>
            <p className="text-xs text-gray-500 mt-1">Calculates trend slopes using past monthly order summaries.</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Next Month Estimate</span>
          <span className="text-2xl font-black text-amber-400 block">{formatPrice(forecast)}</span>
        </div>
      </div>

      {/* 3. CRUD CREATE FORMS */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        
        {/* Product CRUD */}
        <form onSubmit={handleProductSubmit} className="rounded-2xl border border-white/5 bg-aura-card/20 p-6 space-y-4 shadow-glass">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
            <PlusCircle className="h-4 w-4 text-aura-primary" />
            <span>Add New Catalog Product</span>
          </span>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Product Title</label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-2.5 px-3.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={productForm.stockQuantity}
                onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-2.5 px-3.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-2.5 px-3.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Discount %</label>
              <input
                type="number"
                value={productForm.discountPercentage}
                onChange={(e) => setProductForm({ ...productForm, discountPercentage: e.target.value })}
                className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-2.5 px-3.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Image URL Location</label>
            <input
              type="text"
              required
              placeholder="e.g. /images/products/speaker.jpg"
              value={productForm.imageUrl}
              onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
              className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-2.5 px-3.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Product Description</label>
            <textarea
              required
              rows={2}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-2.5 px-3.5 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Category Mapping</label>
              <select
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                className="w-full rounded-xl border border-white/5 bg-[#101017] py-2.5 px-3.5 text-xs text-gray-300 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id.toString()} className="bg-[#101017]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Context Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. charging, walnut, stone"
                value={productForm.tags}
                onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-2.5 px-3.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-3 text-xs font-bold text-black hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>CREATE PRODUCT CATALOG</span>
          </button>
        </form>

        {/* Category CRUD */}
        <form onSubmit={handleCategorySubmit} className="rounded-2xl border border-white/5 bg-aura-card/20 p-6 space-y-4 shadow-glass h-max">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
            <FolderOpen className="h-4 w-4 text-aura-secondary" />
            <span>Create New Collection Category</span>
          </span>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Category Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Spatial Acoustics"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-2.5 px-3.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Image URL Location</label>
            <input
              type="text"
              required
              placeholder="e.g. /images/categories/decor.jpg"
              value={categoryForm.imageUrl}
              onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
              className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-2.5 px-3.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Collection Summary Description</label>
            <textarea
              required
              rows={3}
              placeholder="Provide a comprehensive summary of this catalog segment"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-2.5 px-3.5 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-aura-primary to-aura-secondary py-3 text-xs font-bold text-white shadow-neon hover:opacity-90 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>CREATE COLLECTION CATEGORY</span>
          </button>
        </form>

      </div>

    </div>
  );
};
