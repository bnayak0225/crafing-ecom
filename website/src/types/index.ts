export interface Template {
  id: string;
  title: string;
  category: string;
  tags: string[];
  width: number;
  height: number;
  thumbnail: string;
  premium: boolean;
  uses: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  templateCount: number;
}

export interface Project {
  id: string;
  title: string;
  templateId: string | null;
  thumbnail: string;
  width: number;
  height: number;
  updatedAt: string;
  createdAt: string;
}

export interface UserBilling {
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  planLabel?: string;
  company?: string;
  role?: string;
  phone?: string;
  memberSince?: string;
  createdAt: string;
  billing?: UserBilling;
}

export interface CartItem {
  id: string;
  userId: string;
  templateId: string | null;
  title: string;
  thumbnail: string;
  type: string;
  price: number;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  itemCount: number;
}

export interface CartResponse {
  data: CartItem[];
  summary: CartSummary;
}

export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'completed' | 'processing' | 'cancelled' | 'refunded';
  total: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export interface Format {
  id: string;
  name: string;
  width: number | null;
  height: number | null;
  icon: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  highlighted: boolean;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
