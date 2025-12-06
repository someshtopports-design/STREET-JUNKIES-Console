export enum BrandType {
  EXCLUSIVE = 'Exclusive',
  NON_EXCLUSIVE = 'Non-Exclusive'
}

export interface Brand {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  type: BrandType;
  commissionRate: number; // Percentage (e.g., 15 for 15%)
  joinedAt: string;
}

export interface Product {
  id: string;
  sku: string; // Unique Barcode/QR content
  brandId: string;
  name: string;
  size: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
}

export interface SaleItem {
  productId: string;
  sku: string;
  productName: string;
  brandId: string;
  brandName: string;
  size: string;
  sellingPrice: number; // This can be edited during sale
  quantity: number;
  commission: number; // Store revenue based on final selling price
  brandRevenue: number; // Payable to brand based on final selling price
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  totalCommission: number;
  totalBrandRevenue: number;
  timestamp: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
}

export interface Notification {
  id: string;
  brandId: string;
  message: string;
  type: 'sale' | 'settlement' | 'alert';
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
}

export interface StoreProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  gst: string;
}