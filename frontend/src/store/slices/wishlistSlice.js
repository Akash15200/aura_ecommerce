import { createSlice } from '@reduxjs/toolkit';

const initialItems = localStorage.getItem('wishlistItems') ? JSON.parse(localStorage.getItem('wishlistItems')) : [];

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: initialItems,
    isOpen: false,
  },
  reducers: {
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex(item => item.id === product.id);
      
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
    toggleWishlistDrawer: (state) => {
      state.isOpen = !state.isOpen;
    }
  }
});

export const { toggleWishlistItem, toggleWishlistDrawer } = wishlistSlice.actions;
export default wishlistSlice.reducer;
