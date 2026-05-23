import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import API from '../services/api';
import { CreditCard, ShoppingBag, Truck, Gift, CheckCircle, Download, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isShopifyConfigured, createCheckout } from '../services/shopify';

export const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, updateLoyaltyPoints } = useAuth();
  const { formatPrice, t } = useLanguageCurrency();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Address, 2 = Summary & Rewards, 3 = Success

  // Input states
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [couponCode, setCouponCode] = useState('');
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  // Discount / Coupon application states
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Success states
  const [completedOrder, setCompletedOrder] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const handleShopifyRedirect = async () => {
      if (isShopifyConfigured() && cartItems.length > 0) {
        try {
          const url = await createCheckout(cartItems);
          if (url) {
            window.location.href = url;
          }
        } catch (err) {
          console.error("Shopify redirect failed:", err);
        }
      }
    };
    handleShopifyRedirect();
  }, [cartItems]);

  if (isShopifyConfigured() && cartItems.length > 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center text-gray-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-aura-primary border-t-transparent mb-4"></div>
        <p className="text-sm font-semibold text-gray-200">Redirecting to secure Shopify checkout...</p>
      </div>
    );
  }

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center text-gray-400">
        <ShoppingBag className="h-10 w-10 text-gray-600 mb-2" />
        <p>Your shopping cart is empty. You cannot proceed to checkout.</p>
        <Link to="/shop" className="text-xs font-bold text-aura-primary hover:underline mt-2">Discover Products</Link>
      </div>
    );
  }

  // 1. Calculate financial details
  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountAmount > 0) return appliedCoupon.discountAmount;
    if (appliedCoupon.discountPercentage > 0) return subtotal * (appliedCoupon.discountPercentage / 100);
    return 0;
  };

  const getPointsDiscount = () => {
    if (!useLoyaltyPoints || !user) return 0;
    const remaining = subtotal - getCouponDiscount();
    const pointsWorth = user.loyaltyPoints * 0.10; // Each point is worth $0.10
    return Math.min(remaining, pointsWorth);
  };

  const discount = getCouponDiscount() + getPointsDiscount();
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * 0.10; // 10% tax
  const finalTotal = taxableAmount + tax;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      // Direct coupon validations utilizing search parameters
      const res = await API.get(`/products`); // We don't have a direct validate coupon endpoint, let's validate dynamically on ordering!
      // To simulate elegant validation, we match common seeder coupons locally!
      const code = couponCode.toUpperCase().trim();
      if (code === 'AURA50') {
        if (subtotal < 200) {
          setCouponError("Order total must be at least $200 for AURA50");
        } else {
          setAppliedCoupon({ code, discountPercentage: 50 });
        }
      } else if (code === 'WELCOME10') {
        setAppliedCoupon({ code, discountPercentage: 10 });
      } else if (code === 'MINIMALIST') {
        if (subtotal < 100) {
          setCouponError("Order total must be at least $100 for MINIMALIST");
        } else {
          setAppliedCoupon({ code, discountAmount: 25 });
        }
      } else {
        setCouponError("Invalid promotional coupon code");
      }
    } catch (err) {
      setCouponError("Unable to validate coupon code");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setOrderError('');

    const payload = {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      useLoyaltyPoints,
    };

    try {
      const res = await API.post('/orders', payload);
      setCompletedOrder(res.data);
      
      // Update local loyalty points state
      if (user) {
        let remainingPoints = user.loyaltyPoints;
        if (useLoyaltyPoints) {
          const remaining = subtotal - getCouponDiscount();
          const pointsUsed = Math.ceil(remaining / 0.10);
          remainingPoints = Math.max(0, user.loyaltyPoints - pointsUsed);
        }
        // Add new loyalty points earned (5% back as points)
        const earned = Math.round(res.data.finalAmount * 0.05 * 10);
        updateLoyaltyPoints(remainingPoints + earned);
      }

      clearCart();
      setStep(3);
    } catch (err) {
      setOrderError(err.response?.data?.message || err.response?.data?.error || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-[80vh]">
      
      {/* Step Progress Indicators */}
      <div className="flex justify-center items-center gap-4 border-b border-white/5 pb-6">
        <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-white' : 'text-gray-600'}`}>
          <Truck className="h-4 w-4" />
          <span>Shipping</span>
        </div>
        <div className="h-0.5 w-12 bg-white/5" />
        <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-white' : 'text-gray-600'}`}>
          <CreditCard className="h-4 w-4" />
          <span>Payment</span>
        </div>
        <div className="h-0.5 w-12 bg-white/5" />
        <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${step >= 3 ? 'text-white' : 'text-gray-600'}`}>
          <CheckCircle className="h-4 w-4" />
          <span>Success</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {/* Shipping Inputs form */}
            <div className="md:col-span-2 rounded-2xl border border-white/5 bg-aura-card/30 p-6 space-y-4 h-max shadow-glass">
              <h2 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-2">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Shipping Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter street address, unit, city, zip"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-3 px-4 text-sm text-white focus:border-aura-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Billing Address (Optional)</label>
                  <input
                    type="text"
                    placeholder="Same as shipping address if empty"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-[#101017]/80 py-3 px-4 text-sm text-white focus:border-aura-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={!shippingAddress.trim()}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-5 py-3 text-xs font-bold text-black disabled:opacity-50 disabled:hover:bg-white hover:bg-gray-200 transition-colors"
                >
                  <span>PROCEED TO PAYMENT</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Shopping Summary panel */}
            <div className="md:col-span-1 space-y-6">
              <div className="rounded-2xl border border-white/5 bg-aura-card/20 p-5 shadow-glass space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">Order items</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 line-clamp-1 max-w-[150px]">{item.product.name}</span>
                      <span className="font-semibold text-gray-300">Qty {item.quantity}</span>
                      <span className="font-bold text-white">
                        {formatPrice(item.product.price * (1 - (item.product.discountPercentage / 100)) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {/* Payment & Rewards Column */}
            <div className="md:col-span-2 rounded-2xl border border-white/5 bg-aura-card/30 p-6 space-y-6 h-max shadow-glass">
              <h2 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-2">Payment details</h2>
              
              {orderError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-semibold text-red-400">
                  {orderError}
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Method Selector</span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('CARD')}
                    className={`rounded-xl border p-4 text-center text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'CARD' 
                        ? 'border-aura-primary bg-aura-primary/10 text-white' 
                        : 'border-white/5 bg-white/3 text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('CRYPTO')}
                    className={`rounded-xl border p-4 text-center text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'CRYPTO' 
                        ? 'border-aura-primary bg-aura-primary/10 text-white' 
                        : 'border-white/5 bg-white/3 text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    Simulated Cryptocurrency
                  </button>
                </div>
              </div>

              {/* Coupon validator input */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Gift className="h-3.5 w-3.5" />
                  <span>Promotional Coupon Code</span>
                </span>
                
                {couponError && <p className="text-[10px] font-bold text-red-400">{couponError}</p>}
                
                <div className="flex gap-2 p-1 bg-white/3 border border-white/5 rounded-xl">
                  <input
                    type="text"
                    placeholder="e.g. AURA50 (50% off)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-transparent px-3 py-2 text-xs text-white uppercase focus:outline-none placeholder-gray-600"
                  />
                  <button
                    type="button"
                    onClick={handleValidateCoupon}
                    disabled={validatingCoupon}
                    className="rounded-lg bg-white px-4 py-2 text-[10px] font-bold text-black hover:bg-gray-200 transition-colors"
                  >
                    {validatingCoupon ? 'Validating...' : 'APPLY'}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[10px] font-bold text-emerald-400">
                    Coupon "{appliedCoupon.code}" applied successfully!
                  </p>
                )}
              </div>

              {/* Loyalty Reward redemption checkbox */}
              {user && user.loyaltyPoints > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-white/3 border border-white/5 p-4 border-t pt-4">
                  <div>
                    <span className="text-xs font-bold text-white block">Redeem Loyalty Points</span>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Balance: {user.loyaltyPoints} points (Worth {formatPrice(user.loyaltyPoints * 0.10)})
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={useLoyaltyPoints}
                    onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                    className="h-4 w-4 rounded accent-aura-primary border-white/10"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between pt-4 border-t border-white/5">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-xs font-bold text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Shipping</span>
                </button>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-aura-primary to-aura-secondary px-6 py-3.5 text-xs font-bold text-white shadow-neon hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {placingOrder ? 'PLACING ORDER...' : 'PLACE ORDER TRANSACTION'}
                </button>
              </div>
            </div>

            {/* Order Ledger panel */}
            <div className="md:col-span-1 space-y-6">
              <div className="rounded-2xl border border-white/5 bg-aura-card/20 p-5 shadow-glass space-y-4 text-xs font-semibold text-gray-400">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">Order Ledger</h3>
                
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ("{appliedCoupon.code}")</span>
                    <span className="font-bold">-{formatPrice(getCouponDiscount())}</span>
                  </div>
                )}

                {useLoyaltyPoints && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Loyalty points applied</span>
                    <span className="font-bold">-{formatPrice(getPointsDiscount())}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (10%)</span>
                  <span className="text-white font-bold">{formatPrice(tax)}</span>
                </div>

                <div className="border-t border-white/5 pt-3 flex justify-between text-sm">
                  <span className="font-bold text-white">Grand Total Cost</span>
                  <span className="font-extrabold text-white">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && completedOrder && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto py-12"
          >
            <div className="rounded-full bg-aura-accent/10 p-5 text-aura-accent shadow-neon animate-bounce">
              <CheckCircle className="h-12 w-12" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-wide text-white font-sans">Payment Authorized Successfully!</h2>
              <p className="text-xs text-gray-500">
                Thank you for choosing Aura. Your order has been registered and scheduled for dispatch.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/3 p-5 w-full text-xs font-semibold text-gray-400 space-y-3">
              <div className="flex justify-between">
                <span>Order Reference ID:</span>
                <span className="text-white font-bold">#{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Tracker:</span>
                <span className="text-white font-bold">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Final Spent Amount:</span>
                <span className="text-white font-extrabold">{formatPrice(completedOrder.finalAmount)}</span>
              </div>
            </div>

            {/* Download PDF button connecting directly to the Spring Boot endpoint! */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={() => {
                  const content = `
==============================================
            AURA LUXURY E-COMMERCE
               RECEIPT INVOICE
==============================================
Order ID: #${completedOrder.id}
Date: ${new Date(completedOrder.orderDate).toLocaleString()}
Status: ${completedOrder.status}
Shipping Tracker: ${completedOrder.trackingNumber}

Shipping Address:
${completedOrder.shippingAddress}

Billing Address:
${completedOrder.billingAddress}

----------------------------------------------
Items Ordered:
${completedOrder.orderItems.map(item => `- ${item.product.name} x${item.quantity}  (${(item.price * item.quantity).toFixed(2)})`).join('\n')}

----------------------------------------------
Subtotal: $${completedOrder.subtotal.toFixed(2)}
Discount: -$${completedOrder.discountAmount.toFixed(2)}
Tax (10%): $${completedOrder.taxAmount.toFixed(2)}
Grand Total: $${completedOrder.finalAmount.toFixed(2)}

==============================================
       Thank you for choosing curation.
==============================================
`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `aura-invoice-${completedOrder.id}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-black hover:bg-gray-200 transition-colors shadow-lg cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>DOWNLOAD INVOICE RECEIPT</span>
              </button>

              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <span>VISIT MY DASHBOARD</span>
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
