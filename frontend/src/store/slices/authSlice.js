import { createSlice } from '@reduxjs/toolkit';

const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const initialToken = localStorage.getItem('accessToken') || null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    accessToken: initialToken,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!initialToken,
    requires2fa: false,
    email2fa: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.requires2fa = false;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    require2faSetup: (state, action) => {
      state.requires2fa = true;
      state.email2fa = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.requires2fa = false;
      
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
});

export const { loginSuccess, require2faSetup, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
