import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();
  const { formatPrice, t } = useLanguageCurrency();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          />

          {/* Sliding Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-screen w-full max-w-md border-l border-white/5 bg-[#0a0a0f] shadow-glass"
          >
            <div className="flex h-full flex-col justify-between p-6">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-white">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="text-lg font-bold tracking-wider font-sans">{t('cart')}</span>
                  <span className="rounded bg-aura-primary/20 px-2 py-0.5 text-xs font-bold text-aura-secondary">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body: Cart Items List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                {cartItems.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center text-center">
                    <ShoppingBag className="h-10 w-10 text-gray-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-400">Your luxury shopping cart is empty.</p>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const discountPrice = item.product.price * (1 - (item.product.discountPercentage / 100));
                    return (
                      <motion.div
                        layout
                        key={item.product.id}
                        className="flex gap-4 rounded-xl border border-white/5 bg-aura-card/30 p-3 hover:bg-aura-card/50 transition-colors"
                      >
                        {/* Item Image */}
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#09090f]">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-full w-full object-cover opacity-90"
                          />
                        </div>

                        {/* Item metadata details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-1">
                            <span className="text-xs font-bold text-gray-200 line-clamp-1">{item.product.name}</span>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Price details */}
                            <span className="text-xs font-bold text-white">{formatPrice(discountPrice)}</span>

                            {/* Quantity modifier controls */}
                            <div className="flex items-center rounded-lg bg-[#14141f] border border-white/5 p-0.5">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 text-gray-400 hover:text-white"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 text-gray-400 hover:text-white"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer: Subtotals & Checkout Hook */}
              {cartItems.length > 0 && (
                <div className="border-t border-white/5 pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{t('subtotal')}</span>
                    <span className="text-lg font-bold text-white">{formatPrice(subtotal)}</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aura-primary to-aura-secondary py-3.5 text-xs font-bold text-white shadow-neon hover:opacity-90 active:scale-98 transition-all"
                  >
                    <span>{t('checkout')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
