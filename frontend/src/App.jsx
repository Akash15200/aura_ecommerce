import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { LanguageCurrencyProvider } from './context/LanguageCurrencyContext';
import { ThemeProvider } from './context/ThemeContext';

// Core UI Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ChatbotPopup } from './components/ChatbotPopup';
import { Toast } from './components/Toast';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Auth } from './pages/Auth';
import { VerifyOtp } from './pages/VerifyOtp';
import { ForgotPassword } from './pages/ForgotPassword';
import { Compare } from './pages/Compare';
import { Checkout } from './pages/Checkout';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export const App = () => {
  const [toast, setToast] = useState(null);

  // Decoupled Global Toast event listener
  useEffect(() => {
    const handleShowToast = (e) => {
      setToast({
        message: e.detail.message,
        type: e.detail.type || 'info',
      });
    };
    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <LanguageCurrencyProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  
                  {/* Main Client Shell */}
                  <div className="flex min-h-screen flex-col bg-aura-bg text-gray-200 transition-colors duration-300">
                    <Navbar />
                  
                  {/* Floating slide drawers */}
                  <CartDrawer />
                  <WishlistDrawer />
                  
                  {/* AI Assistant panel */}
                  <ChatbotPopup />

                  {/* Toast Alerts */}
                  {toast && (
                    <Toast
                      message={toast.message}
                      type={toast.type}
                      onClose={() => setToast(null)}
                    />
                  )}

                  {/* Router gateways */}
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/verify-otp" element={<VerifyOtp />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/compare" element={<Compare />} />
                      
                      {/* Protected checkout pathways */}
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      
                      {/* User dashboard */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      
                      {/* Control Panel (Admin protected) */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute adminOnly={true}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>

                  <Footer />
                </div>

                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageCurrencyProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
