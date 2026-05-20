import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-aura-accent" />,
    error: <AlertTriangle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-aura-primary" />,
  };

  const borders = {
    success: 'border-aura-accent/30',
    error: 'border-red-500/30',
    info: 'border-aura-primary/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border ${borders[type]} bg-aura-card/90 p-4 shadow-glass backdrop-blur-lg min-w-[300px]`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-grow text-sm font-medium text-gray-200">{message}</p>
      <button 
        onClick={onClose} 
        className="flex-shrink-0 rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};
