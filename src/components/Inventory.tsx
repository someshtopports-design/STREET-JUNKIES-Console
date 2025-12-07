import React, { useState, useEffect } from 'react';
import { Product, Brand } from '../types';
import { dbService } from '../services/dbService';
import { Plus, Printer, Search, X, CheckCircle, Tag, Box, ArrowDownUp, AlertTriangle, Layers, Sparkles, Copy, ScanLine } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  brands: Brand[];
  currentUser: string;
}

export const Inventory: React.FC<InventoryProps> = ({ products, brands, currentUser }) => {
  const [activeView, setActiveView] = useState<'add' | 'stock'>('add');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Create Product State
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
      // Find matches for this brand and product name
      const matches = products.filter(p =>
        p.brandId === formData.brandId &&
        p.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );

      if (matches.length > 0) {
        // Sort matches by most recently added 
        const match = matches[matches.length - 1];

        // Auto-fill details if they are empty
        setFormData(prev => ({
          ...prev,
          category: prev.category || match.category,
          sellingPrice: prev.sellingPrice || match.sellingPrice.toString()
        }));

        // Collect existing sizes
        const sizes = matches.map(m => m.size).filter((v, i, a) => a.indexOf(v) === i);
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


  const generateSKU = (brandName: string, category: string, size: string, name: string) => {
    const brandCode = brandName.substring(0, 3).toUpperCase();
    const catCode = category.substring(0, 3).toUpperCase();
    const sizeCode = size.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const nameCode = name.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${brandCode}-${nameCode}-${catCode}-${sizeCode}-${random}`;
  };

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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.brandId || !formData.category || !formData.size || !formData.sellingPrice || !formData.stock) {
      alert("Please fill all fields");
      return;
    }

    const brand = brands.find(b => b.id === formData.brandId);
    if (!brand) return;

    // SKU Generation
    let sku = '';
    if (skuMode === 'manual' && formData.manualSku) {
      sku = formData.manualSku;
      // Check uniqueness
      if (products.some(p => p.sku === sku)) {
        alert("SKU already exists! Please use a unique SKU.");
        return;
      }
    } else {
      sku = generateSKU(brand.name, formData.category, formData.size, formData.name);
      // Ensure SKU is unique loop (simple check)
      let retries = 0;
      while (products.some(p => p.sku === sku) && retries < 5) {
        sku = generateSKU(brand.name, formData.category, formData.size, formData.name);
        retries++;
      }
    }


    const newProduct: Product = {
      id: `p${Date.now()}`,
      sku: sku,
      brandId: formData.brandId,
      name: formData.name,
      size: formData.size,
      category: formData.category,
      costPrice: 0,
      sellingPrice: Number(formData.sellingPrice),
      stock: Number(formData.stock),
    };

    try {
      await dbService.addProduct(newProduct);
      await dbService.addLog('Added Product', `Added ${newProduct.name} (${newProduct.sku})`, currentUser);

      setNewlyCreated(newProduct);

      // Reset critical fields but keep generic ones for faster entry
      setFormData(prev => ({
        ...prev,
        size: '',
        stock: '',
        manualSku: ''
      }));
      setSkuMode('auto');

    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  const handlePrintLabel = () => {
    window.print();
  };

  // Filter products for Stock View
  const filteredProducts = products.filter(p => {
    const matchesBrand = selectedBrandFilter ? p.brandId === selectedBrandFilter : true;
    const matchesSearch = searchTerm ? (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    return matchesBrand && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500 mt-1">Manage stock and generate labels.</p>
        </div>
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => setActiveView('add')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeView === 'add' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Add Products
          </button>
          <button
            onClick={() => setActiveView('stock')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeView === 'stock' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Manage Stock
          </button>
        </div>
      </div>

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

      {activeView === 'add' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-heading font-bold mb-6 text-slate-900 flex items-center gap-2">
                <Plus className="text-indigo-600" size={24} />
                Add New Item
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-6">
                {/* Brand Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Brand</label>
                    <select
                      value={formData.brandId}
                      onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                      required
                    >
                      <option value="">Select Brand...</option>
                      {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category - with standard options */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <div className="relative">
                      <input
                        list="categories"
                        type="text"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        placeholder="e.g. T-Shirt"
                        required
                      />
                      <datalist id="categories">
                        <option value="T-Shirt" />
                        <option value="Jeans" />
                        <option value="Jacket" />
                        <option value="Sneakers" />
                        <option value="Hoodie" />
                        <option value="Accessory" />
                      </datalist>
                      <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                  </div>
                </div>

                {/* Product Name with Suggestions */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Product Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                      placeholder="Enter product name"
                      required
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 p-2 transform scale-95 opacity-0 animate-in fade-in zoom-in-95 fill-mode-forwards duration-200" style={{ opacity: 1, transform: 'scale(1)' }}>
                        <div className="text-xs font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Recent Items</div>
                        {suggestions.map(p => (
                          <div
                            key={p.id}
                            onClick={() => setFormData({ ...formData, name: p.name, category: p.category, sellingPrice: p.sellingPrice.toString() })}
                            className="px-3 py-2 hover:bg-indigo-50 rounded-lg cursor-pointer flex justify-between items-center group"
                          >
                            <span className="font-medium text-slate-700 group-hover:text-indigo-700">{p.name}</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{p.category}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-2">
                    <label className="text-sm font-bold text-slate-700">Size</label>
                    <div className="relative">
                      <input
                        list="sizes"
                        type="text"
                        value={formData.size}
                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold"
                        placeholder="M"
                        required
                      />
                      <datalist id="sizes">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'].map(s => <option key={s} value={s} />)}
                      </datalist>
                    </div>
                    {existingSizes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {existingSizes.map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setFormData({ ...formData, size: s })}
                            className={`text-[10px] px-2 py-1 rounded border ${formData.size === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label className="text-sm font-bold text-slate-700">Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={formData.sellingPrice}
                        onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label className="text-sm font-bold text-slate-700">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold"
                      required
                    />
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label className="text-sm font-bold text-slate-700">SKU Mode</label>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <button type="button" onClick={() => setSkuMode('auto')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${skuMode === 'auto' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}>Auto</button>
                      <button type="button" onClick={() => setSkuMode('manual')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${skuMode === 'manual' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}>Manual</button>
                    </div>
                  </div>
                </div>

                {/* Manual SKU Input */}
                {skuMode === 'manual' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1"><ScanLine size={14} /> Manual SKU / Barcode</label>
                    <input
                      type="text"
                      value={formData.manualSku}
                      onChange={e => setFormData({ ...formData, manualSku: e.target.value.toUpperCase() })}
                      placeholder="Scan or type SKU code..."
                      className="w-full px-4 py-3 bg-indigo-50 border-2 border-indigo-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono font-bold text-indigo-900 tracking-wider"
                    />
                  </div>
                )}


                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={24} />
                    Add Product to Inventory
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Newly Created Preview / Label */}
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-slate-900">Latest Addition</h3>
            {newlyCreated ? (
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle size={12} /> Successfully Added
                  </span>
                  <button onClick={handlePrintLabel} className="text-slate-400 hover:text-slate-900">
                    <Printer size={20} />
                  </button>
                </div>

                <div className="text-center space-y-2 mb-6">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{newlyCreated.name}</h2>
                  <div className="text-slate-500 font-medium">{brands.find(b => b.id === newlyCreated.brandId)?.name}</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Size</span>
                    <span className="font-bold text-slate-900">{newlyCreated.size}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Price</span>
                    <span className="font-bold text-slate-900">₹{newlyCreated.sellingPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">SKU</span>
                    <span className="font-mono font-bold text-indigo-600 tracking-wider">{newlyCreated.sku}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  {/* Mock Barcode */}
                  <div className="h-12 w-full bg-slate-900 rounded-sm opacity-90 relative">
                    <div className="absolute inset-0 flex justify-between px-2 items-center">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className="h-full bg-white w-0.5" style={{ opacity: Math.random() > 0.5 ? 1 : 0.3, width: Math.random() * 4 + 'px' }}></div>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] tracking-[0.2em] font-mono text-slate-400 uppercase">{newlyCreated.sku}</span>
                </div>

              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400 flex flex-col items-center gap-4">
                <Box size={48} className="opacity-20" />
                <p className="font-medium text-sm">Add a product to see the label preview here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeView === 'stock' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 font-medium"
                value={selectedBrandFilter}
                onChange={e => setSelectedBrandFilter(e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="p-6">Product</th>
                  <th className="p-6">SKU</th>
                  <th className="p-6">Brand</th>
                  <th className="p-6 text-center">Size</th>
                  <th className="p-6 text-right">Price</th>
                  <th className="p-6 text-center">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-6 font-bold text-slate-900">{p.name} <span className="block text-xs text-slate-400 font-normal mt-1">{p.category}</span></td>
                    <td className="p-6 font-mono text-xs text-slate-500">{p.sku}</td>
                    <td className="p-6 text-sm text-slate-600">{brands.find(b => b.id === p.brandId)?.name}</td>
                    <td className="p-6 text-center text-sm font-bold text-slate-700 bg-slate-50 rounded-lg">{p.size}</td>
                    <td className="p-6 text-right font-bold text-slate-900">₹{p.sellingPrice}</td>
                    <td className="p-6 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {p.stock < 5 && <AlertTriangle size={12} />}
                        {p.stock} Left
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-slate-400">
                      No products found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
