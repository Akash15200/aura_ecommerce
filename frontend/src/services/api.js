// Mock API Service for Aura E-Commerce
import * as db from './mockData';
import * as shopify from './shopify';

// Initialize mock database
db.initDb();

const API_BASE_URL = 'http://localhost:8080/api';

// Delay helper to simulate network latency for realistic micro-animations
const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));

const getCurrentUserEmail = () => {
  const cachedUser = localStorage.getItem('user');
  if (cachedUser) {
    try {
      const parsed = JSON.parse(cachedUser);
      return parsed.email || 'user@aura.com';
    } catch (e) {
      return 'user@aura.com';
    }
  }
  return 'user@aura.com';
};

const handleGetRequest = async (url) => {
  const email = getCurrentUserEmail();
  const cleanUrl = url.replace(API_BASE_URL, '');
  
  const shopifyActive = shopify.isShopifyConfigured();
  if (shopifyActive) {
    console.log(`[Shopify Mode] GET request: ${cleanUrl}`);
  }

  // 1. Categories
  if (cleanUrl === '/categories') {
    return shopifyActive ? await shopify.getCategories() : db.getCategories();
  }
  
  // 2. Recommendations
  if (cleanUrl === '/ai/recommendations') {
    if (shopifyActive) {
      const res = await shopify.getProducts(0, 8);
      return res.content;
    }
    return db.getRecommendations();
  }
  
  // 3. Search
  if (cleanUrl.startsWith('/ai/search')) {
    const queryIndex = cleanUrl.indexOf('query=');
    const query = queryIndex !== -1 ? decodeURIComponent(cleanUrl.slice(queryIndex + 6).split('&')[0]) : '';
    return shopifyActive ? await shopify.aiSearch(query) : db.aiSearch(query);
  }
  
  // 4. Products Pagination and Filtering
  if (cleanUrl.startsWith('/products')) {
    // Check if it's details /products/:id
    const parts = cleanUrl.split('/');
    if (parts.length === 3 && parts[1] === 'products') {
      const id = parts[2].split('?')[0];
      return shopifyActive ? await shopify.getProductById(id) : db.getProductById(id);
    }
    
    // Parse query params
    const queryIndex = cleanUrl.indexOf('?');
    const params = {};
    if (queryIndex !== -1) {
      cleanUrl.slice(queryIndex + 1).split('&').forEach(p => {
        const [k, v] = p.split('=');
        if (k) params[k] = decodeURIComponent(v || '');
      });
    }
    
    const page = parseInt(params.page || 0);
    const size = parseInt(params.size || 6);
    const sortBy = params.sortBy || 'id';
    const sortDir = params.sortDir || 'asc';
    const categoryId = params.categoryId || '';
    const minPrice = parseFloat(params.minPrice || 0);
    const maxPrice = parseFloat(params.maxPrice || 5000);
    
    return shopifyActive 
      ? await shopify.getProducts(page, size, sortBy, sortDir, categoryId, minPrice, maxPrice)
      : db.getProducts(page, size, sortBy, sortDir, categoryId, minPrice, maxPrice);
  }
  
  // 5. Reviews for a product
  // GET /reviews/product/:id/sentiment
  if (cleanUrl.startsWith('/reviews/product/') && cleanUrl.endsWith('/sentiment')) {
    const id = cleanUrl.replace('/reviews/product/', '').replace('/sentiment', '');
    return db.getSentimentStats(id);
  }
  
  // GET /reviews/product/:id
  if (cleanUrl.startsWith('/reviews/product/')) {
    const id = cleanUrl.replace('/reviews/product/', '');
    return db.getReviews(id);
  }
  
  // 6. Similar products
  if (cleanUrl.startsWith('/ai/products/') && cleanUrl.endsWith('/similar')) {
    const id = cleanUrl.replace('/ai/products/', '').replace('/similar', '');
    if (shopifyActive) {
      const product = await shopify.getProductById(id);
      if (product) {
        const catId = product.categoryId;
        const res = await shopify.getProducts(0, 5, 'id', 'asc', catId);
        return res.content.filter(p => p.id !== id).slice(0, 4);
      }
      const res = await shopify.getProducts(0, 4);
      return res.content;
    }
    return db.getSimilarProducts(id);
  }
  
  // 7. Orders history
  if (cleanUrl === '/orders') {
    return db.getOrders(email);
  }
  
  // 8. Admin Analytics
  if (cleanUrl === '/admin/analytics') {
    return db.getAdminAnalytics();
  }
  if (cleanUrl === '/admin/forecast/next-month') {
    return db.getAdminForecast();
  }
  
  throw new Error(`Mock GET URL not found: ${cleanUrl}`);
};

const handlePostRequest = async (url, data) => {
  const email = getCurrentUserEmail();
  const cleanUrl = url.replace(API_BASE_URL, '');
  
  // 1. Auth Register
  if (cleanUrl === '/auth/register') {
    return db.registerUser(data);
  }
  
  // 2. Auth OTP Verification
  if (cleanUrl === '/auth/verify-otp') {
    return db.verifyUserOtp(data.email, data.otp);
  }
  
  // 3. Auth Login
  if (cleanUrl === '/auth/login') {
    return db.loginUser(data.email, data.password);
  }
  
  // 4. Forgot / Reset Password
  if (cleanUrl === '/auth/forgot-password') {
    return db.forgotUserPassword(data.email);
  }
  if (cleanUrl === '/auth/reset-password') {
    return db.resetUserPassword(data.token, data.newPassword);
  }
  
  // 5. Add product
  if (cleanUrl === '/products') {
    return db.createProduct(data);
  }
  
  // 6. Add category
  if (cleanUrl === '/categories') {
    return db.createCategory(data);
  }
  
  // 7. Create Review
  if (cleanUrl.startsWith('/reviews/product/')) {
    const id = cleanUrl.replace('/reviews/product/', '');
    return db.createReview(id, data, email);
  }
  
  // 8. Create Order
  if (cleanUrl === '/orders') {
    return db.createOrder(data, email);
  }
  
  // 9. AI Chatbot
  if (cleanUrl === '/ai/chat') {
    return db.aiChat(data.message, email);
  }
  
  // 10. Refresh token
  if (cleanUrl.startsWith('/auth/refresh')) {
    return { accessToken: `mock-refreshed-token-${Date.now()}` };
  }
  
  throw new Error(`Mock POST URL not found: ${cleanUrl}`);
};

// Mock Axios API implementation
const API = {
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  },
  
  get: async (url, config) => {
    await delay();
    try {
      const responseData = await handleGetRequest(url);
      return { data: responseData };
    } catch (error) {
      console.error("Mock GET Error:", error);
      throw error;
    }
  },
  
  post: async (url, data, config) => {
    await delay();
    try {
      const responseData = await handlePostRequest(url, data);
      return { data: responseData };
    } catch (error) {
      console.error("Mock POST Error:", error);
      throw error;
    }
  },
  
  put: async (url, data, config) => {
    await delay();
    return { data: {} };
  },
  
  delete: async (url, config) => {
    await delay();
    return { data: {} };
  }
};

// Mock update points method in AuthContext
export const mockUpdateLoyaltyPoints = (email, points) => {
  db.updateUserLoyaltyPoints(email, points);
};

export default API;
