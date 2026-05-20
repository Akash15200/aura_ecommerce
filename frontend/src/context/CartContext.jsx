import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from cache on mount
  useEffect(() => {
    const cachedCart = localStorage.getItem('cart');
    if (cachedCart) {
      setCartItems(JSON.parse(cachedCart));
    }
  }, []);

  // Save to cache on updates
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      const updated = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: Math.min(product.stockQuantity, item.quantity + quantity) }
          : item
      );
      saveCart(updated);
    } else {
      saveCart([...cartItems, { product, quantity }]);
    }
    setIsCartOpen(true); // Automatically reveal drawer on addition!
  };

  const removeFromCart = (productId) => {
    const updated = cartItems.filter((item) => item.product.id !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cartItems.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const discountPrice = item.product.price * (1 - (item.product.discountPercentage / 100));
      return acc + discountPrice * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal: getSubtotal(),
        cartCount: getCartCount(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
