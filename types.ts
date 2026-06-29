
import React from 'react';

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: 'SEO' | 'Domains' | 'Buying Guide' | 'Security';
  excerpt: string;
  image: string;
  author: string;
  date: string;
  content: string;
}

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface ContentLink {
  anchorText: string;
  landingPageUrl: string;
}

export interface ContentRequirements {
  topic?: string;
  category?: string;
  wordCount?: number;
  keywords?: string;
  links?: ContentLink[];
  existingPostUrl?: string;
  fileUrl?: string;
  htmlCode?: string;
  imagePath?: string;
  specialInstructions?: string;
  anchorText?: string;
  landingPageUrl?: string;
}

export interface CartItemConfiguration {
  niche: 'General' | 'CBD' | 'Casino';
  contentType: 'provide' | 'hire' | 'insertion';
  contentRequirements: ContentRequirements;
  discount?: number;
}

export interface Listing {
  id: string;
  domain: string;
  price: number;
  currency: string;
  category: string;
  da: number;
  dr: number;
  admin_discount?: number;
}

export interface OrderItem {
  id: string;
  domain: string;
  price: number;
  currency: string;
  configuration: CartItemConfiguration;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  status: string;
  delivery_status: string;
  tracking_id: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  bonus_balance?: number;
  wallet_balance?: number;
  wallet_status?: 'active' | 'frozen';
  role?: 'user' | 'admin' | 'superadmin';
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'topup' | 'withdrawal' | 'purchase' | 'refund';
  status: 'pending' | 'completed' | 'rejected' | 'frozen';
  metadata: any;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
  expires_at?: string;
  usage_limit?: number;
  times_used?: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  isAdmin: boolean;
  timestamp: Date;
  isOffer?: boolean;
  read_at?: Date | null;
}
