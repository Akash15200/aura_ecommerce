import React, { createContext, useContext, useState } from 'react';

const LanguageCurrencyContext = createContext();

const translations = {
  EN: {
    home: "Home",
    shop: "Shop Catalog",
    cart: "Shopping Cart",
    wishlist: "My Wishlist",
    compare: "Product Compare",
    search: "Search Luxury Catalog...",
    add_to_cart: "Add To Cart",
    checkout: "Proceed to Checkout",
    loyalty_points: "Loyalty points balance",
    dashboard: "My Dashboard",
    admin_panel: "Admin Panel",
    subtotal: "Subtotal",
    tax: "Estimated Tax",
    discount: "Applied Discount",
    total: "Grand Total",
    coupon: "Coupon Code",
    loyalty_accrual: "Loyalty rewards accumulated",
    sign_in: "Sign In",
    sign_out: "Sign Out",
  },
  ES: {
    home: "Inicio",
    shop: "Catálogo",
    cart: "Carrito",
    wishlist: "Favoritos",
    compare: "Comparar Productos",
    search: "Buscar en catálogo...",
    add_to_cart: "Añadir al carrito",
    checkout: "Proceder al pago",
    loyalty_points: "Puntos de fidelidad",
    dashboard: "Mi Panel",
    admin_panel: "Administración",
    subtotal: "Subtotal",
    tax: "Impuesto estimado",
    discount: "Descuento aplicado",
    total: "Total general",
    coupon: "Código de cupón",
    loyalty_accrual: "Recompensas acumuladas",
    sign_in: "Iniciar sesión",
    sign_out: "Cerrar sesión",
  },
  FR: {
    home: "Accueil",
    shop: "Catalogue",
    cart: "Panier",
    wishlist: "Favoris",
    compare: "Comparer les produits",
    search: "Rechercher dans le catalogue...",
    add_to_cart: "Ajouter au panier",
    checkout: "Passer à la caisse",
    loyalty_points: "Points de fidélité",
    dashboard: "Mon Tableau de bord",
    admin_panel: "Administration",
    subtotal: "Sous-total",
    tax: "Taxe estimée",
    discount: "Remise appliquée",
    total: "Total général",
    coupon: "Code de coupon",
    loyalty_accrual: "Récompenses accumulées",
    sign_in: "Se connecter",
    sign_out: "Se déconnecter",
  }
};

const currencyRates = {
  USD: { rate: 1.0, symbol: "$" },
  EUR: { rate: 0.92, symbol: "€" },
  INR: { rate: 83.5, symbol: "₹" }
};

export const LanguageCurrencyProvider = ({ children }) => {
  const [language, setLanguage] = useState("EN");
  const [currency, setCurrency] = useState("USD");

  const t = (key) => {
    return translations[language][key] || key;
  };

  const formatPrice = (priceUSD) => {
    if (priceUSD === undefined || priceUSD === null) return "";
    const { rate, symbol } = currencyRates[currency];
    const converted = priceUSD * rate;
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <LanguageCurrencyContext.Provider value={{ language, setLanguage, currency, setCurrency, t, formatPrice }}>
      {children}
    </LanguageCurrencyContext.Provider>
  );
};

export const useLanguageCurrency = () => useContext(LanguageCurrencyContext);
