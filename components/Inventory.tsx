import React, { useState, useEffect } from 'react';
import { Product, Brand } from '../types';
import { Plus, Printer, Search, X, CheckCircle, Tag, Box, ArrowDownUp, AlertTriangle, Layers, Sparkles, Copy } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  brands: Brand[];
}

export const Inventory: React.FC<InventoryProps> = ({ products, setProducts, brands }) => {
  const [activeView, setActiveView] = useState<'add' | 'stock'>('add');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Product State
  const [newlyCreated, setNewlyCreated] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    size: '',
    category: '',
    sellingPrice: '',
    stock: '',
  });

  const [existingSizes, setExistingSizes] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  // Smart Auto-fill Logic
  useEffect(() => {
    if (formData.brandId && formData.name) {
      // Find matches for this brand and product name
      const matches = products.filter(p => 
        p.brandId === formData.brandId && 
        p.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );

      if (matches.length > 0) {
        // Sort matches by most recently added (assuming higher ID/index is newer, but here just taking first found)
        const match = matches[matches.length - 1]; // Take the last one added as "latest" config
        
        // Auto-fill details if they are empty
        setFormData(prev => ({
          ...prev,
          category: prev.category || match.category,
          sellingPrice: prev.sellingPrice || match.sellingPrice.toString()
        }));

        // Collect existing sizes
        const sizes = matches.map(m => m.size).filter((v, i, a) => a.indexOf(v) === i); // Unique sizes
        setExistingSizes(sizes);
      } else {
        setExistingSizes([]);
      }
    } else {
      setExistingSizes([]);
    }
  }, [formData.name, formData.brandId, products]);

  // Update suggestions when brand changes
  useEffect(() => {
    if (formData.brandId) {
        // Get unique products for this brand
        const brandProducts = products.filter(p => p.brandId === formData.brandId);
        const uniqueByName = Array.from(new Set(brandProducts.map(p => p.name)))
            .map(name => brandProducts.find(p => p.name === name))
            .filter((p): p is Product => p !== undefined);
        setSuggestions(uniqueByName.slice(0, 5)); // Show top 5 recent unique items
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
        size: '', // Clear size so they can enter the new one
        stock: ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandId) {
      alert("Please select a brand");
      return;
    }
    
    const brand = brands.find(b => b.id === formData.brandId);
    const brandPrefix = brand?.name.substring(0, 2).toUpperCase() || 'XX';
    const nameSlug = formData.name.substring(0, 5).toUpperCase().replace(/\s/g, '');
    const sku = `${brandPrefix}-${nameSlug}-${formData.size}-${Math.floor(Math.random() * 1000)}`;

    const newProduct: Product = {
      id: `p${Date.now()}`,
      sku,
      brandId: formData.brandId,
      name: formData.name,
      size: formData.size,
      category: formData.category,
      costPrice: 0, // Cost price removed from UI, defaulted to 0
      sellingPrice: Number(formData.sellingPrice),
      stock: Number(formData.stock),
    };

    setProducts([...products, newProduct]);
    setNewlyCreated(newProduct);
    // Reset form but keep Brand and Name/Category/Price for rapid entry of other sizes
    setFormData(prev => ({ 
        ...prev, 
        size: '', 
        stock: '' 
        // We intentionally keep Name, Category, Price, BrandId populated for faster variation entry
    }));
  };

  // Filter and Sort Logic for "Inventory Left" View
  const getFilteredProducts = () => {
    let result = products.filter(p => p.brandId === selectedBrandFilter);

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.sku.toLowerCase().includes(lowerTerm)
      );
    }

    result.sort((a, b) => a.stock - b.stock);
    return result;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Inventory Control</h1>
          <p className="text-slate-500 mt-1">Manage product catalog and track stock levels.</p>
        </div>
        
        {/* Toggle Buttons */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex w-full md:w-auto">
          <button
            onClick={() => setActiveView('add')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeView === 'add' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Plus size={16} /> Add Product
          </button>
          <button
            onClick={() => setActiveView('stock')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeView === 'stock' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers size={16} /> Inventory Left
          </button>
        </div>
      </div>

      {/* Success Modal for Newly Created Product */}
      {newlyCreated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setNewlyCreated(null)} 
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col md:flex-row">
                 <div className="bg-indigo-600 p-8 flex flex-col items-center justify-center text-center text-white md:w-5/12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 bg-white p-4 rounded-2xl shadow-xl mb-4">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${newlyCreated.sku}`}
                            alt="QR Code"
                            className="w-40 h-40 object-contain"
                        />
                    </div>
                    <p className="font-mono text-sm opacity-80">{newlyCreated.sku}</p>
                 </div>
                 
                 <div className="p-8 md:w-7/12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                        <CheckCircle size={20} /> Product Added
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2 leading-tight">{newlyCreated.name}</h2>
                    <div className="flex gap-2 mb-6">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-medium">{newlyCreated.category}</span>
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-medium">Size: {newlyCreated.size}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="border border-slate-200 p-4 rounded-2xl">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Selling Price</p>
                            <p className="text-xl font-bold text-slate-900">₹{newlyCreated.sellingPrice}</p>
                        </div>
                        <div className="border border-slate-200 p-4 rounded-2xl">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Stock Qty</p>
                            <p className="text-xl font-bold text-slate-900">{newlyCreated.stock}</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => alert("Printer command sent!")}
                        className="w-full py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <Printer size={18} /> Print Label Now
                    </button>
                    
                    <button 
                        onClick={() => setNewlyCreated(null)}
                        className="w-full mt-3 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition-colors"
                    >
                        Add Another Variation
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* VIEW 1: ADD PRODUCT */}
      {activeView === 'add' && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in slide-in-from-left-4 duration-300">
          <h2 className="text-xl font-heading font-bold mb-6 text-slate-900 border-b border-slate-100 pb-4">New Product Entry</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
             {/* Brand Selection Row */}
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Select Brand First</label>
                <select
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    value={formData.brandId}
                    onChange={e => setFormData({ 
                        name: '', size: '', category: '', sellingPrice: '', stock: '', // Clear other fields on brand change
                        brandId: e.target.value 
                    })}
                >
                    <option value="">-- Choose Brand --</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                        <Sparkles size={12} className="text-indigo-500"/> Quick Add: Recent Products
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => handleQuickFill(p)}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100 flex items-center gap-2 transition-colors"
                            >
                                <Copy size={12} /> {p.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Product Name</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Vintage Hoodie"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        disabled={!formData.brandId}
                    />
                    {existingSizes.length > 0 && (
                         <div className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md inline-flex items-center gap-1">
                            <CheckCircle size={10} /> Found existing sizes: {existingSizes.join(', ')}
                         </div>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Outerwear"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        disabled={!formData.brandId}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Selling Price (₹)</label>
                    <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.sellingPrice}
                        onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })}
                        disabled={!formData.brandId}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Size</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. M, L, XL"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                        value={formData.size}
                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                        disabled={!formData.brandId}
                        autoFocus={formData.name.length > 0 && formData.category.length > 0} 
                    />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Enter the specific size variant</p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Stock Quantity</label>
                    <input
                        required
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                        disabled={!formData.brandId}
                    />
                </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!formData.brandId}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Plus size={20} /> Create Variant
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 2: INVENTORY LEFT */}
      {activeView === 'stock' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          
          {/* Controls Bar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                 <Tag size={12} /> Select Brand to View
               </label>
               <select 
                 value={selectedBrandFilter}
                 onChange={(e) => setSelectedBrandFilter(e.target.value)}
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
               >
                 <option value="">-- Choose Brand --</option>
                 {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
               </select>
            </div>

            <div className={`flex-[2] space-y-2 transition-opacity duration-300 ${!selectedBrandFilter ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
               <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                 <Search size={12} /> Search in Brand
               </label>
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="Search product name or SKU..." 
                   disabled={!selectedBrandFilter}
                   className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>
          </div>

          {/* Logic: Only show results if Brand is selected */}
          {!selectedBrandFilter ? (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-slate-300">
                   <Tag size={40} />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-2">No Brand Selected</h3>
                <p className="text-slate-500 max-w-sm">Please select a brand from the dropdown above to view its inventory and stock levels.</p>
             </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                    <ArrowDownUp size={16} /> Sorted: Low to High Stock
                  </span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-500 border border-slate-200">
                    {filteredProducts.length} Items Found
                  </span>
               </div>

               {/* Mobile Card View */}
               <div className="md:hidden">
                  {filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No products found.</div>
                  ) : (
                    filteredProducts.map(product => (
                      <div key={product.id} className="p-5 border-b border-slate-100 last:border-0 flex gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${product.stock < 10 ? 'bg-red-50 border-red-100 text-red-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                              <Box size={24} />
                          </div>
                          <div className="flex-1">
                              <h4 className="font-bold text-slate-900">{product.name}</h4>
                              <p className="text-xs text-slate-500 font-mono mt-1">{product.sku}</p>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-sm font-medium text-slate-600">Size: {product.size}</span>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                   {product.stock} Left
                                </span>
                              </div>
                          </div>
                      </div>
                    ))
                  )}
               </div>

               {/* Desktop Table View */}
               <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                      <th className="px-6 py-4 font-semibold">SKU</th>
                      <th className="px-6 py-4 font-semibold">Product Name</th>
                      <th className="px-6 py-4 font-semibold">Size</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Stock Level</th>
                      <th className="px-6 py-4 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                       <tr><td colSpan={6} className="p-8 text-center text-slate-400">No products found in this brand.</td></tr>
                    ) : (
                      filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-slate-600 text-xs">{product.sku}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{product.name}</td>
                          <td className="px-6 py-4 text-slate-600">{product.size}</td>
                          <td className="px-6 py-4 font-bold">₹{product.sellingPrice}</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                                   <div 
                                      className={`h-full rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                      style={{ width: `${Math.min(product.stock, 100)}%` }}
                                   ></div>
                                </div>
                                <span className="font-bold text-slate-900">{product.stock}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {product.stock < 10 ? (
                               <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                                  <AlertTriangle size={12} /> Low
                               </span>
                            ) : (
                               <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                                  <CheckCircle size={12} /> Good
                               </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
               </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};