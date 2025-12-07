import { Timestamp } from 'firebase/firestore';

export type Role = 'admin' | 'manager' | 'sales';
export type StoreCode = 'DEL' | 'BLR';

export interface User {
  authUid: string;
  name: string;
  email: string;
  role: Role;
  storeId?: StoreCode;
}

export interface Brand {
  id?: string;
  name: string;
  phone: string;
  email: string;
  partnerType: 'exclusive' | 'non-exclusive';
  commissionPct: number;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface InventoryItem {
  id?: string;
  brandId: string;
  productId: string;
  brandName?: string; // Denormalized for UI
  productName?: string; // Denormalized for UI
  size: string;
  basePrice: number;
  qrToken: string;
  qrUrl: string;
  stockByStore: Record<string, number>;
  createdAt: Timestamp;
}

export interface Product {
  id?: string;
  brandId: string;
  name: string;
  description: string;
  category: string;
  gender: 'men' | 'women' | 'unisex';
  isActive: boolean;
  createdAt: Timestamp;
}

export interface Sale {
  id?: string;
  brandId: string;
  productId: string;
  inventoryItemId: string;
  storeId: StoreCode;
  salespersonUserId: string;
  
  // Snapshot
  brandName: string;
  productName: string;
  size: string;
  
  // Customer
  customerName: string;
  customerPhone: string;
  customerAddress?: string;

  // Pricing
  salePricePerUnit: number;
  quantity: number;
  totalAmount: number;
  commissionPct: number;
  commissionAmount: number;
  payoutAmount: number;

  // Meta
  qrToken: string;
  saleEmailSentToBrand: boolean;
  saleDate: Timestamp;
}

export interface Invoice {
  id?: string;
  brandId: string;
  brandName: string;
  periodStart: Timestamp;
  periodEnd: Timestamp;
  totalAmount: number;
  commissionPct: number;
  commissionAmount: number;
  payoutAmount: number;
  emailSentAt?: Timestamp;
}

export interface StoreInfo {
  businessName: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  gst: string;
  email: string;
}
