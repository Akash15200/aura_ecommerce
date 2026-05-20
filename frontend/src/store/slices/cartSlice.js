import { createSlice } from '@reduxjs/toolkit';

const initialItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => {
    const price = item.price * (1.0 - (item.discountPercentage / 100.0));
    return sum + (price * item.quantity);
  }, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: initialItems,
    isOpen: false,
    subtotal: calculateSubtotal(initialItems),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(item => item.id === product.id);
      
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      
      state.subtotal = calculateSubtotal(state.items);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      state.subtotal = calculateSubtotal(state.items);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      state.subtotal = calculateSubtotal(state.items);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      localStorage.removeItem('cartItems');
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;
