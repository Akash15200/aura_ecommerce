import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import API from '../services/api';
import { Star, ShoppingBag, Download, HelpCircle, Truck, ClipboardList, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { user } = useAuth();
  const { formatPrice, t } = useLanguageCurrency();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-[75vh]">
      
      {/* Header greetings */}
      {user && (
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-white font-sans">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-xs text-gray-500 mt-1">Review past transactions and loyalty point accumulation ledger.</p>
          </div>

          {/* Gold Star loyalty points wallet card */}
          <div className="flex items-center gap-3 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 shadow-glass w-max">
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400">
              <Star className="h-6 w-6 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Loyalty Rewards</span>
              <span className="text-lg font-black text-amber-400 block">{user.loyaltyPoints} points</span>
              <span className="text-[10px] text-gray-400 font-semibold">Value: {formatPrice(user.loyaltyPoints * 0.10)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Orders List + Points Log */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        
        {/* past orders List */}
        <div className="md:col-span-2 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
            <ClipboardList className="h-4 w-4 text-gray-400" />
            <span>Past Orders ({orders.length})</span>
          </span>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-32 animate-pulse rounded-2xl bg-white/5 border border-white/5" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center text-center rounded-2xl border border-white/5 bg-aura-card/10">
              <ShoppingBag className="h-10 w-10 text-gray-600 mb-2" />
              <p className="text-sm font-semibold text-gray-400">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="rounded-2xl border border-white/5 bg-aura-card/25 p-5 shadow-glass space-y-4 hover:border-white/10 transition-all"
                >
                  {/* Order header row */}
                  <div className="flex flex-wrap justify-between items-start gap-2 border-b border-white/5 pb-3">
                    <div>
                      <span className="text-xs font-bold text-white block">Order ID: #{order.id}</span>
                      <span className="text-[10px] text-gray-500 font-semibold">{new Date(order.orderDate).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Delivery Status pill */}
                      <span className={`rounded-lg px-2.5 py-1 text-[9px] font-extrabold tracking-wider uppercase border ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
                          : order.status === 'PROCESSING' || order.status === 'SHIPPED'
                          ? 'bg-blue-500/10 border-blue-500/35 text-blue-400'
                          : 'bg-amber-500/10 border-amber-500/35 text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order items detail */}
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs text-gray-400">
                        <span className="line-clamp-1 max-w-[200px]">{item.product.name}</span>
                        <span>x{item.quantity}</span>
                        <span className="font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order footer: PDF and tracking */}
                  <div className="flex flex-wrap justify-between items-center pt-3 border-t border-white/5 gap-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold">
                      <Truck className="h-3.5 w-3.5" />
                      <span>Shipment Tracker: </span>
                      <span className="text-gray-300 font-bold">{order.trackingNumber}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-white">{formatPrice(order.finalAmount)}</span>
                      
                      {/* PDF Invoice receipt download */}
                      <button
                        onClick={() => {
                          const content = `
==============================================
            AURA LUXURY E-COMMERCE
               RECEIPT INVOICE
==============================================
Order ID: #${order.id}
Date: ${new Date(order.orderDate).toLocaleString()}
Status: ${order.status}
Shipping Tracker: ${order.trackingNumber}

Shipping Address:
${order.shippingAddress}

Billing Address:
${order.billingAddress}

----------------------------------------------
Items Ordered:
${order.orderItems.map(item => `- ${item.product.name} x${item.quantity}  (${(item.price * item.quantity).toFixed(2)})`).join('\n')}

----------------------------------------------
Subtotal: $${order.subtotal.toFixed(2)}
Discount: -$${order.discountAmount.toFixed(2)}
Tax (10%): $${order.taxAmount.toFixed(2)}
Grand Total: $${order.finalAmount.toFixed(2)}

==============================================
       Thank you for choosing curation.
==============================================
`;
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `aura-invoice-${order.id}.txt`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-bold text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
                      >
                        <Download className="h-3 w-3" />
                        <span>RECEIPT</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loyalty details & FAQ */}
        <div className="md:col-span-1 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
            <HelpCircle className="h-4 w-4 text-gray-400" />
            <span>Rewards Guide</span>
          </span>

          <div className="rounded-2xl border border-white/5 bg-aura-card/15 p-5 shadow-glass space-y-4 text-xs font-semibold leading-relaxed text-gray-500">
            <div className="space-y-1">
              <span className="text-white block font-bold">1. How do I earn loyalty points?</span>
              <p>You automatically earn 5% back of every spent checkouts value in gold points immediately upon successful payment!</p>
            </div>
            
            <div className="space-y-1 border-t border-white/5 pt-3">
              <span className="text-white block font-bold">2. How do I redeem points?</span>
              <p>During step 2 of checkout, check the "Redeem Loyalty Points" box. Each point is worth a flat $0.10 discount off your total subtotal!</p>
            </div>

            <div className="space-y-1 border-t border-white/5 pt-3">
              <span className="text-white block font-bold">3. Escrow returns policy</span>
              <p>If you cancel or return an order, used loyalty points will be refunded back to your balance wallet automatically.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
