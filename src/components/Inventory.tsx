import React, { useState, useEffect } from 'react';
import { Product, Brand } from '../types';
import { dbService } from '../services/dbService';
import { Plus, Printer, Search, X, CheckCircle, Tag, Box, ArrowDownUp, AlertTriangle, Layers, Sparkles, Copy, ScanLine } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  brands: Brand[];
  logAction: (action: string, details: string) => void;
  currentUser: string; // Added prop
}

// Note: setProducts and logAction props are kept for compatibility but logic moves to dbService inside
export const Inventory: React.FC<InventoryProps> = ({ products, brands, currentUser }) => {
  const [activeView, setActiveView] = useState<'add' | 'stock'>('add');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State
  const [newlyCreated, setNewlyCreated] = useState<Product | null>(null);
  const [skuMode, setSkuMode] = useState<'auto' | 'manual'>('auto');

  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    size: '',
    category: '',
    sellingPrice: '',
    stock: '',
    manualSku: ''
  });

  const [existingSizes, setExistingSizes] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  // Smart Auto-fill Logic
  useEffect(() => {
    if (formData.brandId && formData.name) {
      const matches = products.filter(p => 
        p.brandId === formData.brandId && 
        p.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );

      if (matches.length > 0) {
        const match = matches[matches.length - 1];
        setFormData(prev => ({
          ...prev,
          category: prev.category || match.category,
          sellingPrice: prev.sellingPrice || match.sellingPrice.toString()
        }));
        const sizes = matches.map(m => m.size).filter((v, i, a) => a.indexOf(v) === i);
        setExistingSizes(sizes);
      } else {
        setExistingSizes([]);
      }
    } else {
      setExistingSizes([]);
    }
  }, [formData.name, formData.brandId, products]);

  // Update suggestions
  useEffect(() => {
    if (formData.brandId) {
        const brandProducts = products.filter(p => p.brandId === formData.brandId);
        const uniqueByName = Array.from(new Set(brandProducts.map(p => p.name)))
            .map(name => brandProducts.find(p => p.name === name))
            .filter((p): p is Product => p !== undefined);
        setSuggestions(uniqueByName.slice(0, 5));
    } else {
        setSuggestions([]);
    }
  }, [formData.brandId, products]);

  const handleQuickFill = (product: Product) => {
    setFormData(prev => ({
        ...prev,
        name: product.name,
        category: product.category,
        sellingPrice: product.sellingPrice.toString(),
        size: '',
        stock: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandId) {
      alert("Please select a brand");
      return;
    }
    
    const brand = brands.find(b => b.id === formData.brandId);
    const brandPrefix = brand?.name.substring(0, 2).toUpperCase() || 'XX';
    const nameSlug = formData.name.substring(0, 5).toUpperCase().replace(/\s/g, '');
    
    // SKU Logic
    let sku = '';
    if (skuMode === 'auto') {
        sku = `${brandPrefix}-${nameSlug}-${formData.size}-${Math.floor(Math.random() * 1000)}`;
    } else {
        if (!formData.manualSku.trim()) {
            alert("Please scan or enter a SKU.");
            return;
        }
        sku = formData.manualSku.trim();
        // Duplicate check
        if (products.some(p => p.sku === sku)) {
            alert("This SKU/Barcode already exists in inventory!");
            return;
        }
    }

    const newProduct: Product = {
      id: `p${Date.now()}`,
      sku,
      brandId: formData.brandId,
      name: formData.name,
      size: formData.size,
      category: formData.category,
      costPrice: 0,
      sellingPrice: Number(formData.sellingPrice),
      stock: Number(formData.stock),
    };

    // Firebase Save
    await dbService.addProduct(newProduct);
    await dbService.addLog('Added Inventory', `Added ${formData.stock} units of ${formData.name} (${formData.size}) to ${brand?.name}`, currentUser);

    setNewlyCreated(newProduct);
    
    // Reset form
    setFormData(prev => ({ 
        ...prev, 
        size: '', 
        stock: '',
        manualSku: ''
    }));
  };

  const filteredProducts = products.filter(p => p.brandId === selectedBrandFilter)
    .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.includes(searchTerm))
    .sort((a, b) => a.stock - b.stock);

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Inventory Control</h1>
          <p className="text-slate-500 mt-1">Manage product catalog and track stock levels.</p>
        </div>
        
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex w-full md:w-auto">
          <button onClick={() => setActiveView('add')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeView === 'add' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
            <Plus size={16} /> Add Product
          </button>
          <button onClick={() => setActiveView('stock')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeView === 'stock' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
            <Layers size={16} /> Inventory Left
          </button>
        </div>
      </div>

      {newlyCreated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
              <button onClick={() => setNewlyCreated(null)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors z-10"><X size={20} /></button>
              <div className="flex flex-col md:flex-row">
                 <div className="bg-indigo-600 p-8 flex flex-col items-center justify-center text-center text-white md:w-5/12 relative overflow-hidden">
                    <div className="bg-white p-4 rounded-2xl shadow-xl mb-4 relative z-10">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${newlyCreated.sku}`} alt="QR Code" className="w-40 h-40 object-contain" />
                    </div>
                    <p className="font-mono text-sm opacity-80">{newlyCreated.sku}</p>
                 </div>
                 <div className="p-8 md:w-7/12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2"><CheckCircle size={20} /> Product Added</div>
                    <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2 leading-tight">{newlyCreated.name}</h2>
                    <p className="text-slate-500 mb-6">Added to global database.</p>
                    <button onClick={() => setNewlyCreated(null)} className="w-full mt-3 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition-colors">Add Another</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeView === 'add' && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in slide-in-from-left-4 duration-300">
          <h2 className="text-xl font-heading font-bold mb-6 text-slate-900 border-b border-slate-100 pb-4">New Product Entry</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Select Brand First</label>
                <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all font-medium"
                    value={formData.brandId}
                    onChange={e => setFormData({ name: '', size: '', category: '', sellingPrice: '', stock: '', manualSku: '', brandId: e.target.value })}>
                    <option value="">-- Choose Brand --</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>

            {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 animate-in fade-in">
                    {suggestions.map(p => (
                        <button key={p.id} type="button" onClick={() => handleQuickFill(p)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100 flex items-center gap-2">
                            <Copy size={12} /> {p.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Product Name</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={!formData.brandId} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} disabled={!formData.brandId} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Selling Price (₹)</label>
                    <input required type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.sellingPrice} onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })} disabled={!formData.brandId} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-4">
                    <div className="flex gap-4">
                         <div className="flex-1 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Size</label>
                            <input required type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} disabled={!formData.brandId} />
                         </div>
                         <div className="flex-1 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Stock</label>
                            <input required type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} disabled={!formData.brandId} />
                         </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex justify-between">
                        <span>Barcode / SKU Type</span>
                        <div className="flex bg-slate-200 rounded-lg p-0.5 scale-90 origin-right">
                             <button type="button" onClick={() => setSkuMode('auto')} className={`px-3 py-1 rounded-md text-xs font-bold ${skuMode === 'auto' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Auto Gen</button>
                             <button type="button" onClick={() => setSkuMode('manual')} className={`px-3 py-1 rounded-md text-xs font-bold ${skuMode === 'manual' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Manual / Scan</button>
                        </div>
                    </label>
                    
                    {skuMode === 'auto' ? (
                        <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 font-mono text-sm flex items-center justify-between">
                            <span>System Generated</span>
                            <Sparkles size={16} />
                        </div>
                    ) : (
                        <div className="relative">
                            <input required type="text" placeholder="Scan Tag or Type SKU" 
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-indigo-600"
                                value={formData.manualSku} onChange={e => setFormData({ ...formData, manualSku: e.target.value })} disabled={!formData.brandId} autoFocus 
                            />
                            <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={!formData.brandId} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-10 py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                <Plus size={20} /> Add to Inventory
              </button>
            </div>
          </form>
        </div>
      )}

      {activeView === 'stock' && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Tag size={12} /> Select Brand</label>
               <select value={selectedBrandFilter} onChange={(e) => setSelectedBrandFilter(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none">
                 <option value="">-- Choose Brand --</option>
                 {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
               </select>
            </div>
            <div className={`flex-[2] space-y-2 ${!selectedBrandFilter ? 'opacity-50' : ''}`}>
               <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Search size={12} /> Search</label>
               <input type="text" placeholder="Search..." disabled={!selectedBrandFilter} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {!selectedBrandFilter ? (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400">
                <Tag size={40} className="mx-auto mb-4 opacity-50"/>
                <p>Select a brand to view stock.</p>
             </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                      <th className="px-6 py-4 font-semibold">SKU</th>
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Size</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-400">No products.</td></tr> : 
                      filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono text-slate-600 text-xs">{product.sku}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{product.name}</td>
                          <td className="px-6 py-4 text-slate-600">{product.size}</td>
                          <td className="px-6 py-4 font-bold">₹{product.sellingPrice}</td>
                          <td className="px-6 py-4 font-bold">{product.stock}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
