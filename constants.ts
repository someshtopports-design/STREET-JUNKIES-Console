import { Brand, Product, BrandType, Sale } from './types';

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'b1',
    name: 'Urban Threadz',
    contactEmail: 'contact@urbanthreadz.com',
    contactPhone: '555-0101',
    type: BrandType.EXCLUSIVE,
    commissionRate: 15,
    joinedAt: new Date(2023, 5, 1).toISOString(),
  },
  {
    id: 'b2',
    name: 'Luxe Leather',
    contactEmail: 'sales@luxeleather.com',
    contactPhone: '555-0202',
    type: BrandType.NON_EXCLUSIVE,
    commissionRate: 25,
    joinedAt: new Date(2023, 6, 15).toISOString(),
  },
  {
    id: 'b3',
    name: 'EcoWear',
    contactEmail: 'hello@ecowear.io',
    contactPhone: '555-0303',
    type: BrandType.EXCLUSIVE,
    commissionRate: 12,
    joinedAt: new Date(2023, 8, 10).toISOString(),
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sku: 'UT-TSHIRT-M-BLK',
    brandId: 'b1',
    name: 'Classic Tee',
    size: 'M',
    category: 'Apparel',
    costPrice: 10,
    sellingPrice: 30,
    stock: 50,
  },
  {
    id: 'p2',
    sku: 'UT-TSHIRT-L-BLK',
    brandId: 'b1',
    name: 'Classic Tee',
    size: 'L',
    category: 'Apparel',
    costPrice: 10,
    sellingPrice: 30,
    stock: 35,
  },
  {
    id: 'p3',
    sku: 'LL-JACKET-L-BRN',
    brandId: 'b2',
    name: 'Bomber Jacket',
    size: 'L',
    category: 'Outerwear',
    costPrice: 80,
    sellingPrice: 200,
    stock: 12,
  },
  {
    id: 'p4',
    sku: 'EW-HOODIE-S-GRN',
    brandId: 'b3',
    name: 'Recycled Hoodie',
    size: 'S',
    category: 'Apparel',
    costPrice: 25,
    sellingPrice: 65,
    stock: 5, // Low stock
  }
];

export const INITIAL_SALES: Sale[] = []; // Start empty or add mock if needed