import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import { ProductCard } from '../components/ProductCard';
import { Star, ShoppingCart, Heart, Sparkles, Send, ArrowLeft, Plus, Minus, MessageSquare, ShieldAlert, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useLanguageCurrency();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [similar, setSimilar] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  // Image Magnifier coordinates
  const [magnifierStyle, setMagnifierStyle] = useState({ display: 'none', top: 0, left: 0 });
  const [bgPos, setBgPos] = useState('0% 0%');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const prodRes = await API.get(`/products/${id}`);
        setProduct(prodRes.data);

        const revRes = await API.get(`/reviews/product/${id}`);
        setReviews(revRes.data);

        const sentRes = await API.get(`/reviews/product/${id}/sentiment`);
        setSentiment(sentRes.data);

        const simRes = await API.get(`/ai/products/${id}/similar`);
        setSimilar(simRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setQuantity(1);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingReview(true);
    setReviewMsg('');

    try {
      const res = await API.post(`/reviews/product/${id}`, {
        rating,
        comment,
        imageUrl: '',
      });

      setReviews((prev) => [res.data, ...prev]);
      setComment('');
      setReviewMsg('Thank you! Review registered and sentiment analyzed successfully.');
      
      // Refresh sentiment card
      const sentRes = await API.get(`/reviews/product/${id}/sentiment`);
      setSentiment(sentRes.data);
    } catch (err) {
      setReviewMsg('Please sign in to submit a product review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Image Zoom Magnifier logic
  const handleMouseMove = (e) => {
    const { top, left, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Mouse relative positions
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;

    // Magnifier container sizing (lens size is 120px)
    const lensSize = 120;
    setMagnifierStyle({
      display: 'block',
      top: `${y - lensSize / 2}px`,
      left: `${x - lensSize / 2}px`,
    });

    // Background zoom adjustments
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;
    setBgPos(`${xPercent}% ${yPercent}%`);
  };

  const handleMouseLeave = () => {
    setMagnifierStyle({ display: 'none', top: 0, left: 0 });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-aura-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-aura-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center text-gray-400">
        <ShieldAlert className="h-10 w-10 text-gray-600 mb-2" />
        <p>Requested luxury product is unavailable.</p>
        <Link to="/shop" className="text-xs font-bold text-aura-primary hover:underline mt-2">Back to Catalog</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountPrice = product.price * (1 - (product.discountPercentage / 100));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Back Button */}
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>BACK TO CATALOG</span>
      </Link>

      {/* Grid: Magnifier Image + Buy Box Details */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        
        {/* Left Column: Glass Image Zoom Magnifier */}
        <div className="flex flex-col gap-4">
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-zoom-in overflow-hidden rounded-2xl border border-white/5 bg-[#09090f] aspect-square shadow-glass flex items-center justify-center"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover opacity-90"
            />

            {/* Magnifier glass lens */}
            <div
              style={{
                display: magnifierStyle.display,
                position: 'absolute',
                top: magnifierStyle.top,
                left: magnifierStyle.left,
                pointerEvents: 'none',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                backgroundImage: `url(${product.imageUrl})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '350% 350%',
                backgroundPosition: bgPos,
              }}
            />
          </div>
        </div>

        {/* Right Column: Buy Box Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category */}
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{product.category?.name}</span>
            
            {/* Name */}
            <h1 className="text-3xl font-extrabold tracking-wide text-white sm:text-4xl font-sans">{product.name}</h1>
            
            {/* Rating Stars summary */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
              </div>
              <span className="text-sm font-bold text-gray-300">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-bold text-white">{formatPrice(discountPrice)}</span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                  <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-400">
                    -{product.discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400 font-medium pt-2">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.split(',').map((tag, idx) => (
                <span key={idx} className="rounded-lg bg-white/5 border border-white/5 px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Action Box */}
          <div className="border-t border-white/5 pt-6 space-y-4">
            
            {product.stockQuantity > 0 ? (
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity Block */}
                <div className="flex items-center rounded-xl bg-[#14141f] border border-white/5 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-bold text-white min-w-[30px] text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-xs font-bold text-black hover:bg-gray-200 transition-colors shadow-lg active:scale-98"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>ADD TO CART</span>
                </button>

                {/* Favorite */}
                <button
                  onClick={() => addToWishlist(product)}
                  className={`rounded-xl border border-white/10 p-3.5 hover:bg-white/5 transition-colors ${
                    inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500' : ''}`} />
                </button>
              </div>
            ) : (
              <button disabled className="w-full rounded-xl bg-gray-600/20 border border-white/5 py-4 text-xs font-bold text-gray-600">
                OUT OF STOCK
              </button>
            )}

            <span className="block text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
              Accumulate {Math.round(discountPrice * quantity * 0.5)} gold loyalty rewards points on this order.
            </span>
          </div>

        </div>
      </div>

      {/* Grid: Review Sentiments Analytics + Submissions */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 pt-6 border-t border-white/5">
        
        {/* Sentiment Analysis stats Card (Lucide bar styles) */}
        <div className="md:col-span-1 rounded-2xl border border-white/5 bg-aura-card/25 p-5 space-y-4 shadow-glass h-max">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>AI Review Sentiment</span>
          </span>

          {sentiment ? (
            <div className="space-y-4 text-xs font-bold">
              {/* Compute percentages from counts */}
              {(() => {
                const total = sentiment.totalReviewsCount || 1;
                const posPct = ((sentiment.positiveCount || 0) / total) * 100;
                const negPct = ((sentiment.negativeCount || 0) / total) * 100;
                const neuPct = ((sentiment.neutralCount || 0) / total) * 100;
                const avgScore = sentiment.averageSentimentPercentage ?? 50;
                return (
                  <>
                    {/* Positive */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-emerald-400">POSITIVE</span>
                        <span>{posPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full rounded bg-white/5 overflow-hidden">
                        <div className="h-full bg-aura-accent rounded" style={{ width: `${posPct}%` }} />
                      </div>
                    </div>

                    {/* Neutral */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-blue-400">NEUTRAL</span>
                        <span>{neuPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full rounded bg-white/5 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded" style={{ width: `${neuPct}%` }} />
                      </div>
                    </div>

                    {/* Negative */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-red-400">NEGATIVE</span>
                        <span>{negPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full rounded bg-white/5 overflow-hidden">
                        <div className="h-full bg-red-500 rounded" style={{ width: `${negPct}%` }} />
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/3 border border-white/5 p-3 text-[10px] text-gray-500 leading-relaxed font-semibold">
                      Analyzed over {sentiment.totalReviewsCount || 0} reviews. Sentiment score: {avgScore.toFixed(1)}%.
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-600 text-xs">
              Waiting for sentiment logs...
            </div>
          )}
        </div>

        {/* Customer reviews listing & submission form */}
        <div className="md:col-span-2 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <span>Customer Opinions ({reviews.length})</span>
          </span>

          {/* Submission Form */}
          <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-white/5 bg-[#0e0e15]/40 p-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Leave an honest review</h4>
            
            {reviewMsg && (
              <div className="rounded-xl border border-white/5 bg-white/3 p-3 text-[10px] font-semibold text-gray-300">
                {reviewMsg}
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Rating Star:</span>
              <div className="flex gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 hover:scale-110 transition-transform"
                  >
                    <Star className={`h-4.5 w-4.5 ${rating >= star ? 'fill-amber-500' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 p-1 bg-white/5 border border-white/5 rounded-xl">
              <input
                type="text"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience (AI sentiment tags dynamically)..."
                className="w-full bg-transparent px-3 py-2 text-xs text-white focus:outline-none placeholder-gray-600"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="rounded-lg bg-white p-2 text-black hover:bg-gray-200"
              >
                {submittingReview ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </form>

          {/* Reviews logs list */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500">Be the first to review this curated item!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="rounded-xl border border-white/5 bg-white/2 p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-gray-200 block">{rev.userName || "Alex Rivers"}</span>
                      <div className="flex text-amber-500 mt-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>

                    {/* AI Sentiment badge — backend field is sentimentLabel */}
                    {rev.sentimentLabel && (
                      <span className={`rounded px-2 py-0.5 text-[8px] font-extrabold tracking-wider uppercase border ${
                        rev.sentimentLabel === 'POSITIVE'
                          ? 'bg-aura-accent/10 border-aura-accent/35 text-aura-accent'
                          : rev.sentimentLabel === 'NEGATIVE'
                          ? 'bg-red-500/10 border-red-500/35 text-red-400'
                          : 'bg-blue-500/10 border-blue-500/35 text-blue-400'
                      }`}>
                        AI: {rev.sentimentLabel} ({(rev.sentimentScore ?? 0).toFixed(2)})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Similar products carousel section */}
      {similar.length > 0 && (
        <section className="space-y-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="rounded bg-aura-primary/10 p-1.5 text-aura-primary">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wider font-sans">Similar Products</h2>
              <p className="text-xs text-gray-500 mt-1">Products commonly matching this item's context tags.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
