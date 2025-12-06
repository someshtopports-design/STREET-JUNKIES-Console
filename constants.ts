import { Brand, Product, Sale, StoreProfile } from './types';

// Empty initial state as requested
export const INITIAL_BRANDS: Brand[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_SALES: Sale[] = [];

export const DEFAULT_STORE_PROFILE: StoreProfile = {
  name: 'STREET JUNKIES INDIA',
  address: 'Ground Floor of Property No. M-84, Greater Kailash Part-2, M-Block Market, New Delhi – 110048',
  phone: '6363299237',
  email: 'streetjunkiesindia@gmail.com',
  gst: '07ABMCS5480Q1ZD'
};