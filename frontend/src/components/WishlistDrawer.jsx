import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import { X, Trash2, ShoppingCart, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WishlistDrawer = () => {
  const { wishlistItems, isWishlistOpen, setIsWishlistOpen, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice, t } = useLanguageCurrency();

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-screen w-full max-w-md border-l border-white/5 bg-[#0a0a0f] shadow-glass"
          >
            <div className="flex h-full flex-col justify-between p-6">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-white">
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  <span className="text-lg font-bold tracking-wider font-sans">{t('wishlist')}</span>
                  <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-400">
                    {wishlistItems.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                {wishlistItems.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center text-center">
                    <Heart className="h-10 w-10 text-gray-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-400">Your wishlist is empty.</p>
                  </div>
                ) : (
                  wishlistItems.map((item) => {
                    const discountPrice = item.price * (1 - (item.discountPercentage / 100));
                    return (
                      <motion.div
                        layout
                        key={item.id}
                        className="flex gap-4 rounded-xl border border-white/5 bg-aura-card/30 p-3 hover:bg-aura-card/50 transition-colors"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#09090f]">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover opacity-90"
                          />
                        </div>

                        <div className="flex flex-grow flex-col justify-between">
                          <div className="flex justify-between gap-1">
                            <span className="text-xs font-bold text-gray-200 line-clamp-1">{item.name}</span>
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-bold text-white">{formatPrice(discountPrice)}</span>
                            
                            {item.stockQuantity > 0 ? (
                              <button
                                onClick={() => {
                                  addToCart(item, 1);
                                  removeFromWishlist(item.id);
                                }}
                                className="flex items-center gap-1 rounded bg-white px-3 py-1.5 text-[10px] font-bold text-black hover:bg-gray-100 transition-colors"
                              >
                                <ShoppingCart className="h-3 w-3" />
                                <span>Move to Cart</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold text-gray-600">SOLD OUT</span>
                            )}
                          </div>
                        </div>

                      </motion.div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-white/5 pt-4">
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  <span>Close Wishlist</span>
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
