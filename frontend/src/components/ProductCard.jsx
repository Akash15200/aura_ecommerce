import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import { ShoppingCart, Heart, RefreshCw, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { formatPrice } = useLanguageCurrency();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const discountPrice = product.price * (1 - (product.discountPercentage / 100));

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col rounded-2xl border border-white/5 bg-aura-card/40 p-3 shadow-glass hover:bg-aura-card/65 transition-all glow-on-hover"
    >
      {/* Product Image Panel */}
      <Link to={`/products/${product.id}`} className="relative block overflow-hidden rounded-xl bg-[#09090f] aspect-square">
        <motion.img
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.4 }}
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
        />

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.discountPercentage > 0 && (
            <span className="rounded-lg bg-red-500/90 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white shadow-md uppercase">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.stockQuantity < 5 && product.stockQuantity > 0 && (
            <span className="rounded-lg bg-amber-500/90 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-black shadow-md uppercase">
              Low Stock ({product.stockQuantity})
            </span>
          )}
          {product.stockQuantity === 0 && (
            <span className="rounded-lg bg-gray-600/90 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white shadow-md uppercase">
              Out of Stock
            </span>
          )}
        </div>

        {/* Favorite & Compare Overlay (Quick Actions) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Wishlist */}
          <button
            onClick={handleWishlistClick}
            className={`rounded-xl p-2.5 shadow-md backdrop-blur-md transition-all ${
              inWishlist 
                ? 'bg-red-500 text-white border-red-400' 
                : 'bg-black/40 text-gray-300 border border-white/10 hover:bg-black/60 hover:text-white'
            }`}
          >
            <Heart className={`h-4.5 w-4.5 ${inWishlist ? 'fill-white' : ''}`} />
          </button>

          {/* Compare */}
          <button
            onClick={handleCompareClick}
            className={`rounded-xl p-2.5 shadow-md backdrop-blur-md transition-all ${
              inCompare 
                ? 'bg-aura-primary text-white border-aura-secondary' 
                : 'bg-black/40 text-gray-300 border border-white/10 hover:bg-black/60 hover:text-white'
            }`}
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Quick Add To Cart Overlay (Slide Up) */}
        {product.stockQuantity > 0 && (
          <div className="absolute inset-x-2 bottom-2 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-black shadow-lg hover:bg-gray-100 active:scale-98 transition-all"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>QUICK ADD TO CART</span>
            </button>
          </div>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="mt-4 flex flex-1 flex-col justify-between px-1">
        <div>
          {/* Category */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            {product.categoryName}
          </span>

          {/* Name */}
          <Link to={`/products/${product.id}`} className="mt-1 block text-sm font-semibold text-gray-200 hover:text-white transition-colors line-clamp-1">
            {product.name}
          </Link>

          {/* Review Stars */}
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            </div>
            <span className="text-xs font-semibold text-gray-400">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-gray-600">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price Tag */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-white">
            {formatPrice(discountPrice)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
