import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    query, 
    where,
    setDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { Brand, Product, Sale, AuditLog, StoreProfile } from "../types";

// Collection References
const brandsRef = collection(db, "brands");
const productsRef = collection(db, "products");
const salesRef = collection(db, "sales");
const logsRef = collection(db, "logs");
const settingsRef = collection(db, "settings");

export const dbService = {
    // Brands
    addBrand: async (brand: Brand) => {
        // We use setDoc with specific ID if provided, or addDoc for auto-ID. 
        // Here we keep the ID consistent if we generated it, or let Firestore decide.
        // For simplicity with existing ID logic:
        const { id, ...data } = brand;
        await setDoc(doc(brandsRef, id), data);
    },
    updateBrand: async (id: string, data: Partial<Brand>) => {
        await updateDoc(doc(brandsRef, id), data);
    },
    deleteBrand: async (id: string) => {
        await deleteDoc(doc(brandsRef, id));
    },

    // Products
    addProduct: async (product: Product) => {
        const { id, ...data } = product;
        await setDoc(doc(productsRef, id), data);
    },
    updateProductStock: async (id: string, newStock: number) => {
        await updateDoc(doc(productsRef, id), { stock: newStock });
    },
    
    // Sales
    addSale: async (sale: Sale) => {
        const { id, ...data } = sale;
        await setDoc(doc(salesRef, id), data);
    },

    // Logs
    addLog: async (action: string, details: string, user: string) => {
        const newLog: AuditLog = {
            id: `log${Date.now()}`,
            action,
            details,
            user,
            timestamp: new Date().toISOString()
        };
        const { id, ...data } = newLog;
        await setDoc(doc(logsRef, id), data);
    },

    // Settings
    updateStoreProfile: async (profile: StoreProfile) => {
        // We use a fixed ID 'main' for the single store profile
        await setDoc(doc(settingsRef, 'main'), profile);
    }
};
