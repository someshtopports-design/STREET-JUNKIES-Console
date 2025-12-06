import React, { useState, useEffect, useRef } from 'react';
import { Product, Brand, Sale, SaleItem } from '../types';
import { dbService } from '../services/dbService';
import { Scan, Trash2, ShoppingCart, CheckCircle, ArrowLeft, ArrowRight, User, MapPin, Phone, Minus, Plus } from 'lucide-react';

interface PointOfSaleProps {
  products: Product[];
  brands: Brand[];
  sales: Sale[];
  currentUser: string;
}

export const PointOfSale: React.FC<PointOfSaleProps> = ({ products, brands, sales, currentUser }) => {
  const [view, setView] = useState<'scan' | 'review'>('scan');
  const [skuInput, setSkuInput] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', address: '' });
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (view === 'scan') inputRef.current?.focus();
  }, [view, cart]);

  const handleScan = (e?: React.FormEvent) => {
    e?.preventDefault();
    const product = products.find(p => p.sku === skuInput.trim() || p.id === skuInput.trim());

    if (product) {
      if (product.stock <= 0) {
        alert("Product out of stock!");
        setSkuInput('');
        return;
      }
      const brand = brands.find(b => b.id === product.brandId);
      if (!brand) return;

      const existingItemIndex = cart.findIndex(item => item.productId === product.id);
      const currentCartQty = existingItemIndex >= 0 ? cart[existingItemIndex].quantity : 0;
      
      if (product.stock <= currentCartQty) {
        alert("Insufficient stock available!");
        setSkuInput('');
        return;
      }

      const commissionAmount = (product.sellingPrice * brand.commissionRate) / 100;
      
      if (existingItemIndex >= 0) {
        const newCart = [...cart];
        newCart[existingItemIndex].quantity += 1;
        newCart[existingItemIndex].commission += commissionAmount;
        newCart[existingItemIndex].brandRevenue += (product.sellingPrice - commissionAmount);
        setCart(newCart);
      } else {
        const newItem: SaleItem = {
          productId: product.id,
          sku: product.sku,
          productName: product.name,
          brandId: brand.id,
          brandName: brand.name,
          size: product.size,
          sellingPrice: product.sellingPrice,
          quantity: 1,
          commission: commissionAmount,
          brandRevenue: product.sellingPrice - commissionAmount
        };
        setCart([...cart, newItem]);
      }
      setLastScanned(product.name);
      setTimeout(() => setLastScanned(null), 2000);
    } else {
      if(skuInput.trim() !== '') alert("Product not found");
    }
    setSkuInput('');
    inputRef.current?.focus();
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    const newCart = [...cart];
    const item = newCart[index];
    const brand = brands.find(b => b.id === item.brandId);
    if (!brand) return;

    item.sellingPrice = newPrice;
    const commissionAmount = (newPrice * brand.commissionRate) / 100;
    item.commission = commissionAmount * item.quantity;
    item.brandRevenue = (newPrice - commissionAmount) * item.quantity;
    
    setCart(newCart);
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    const item = newCart[index];
    const product = products.find(p => p.id === item.productId);
    
    if(!product) return;
    if (item.quantity + delta > product.stock) {
        alert("Max stock reached");
        return;
    }
    if (item.quantity + delta <= 0) {
        removeFromCart(index);
        return;
    }

    item.quantity += delta;
    const brand = brands.find(b => b.id === item.brandId);
    if(brand) {
         const commissionUnit = (item.sellingPrice * brand.commissionRate) / 100;
         item.commission = commissionUnit * item.quantity;
         item.brandRevenue = (item.sellingPrice - commissionUnit) * item.quantity;
    }
    setCart(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleFinalizeSale = async () => {
    if (cart.length === 0) return;

    const totalAmount = cart.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0);
    const totalCommission = cart.reduce((acc, item) => acc + item.commission, 0);
    const totalBrandRevenue = cart.reduce((acc, item) => acc + item.brandRevenue, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const newSale: Sale = {
      id: `s${Date.now()}`,
      items: [...cart],
      totalAmount,
      totalCommission,
      totalBrandRevenue,
      timestamp: new Date().toISOString(),
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerAddress: customerDetails.address
    };

    try {
        // 1. Record Sale in DB
        await dbService.addSale(newSale);

        // 2. Update Stock in DB for each item
        for (const item of cart) {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                await dbService.updateProductStock(product.id, product.stock - item.quantity);
            }
        }
        
        // 3. Log Action
        await dbService.addLog('Recorded Sale', `Sale ID: ${newSale.id} | Amount: ₹${totalAmount} | Items: ${totalItems}`, currentUser);

        setCart([]);
        setCustomerDetails({ name: '', phone: '', address: '' });
        setView('scan');
        alert("Sale Recorded & Stock Updated!");
    } catch (error) {
        console.error(error);
        alert("Transaction Failed. Check Connection.");
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0);

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] flex flex-col gap-6 animate-in fade-in">
      {view === 'scan' && (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-full">
          {/* Scanner Area */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full">
            <div className="flex-1 bg-slate-900 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-8 shadow-2xl">
                {/* Visuals omitted for brevity */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent animate-scan pointer-events-none h-full w-full opacity-50"></div>
                <div className="z-10 text-center w-full max-w-lg">
                    <div className="mb-8 relative inline-block">
                        <Scan size={80} className="text-white opacity-80" strokeWidth={1} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"></div>
                    </div>
                    <form onSubmit={handleScan} className="w-full relative z-10">
                       <input
                          ref={inputRef}
                          type="text"
                          value={skuInput}
                          onChange={(e) => setSkuInput(e.target.value)}
                          className="w-full bg-slate-800/50 border border-slate-700 text-white px-6 py-4 text-center text-xl font-mono rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                          placeholder="Scan Barcode Here..."
                          autoFocus
                       />
                    </form>
                </div>
                {lastScanned && (
                  <div className="absolute bottom-8 left-0 right-0 mx-auto w-max animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold flex items-center gap-3 shadow-xl">
                        <CheckCircle size={20} className="text-white" />
                        Added: {lastScanned}
                    </div>
                  </div>
                )}
            </div>
          </div>
          {/* Cart Area */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col h-full overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="font-heading font-bold text-slate-800 flex items-center gap-2 text-lg"><ShoppingCart size={22} className="text-slate-400" /> Current Sale</h3>
                 <span className="font-mono font-bold text-2xl text-slate-900 tracking-tight">₹{cartTotal.toFixed(2)}</span>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {cart.map((item, idx) => (
                     <div key={idx} className="flex justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group">
                         <div className="flex-1 min-w-0 pr-4">
                             <div className="font-heading font-bold text-slate-900 truncate">{item.productName}</div>
                             <div className="text-xs text-slate-500 mt-1">{item.brandName} • {item.size}</div>
                             <div className="mt-2 text-indigo-600 font-bold">₹{item.sellingPrice}</div>
                         </div>
                         <div className="flex flex-col items-end justify-between gap-2">
                            <button onClick={() => removeFromCart(idx)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={18} /></button>
                            <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
                                <button onClick={() => updateQuantity(idx, -1)} className="p-1 hover:bg-white rounded"><Minus size={14} /></button>
                                <span className="px-3 text-sm font-bold w-8 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(idx, 1)} className="p-1 hover:bg-white rounded"><Plus size={14} /></button>
                            </div>
                         </div>
                     </div>
                 ))}
             </div>
             <div className="p-6 border-t border-slate-100 bg-white">
                 <button onClick={() => setView('review')} disabled={cart.length === 0} className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg">Review & Checkout <ArrowRight size={20} /></button>
             </div>
          </div>
        </div>
      )}
      {/* Review View */}
      {view === 'review' && (
        <div className="max-w-5xl mx-auto w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-right-8 duration-300">
            <div className="flex-1 p-6 md:p-10 border-r border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setView('scan')} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm"><ArrowLeft size={20} /></button>
                    <h2 className="text-2xl font-heading font-bold text-slate-900">Final Review</h2>
                </div>
                <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {cart.map((item, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="flex-1">
                                <h4 className="font-heading font-bold text-slate-900">{item.productName}</h4>
                                <p className="text-sm text-slate-500">{item.brandName} • Size: {item.size}</p>
                            </div>
                            <div className="w-32 relative">
                                <input type="number" value={item.sellingPrice} onChange={(e) => handlePriceChange(idx, Number(e.target.value))} className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none" />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 flex justify-between items-end">
                    <span className="text-slate-500 font-medium text-lg">Total Amount</span>
                    <span className="text-4xl font-heading font-bold text-slate-900 tracking-tight">₹{cartTotal.toFixed(2)}</span>
                </div>
            </div>
            <div className="w-full md:w-[400px] bg-white p-8 md:p-10 flex flex-col h-full">
                <h3 className="font-heading font-bold text-slate-900 text-xl mb-6">Customer Details</h3>
                <div className="space-y-4 flex-1">
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Name" value={customerDetails.name} onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} />
                    <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Phone" value={customerDetails.phone} onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} />
                    <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none h-24 resize-none" placeholder="Address" value={customerDetails.address} onChange={e => setCustomerDetails({...customerDetails, address: e.target.value})} />
                </div>
                <button onClick={handleFinalizeSale} className="mt-8 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 text-lg"><CheckCircle size={24} /> CONFIRM SALE</button>
            </div>
        </div>
      )}
    </div>
  );
};
