import React from 'react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import { X, ShoppingCart, Info, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { formatPrice, t } = useLanguageCurrency();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[75vh]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white font-sans">{t('compare')}</h1>
          <p className="text-xs text-gray-500 mt-1">Review side-by-side details of up to 3 premium luxury products.</p>
        </div>
        
        {compareItems.length > 0 && (
          <button
            onClick={clearCompare}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            Clear Comparison List
          </button>
        )}
      </div>

      {compareItems.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center text-center rounded-2xl border border-white/5 bg-aura-card/10">
          <Info className="h-10 w-10 text-gray-600 mb-3" />
          <h3 className="text-sm font-semibold text-gray-400">No items selected for comparison.</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            Visit the shop catalog and hover over items to add them to your comparison sheet!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-aura-card/15 shadow-glass">
          <table className="w-full border-collapse text-left text-sm text-gray-300">
            
            {/* Headers row */}
            <thead>
              <tr className="border-b border-white/5 bg-black/40">
                <th className="p-4 font-bold text-white w-48">Spec Details</th>
                {compareItems.map((item) => (
                  <th key={item.id} className="p-4 font-bold text-white w-72 relative">
                    <button
                      onClick={() => removeFromCompare(item.id)}
                      className="absolute top-4 right-4 rounded-lg bg-white/5 p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    
                    <div className="flex flex-col gap-3 mt-4 items-center text-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-28 w-28 object-cover rounded-xl bg-[#09090f] shadow-md"
                      />
                      <span className="text-xs font-bold leading-tight block">{item.name}</span>
                    </div>
                  </th>
                ))}
                
                {/* Pad columns if comparing less than 3 */}
                {compareItems.length < 3 && 
                  Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                    <th key={`pad-${i}`} className="p-4 text-gray-600 text-center text-xs font-medium w-72">
                      Empty Slot
                    </th>
                  ))
                }
              </tr>
            </thead>

            {/* Spec rows */}
            <tbody>
              {/* 1. Price */}
              <tr className="border-b border-white/5">
                <td className="p-4 font-bold text-gray-400 bg-black/10">Price</td>
                {compareItems.map((item) => {
                  const discountPrice = item.price * (1 - (item.discountPercentage / 100));
                  return (
                    <td key={item.id} className="p-4 font-bold text-white">
                      <span>{formatPrice(discountPrice)}</span>
                      {item.discountPercentage > 0 && (
                        <span className="text-[10px] text-gray-500 line-through block font-medium">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </td>
                  );
                })}
                {compareItems.length < 3 && Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={i} className="p-4" />)}
              </tr>

              {/* 2. Category */}
              <tr className="border-b border-white/5">
                <td className="p-4 font-bold text-gray-400 bg-black/10">Category</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 text-xs font-semibold text-gray-300">
                    {item.categoryName}
                  </td>
                ))}
                {compareItems.length < 3 && Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={i} className="p-4" />)}
              </tr>

              {/* 3. Star Ratings */}
              <tr className="border-b border-white/5">
                <td className="p-4 font-bold text-gray-400 bg-black/10">Rating</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-gray-200">{item.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-gray-500">({item.reviewCount} reviews)</span>
                    </div>
                  </td>
                ))}
                {compareItems.length < 3 && Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={i} className="p-4" />)}
              </tr>

              {/* 4. Inventory Stock */}
              <tr className="border-b border-white/5">
                <td className="p-4 font-bold text-gray-400 bg-black/10">Availability</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 text-xs">
                    {item.stockQuantity > 0 ? (
                      <span className="font-semibold text-emerald-400">In Stock ({item.stockQuantity})</span>
                    ) : (
                      <span className="font-semibold text-red-400">Sold Out</span>
                    )}
                  </td>
                ))}
                {compareItems.length < 3 && Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={i} className="p-4" />)}
              </tr>

              {/* 5. Description */}
              <tr className="border-b border-white/5">
                <td className="p-4 font-bold text-gray-400 bg-black/10">Product Details</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 text-xs text-gray-400 leading-relaxed min-w-[280px]">
                    {item.description}
                  </td>
                ))}
                {compareItems.length < 3 && Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={i} className="p-4" />)}
              </tr>

              {/* 6. Action Hooks */}
              <tr>
                <td className="p-4 bg-black/10" />
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4">
                    {item.stockQuantity > 0 ? (
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-black hover:bg-gray-200 active:scale-98 transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>ADD TO CART</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full rounded-xl bg-gray-600/20 border border-white/5 py-3 text-xs font-bold text-gray-600"
                      >
                        OUT OF STOCK
                      </button>
                    )}
                  </td>
                ))}
                {compareItems.length < 3 && Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={i} className="p-4" />)}
              </tr>

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
