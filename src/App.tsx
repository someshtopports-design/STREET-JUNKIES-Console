import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BrandOnboarding } from './components/BrandOnboarding';
import { Inventory } from './components/Inventory';
import { PointOfSale } from './components/PointOfSale';
import { Reports } from './components/Reports';
import { Login } from './components/Login';
import { ActivityLog } from './components/ActivityLog';
import { Settings } from './components/Settings';
import { DEFAULT_STORE_PROFILE } from './constants';
import { Brand, Product, Sale, AuditLog, StoreProfile } from './types';
import { Menu } from 'lucide-react';
import { collection, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data State (Empty init, filled by Firebase)
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(DEFAULT_STORE_PROFILE);
  const [loading, setLoading] = useState(true);

  // --- FIREBASE SYNC ---
  useEffect(() => {
    // Listen to Collections
    const unsubBrands = onSnapshot(collection(db, 'brands'), snap => {
      setBrands(snap.docs.map(d => ({ id: d.id, ...d.data() } as Brand)));
    });
    const unsubProducts = onSnapshot(collection(db, 'products'), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    });
    const unsubSales = onSnapshot(collection(db, 'sales'), snap => {
      setSales(snap.docs.map(d => ({ id: d.id, ...d.data() } as Sale))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    });
    const unsubLogs = onSnapshot(collection(db, 'logs'), snap => {
      setAuditLogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    });

    // Fetch Settings Once
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStoreProfile(docSnap.data() as StoreProfile);
        } else {
          await setDoc(docRef, DEFAULT_STORE_PROFILE);
        }
      } catch (e) { console.error("Settings sync error", e); }
      setLoading(false);
    };
    fetchSettings();

    return () => {
      unsubBrands(); unsubProducts(); unsubSales(); unsubLogs();
    };
  }, []);

  if (!currentUser) return <Login onLogin={setCurrentUser} />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold">Connecting to Cloud Database...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard products={products} sales={sales} brands={brands} />;
      case 'brands':
        return <BrandOnboarding brands={brands} currentUser={currentUser} />;
      case 'inventory':
        return <Inventory products={products} brands={brands} currentUser={currentUser} />;
      case 'pos':
        return <PointOfSale products={products} brands={brands} sales={sales} currentUser={currentUser} />;
      case 'reports':
        return <Reports sales={sales} brands={brands} storeProfile={storeProfile} />;
      case 'logs':
        return <ActivityLog logs={auditLogs} />;
      case 'settings':
        return <Settings profile={storeProfile} currentUser={currentUser} />;
      default:
        return <Dashboard products={products} sales={sales} brands={brands} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={() => setCurrentUser(null)}
        currentUser={currentUser}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header - Glassmorphic */}
        <div className="lg:hidden absolute top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-black italic text-xs">SJ</span>
            </div>
            <span className="font-heading font-bold text-slate-900 italic tracking-tight">StreetJunkies</span>
          </div>
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-16 lg:pt-0">
          <div className="min-h-full p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
