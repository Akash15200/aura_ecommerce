// TypeScript Shared Model Definitions for Aura Client SPA

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string;
  enabled: boolean;
  twoFactorEnabled: boolean;
  loyaltyPoints: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  imageUrl: string;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string;
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  subtotal: number;
  discount: double;
  tax: double;
  finalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  trackingNumber: string;
  couponCode?: string;
  orderItems: OrderItem[];
}

export interface Review {
  id?: string;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  sentimentScore?: number;
  sentimentLabel?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  spam?: boolean;
  timestamp?: string;
}

export interface DailySales {
  id: string; // YYYY-MM-DD
  revenue: number;
  ordersCount: number;
}

export interface ForecastPoint {
  date: string;
  predictedRevenue: number;
}
