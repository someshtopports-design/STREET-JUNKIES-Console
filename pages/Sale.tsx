import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge } from '../components/UI';
import { CheckCircle, ArrowLeft, ShoppingBag, MapPin, User, ChevronLeft, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

export const Sale: React.FC = () => {
  const { qrToken } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<'review' | 'success'>('review');
  const [loading, setLoading] = useState(false);
  
  // Mock Data Fetch based on qrToken
  const product = {
    brand: 'Nike',
    name: 'Air Jordan 1 High',
    size: 'UK 10',
    color: 'Lost & Found',
    basePrice: 16999,
    image: 'https://images.unsplash.com/photo-1513188732907-5f732b831ca2?auto=format&fit=crop&q=80&w=600' 
  };

  const [form, setForm] = useState({
    price: product.basePrice,
    qty: 1,
    name: '',
    phone: '',
    address: ''
  });

  const total = form.price * form.qty;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone) {
        toast.error("Phone number is required");
        return;
    }
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 animate-fade-in transition-colors duration-300">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight text-center">Sale Recorded</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-center max-w-xs text-lg">Transaction confirmed. The brand has been notified.</p>
        
        <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl mb-8 overflow-hidden">
          <div className="bg-zinc-900 dark:bg-zinc-100 p-8 text-white dark:text-zinc-900 text-center">
             <p className="opacity-70 text-xs uppercase tracking-widest mb-1 font-bold">Total Amount</p>
             <p className="text-4xl font-black">₹{total.toLocaleString()}</p>
          </div>
          <div className="p-8 space-y-4">
             <div className="flex justify-between text-base">
               <span className="text-zinc-500 dark:text-zinc-400">Product</span>
               <span className="font-bold text-zinc-900 dark:text-zinc-100">{product.name}</span>
             </div>
             <div className="flex justify-between text-base">
               <span className="text-zinc-500 dark:text-zinc-400">Details</span>
               <span className="font-medium text-zinc-900 dark:text-zinc-100">{product.brand} • {product.size}</span>
             </div>
             <div className="flex justify-between text-base pt-4 border-t border-zinc-100 dark:border-zinc-800">
               <span className="text-zinc-500 dark:text-zinc-400">Customer</span>
               <span className="font-medium text-zinc-900 dark:text-zinc-100">{form.name || 'Walk-in'}</span>
             </div>
          </div>
        </Card>

        <Button onClick={() => window.location.reload()} variant="outline" className="w-full max-w-md h-12 text-base font-semibold bg-transparent border-zinc-300 dark:border-zinc-700">
          Record Next Sale
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 font-sans transition-colors duration-300">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 px-4 py-4 flex items-center justify-between">
           <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800">
             <ChevronLeft className="w-5 h-5 mr-1" /> Back
           </Button>
           <span className="font-bold text-zinc-900 dark:text-zinc-100">Scan & Sell</span>
           <div className="w-8" />
        </div>
        
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Product Visuals */}
                <div>
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-3xl overflow-hidden relative shadow-inner mb-6">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                        <div className="absolute top-4 left-4">
                           <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-zinc-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                              {product.brand}
                           </span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight mb-2">{product.name}</h1>
                    <div className="flex flex-wrap gap-2 text-sm">
                       <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 px-3 py-1">Size: {product.size}</Badge>
                       <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 px-3 py-1">Color: {product.color}</Badge>
                    </div>
                </div>

                {/* Transaction Form */}
                <form onSubmit={handleConfirm} className="flex flex-col h-full justify-center">
                    <Card className="p-6 lg:p-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl">
                        {/* Pricing */}
                        <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                            <div className="flex items-end gap-4 mb-6">
                               <div className="flex-1">
                                  <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Price</label>
                                  <div className="relative">
                                     <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-bold text-zinc-400">₹</span>
                                     <input 
                                       type="number"
                                       className="w-full bg-transparent text-3xl font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none border-b-2 border-transparent focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors pl-6 pb-1"
                                       value={form.price}
                                       onChange={(e) => setForm({...form, price: Number(e.target.value)})}
                                     />
                                  </div>
                               </div>
                               
                               <div className="flex flex-col items-center">
                                  <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Qty</label>
                                  <div className="flex items-center bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-700 p-1 shadow-sm">
                                     <button 
                                       type="button"
                                       onClick={() => setForm(p => ({...p, qty: Math.max(1, p.qty - 1)}))}
                                       className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                                     >
                                        <Minus className="w-4 h-4" />
                                     </button>
                                     <span className="w-8 text-center font-bold text-lg text-zinc-900 dark:text-zinc-100">{form.qty}</span>
                                     <button 
                                       type="button"
                                       onClick={() => setForm(p => ({...p, qty: p.qty + 1}))}
                                       className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors"
                                     >
                                        <Plus className="w-4 h-4" />
                                     </button>
                                  </div>
                               </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-700/50">
                               <span className="font-medium text-zinc-500 dark:text-zinc-400">Total Payable</span>
                               <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Customer */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-2 mb-2">
                               <User className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                               <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Customer Details</h4>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                               <Input 
                                  placeholder="Full Name" 
                                  value={form.name} 
                                  onChange={e => setForm({...form, name: e.target.value})}
                                  className="bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900"
                               />
                               <Input 
                                  placeholder="Phone Number (Required)" 
                                  value={form.phone} 
                                  onChange={e => setForm({...form, phone: e.target.value})}
                                  className="bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900"
                                  required
                               />
                               <div className="relative">
                                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                  <textarea 
                                    rows={2} 
                                    className="w-full rounded-lg bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900 border focus:border-zinc-200 dark:focus:border-zinc-800 text-zinc-900 dark:text-zinc-100 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800 transition-all resize-none"
                                    placeholder="Address (Optional)"
                                    value={form.address}
                                    onChange={(e) => setForm({...form, address: e.target.value})}
                                  />
                               </div>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg" 
                            className="w-full h-14 text-base shadow-xl shadow-zinc-900/20 dark:shadow-none rounded-xl font-bold" 
                            isLoading={loading}
                        >
                            Confirm Sale
                        </Button>
                    </Card>
                </form>
            </div>
        </div>
    </div>
  );
};