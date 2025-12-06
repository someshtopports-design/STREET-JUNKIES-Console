import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BrandOnboarding } from './components/BrandOnboarding';
import { Inventory } from './components/Inventory';
import { PointOfSale } from './components/PointOfSale';
import { Reports } from './components/Reports';
import { INITIAL_BRANDS, INITIAL_PRODUCTS, INITIAL_SALES } from './constants';
import { Brand, Product, Sale } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Global State (Mock Database)
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard products={products} sales={sales} brands={brands} />;
      case 'brands':
        return <BrandOnboarding brands={brands} setBrands={setBrands} />;
      case 'inventory':
        return <Inventory products={products} setProducts={setProducts} brands={brands} />;
      case 'pos':
        return <PointOfSale products={products} setProducts={setProducts} brands={brands} sales={sales} setSales={setSales} />;
      case 'reports':
        return <Reports sales={sales} brands={brands} />;
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