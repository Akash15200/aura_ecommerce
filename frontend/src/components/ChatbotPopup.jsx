import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';
import API from '../services/api';
import { MessageSquare, X, Send, Sparkles, ShoppingCart, Info, Percent, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatbotPopup = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { formatPrice } = useLanguageCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am Aura's local Cognitive AI assistant. Ask me to search our catalog, suggest similar products, provide active discounts, or help with checkouts!",
      products: [],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const suggestionChips = [
    { text: "Suggest active coupons", icon: <Percent className="h-3 w-3 text-emerald-400" /> },
    { text: "Recommend premium audio items", icon: <Sparkles className="h-3 w-3 text-purple-400" /> },
    { text: "Explain loyalty points system", icon: <Info className="h-3 w-3 text-blue-400" /> },
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const txt = textToSend || message;
    if (!txt.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: txt }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await API.post('/ai/chat', {
        message: txt,
        userId: user ? user.email : 'guest',
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.data.reply,
          products: res.data.products || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I apologize, but I encountered a network connectivity error. Please make sure the local Aura Spring Boot service is actively running.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
            className="mb-4 w-96 rounded-2xl border border-white/10 bg-aura-card/95 shadow-glass backdrop-blur-lg flex flex-col overflow-hidden h-[500px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-aura-primary/25 to-aura-secondary/25 p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-aura-primary p-1.5 shadow-neon">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wider">AURA COGNITIVE AI</h3>
                  <span className="text-[10px] text-aura-accent font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-aura-accent animate-pulse"></span>
                    Online Local Model
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-aura-primary text-white rounded-tr-none'
                      : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.text}

                    {/* Chat products list cards */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {msg.products.map((p) => {
                          const discPrice = p.price * (1 - (p.discountPercentage / 100));
                          return (
                            <div 
                              key={p.id}
                              className="flex-shrink-0 w-36 rounded-xl border border-white/5 bg-black/40 p-2 text-[10px] space-y-1.5 hover:border-white/10 transition-all"
                            >
                              <img 
                                src={p.imageUrl} 
                                alt={p.name} 
                                className="h-16 w-full object-cover rounded-lg"
                              />
                              <p className="font-bold text-gray-300 truncate">{p.name}</p>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-white">{formatPrice(discPrice)}</span>
                                <button
                                  onClick={() => addToCart(p, 1)}
                                  className="rounded bg-white p-1 text-black hover:bg-gray-100"
                                >
                                  <ShoppingCart className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-none border border-white/5 bg-white/5 p-3.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-aura-primary animate-bounce"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-aura-primary animate-bounce delay-100"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-aura-primary animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions Chips & Input Form */}
            <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {suggestionChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.text)}
                      className="flex items-center gap-1 rounded-xl bg-white/5 px-2.5 py-1.5 text-[10px] font-bold text-gray-300 border border-white/5 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {chip.icon}
                      <span>{chip.text}</span>
                    </button>
                  ))}
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 rounded-xl bg-white/5 p-1 border border-white/5"
              >
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask Aura AI..."
                  className="w-full bg-transparent px-3 py-2 text-xs text-white focus:outline-none placeholder-gray-600"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-aura-primary p-2 text-white shadow-neon hover:opacity-90 active:scale-95 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-aura-primary to-aura-secondary text-white shadow-neon hover:opacity-95 transition-all cursor-pointer"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>

    </div>
  );
};
