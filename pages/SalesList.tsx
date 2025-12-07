import React, { useState } from 'react';
import { Card, Button, Badge, Input } from '../components/UI';
import { Scan, X, CheckCircle, ShoppingBag, MapPin, User, ArrowRight, Camera, Mail, Plus, Minus, Search, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

type ViewMode = 'idle' | 'scan' | 'review' | 'success';

export const SalesList: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>('idle');
  const [scannedData, setScannedData] = useState<any>(null);
  const [lastSale, setLastSale] = useState<any>(null);

  const handleScanSuccess = (token: string) => {
    // Simulate fetching data based on token
    setScannedData({
       token,
       brand: 'Nike',
       product: 'Air Jordan 1 Retro High',
       color: 'Chicago / Lost & Found',
       size: 'UK 9',
       basePrice: 16999,
       // Using a solid color placeholder for visual consistency if image fails
       image: 'https://images.unsplash.com/photo-1513188732907-5f732b831ca2?auto=format&fit=crop&q=80&w=600' 
    });
    setMode('review');
  };

  const handleSaleComplete = (saleData: any) => {
    setLastSale(saleData);
    setMode('success');
    toast.success('Sale recorded successfully');
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto min-h-[600px] flex flex-col">
      
      {/* --- IDLE STATE (Ready to Scan) --- */}
      {mode === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center space-y-6 max-w-md w-full">
             <div className="w-32 h-32 bg-zinc-900 dark:bg-zinc-50 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-zinc-900/20 dark:shadow-zinc-900/20 mb-8 transition-transform hover:scale-105 duration-300 cursor-pointer" onClick={() => setMode('scan')}>
                <Scan className="w-12 h-12 text-white dark:text-zinc-900" />
             </div>
             <div>
               <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">Point of Sale</h1>
               <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-lg">Ready to record a new transaction.</p>
             </div>
             
             <div className="grid gap-6 pt-8">
               <Button 
                 onClick={() => setMode('scan')} 
                 size="lg"
                 className="w-full h-16 text-lg rounded-2xl shadow-xl shadow-zinc-900/10 dark:shadow-none font-bold"
                 icon={Camera}
               >
                 Scan Product QR
               </Button>
               
               <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase font-semibold tracking-wider">
                    <span className="bg-[#fafafa] dark:bg-zinc-950 px-3 text-zinc-400">Manual Entry</span>
                  </div>
               </div>

               <div className="flex gap-3">
                 <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                    <input 
                      placeholder="Enter QR Token / SKU" 
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:outline-none transition-all shadow-sm"
                    />
                 </div>
                 <Button variant="secondary" className="px-6 rounded-xl font-bold" onClick={() => handleScanSuccess('manual-123')}>Go</Button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* --- SCANNER VIEW --- */}
      {mode === 'scan' && (
        <ScannerInterface 
          onCancel={() => setMode('idle')} 
          onDetected={handleScanSuccess}
        />
      )}

      {/* --- REVIEW VIEW --- */}
      {mode === 'review' && scannedData && (
        <POSReview 
          data={scannedData} 
          onBack={() => setMode('idle')}
          onConfirm={handleSaleComplete}
        />
      )}

      {/* --- SUCCESS VIEW --- */}
      {mode === 'success' && lastSale && (
        <SuccessView 
          sale={lastSale} 
          onNext={() => setMode('idle')}
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ScannerInterface: React.FC<{ onCancel: () => void; onDetected: (token: string) => void }> = ({ onCancel, onDetected }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
       {/* Header */}
       <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <span className="text-white font-medium text-lg flex items-center gap-2 drop-shadow-md">
            <Camera className="w-5 h-5" /> Scanner Active
          </span>
          <button onClick={onCancel} className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-md transition-colors">
             <X className="w-6 h-6" />
          </button>
       </div>

       {/* Camera Viewport */}
       <div className="flex-1 relative flex flex-col items-center justify-center">
           <div className="absolute inset-0 bg-zinc-900/90"></div>
           
           <div className="w-72 h-72 border-2 border-white/60 rounded-3xl relative overflow-hidden z-0">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)] animate-[scan_2s_ease-in-out_infinite]" />
           </div>
           
           <p className="text-white/80 mt-8 font-medium z-10 text-center px-4">Align the product QR code within the frame</p>
           
           <button 
             onClick={() => onDetected('simulated-qr-token-123')}
             className="mt-8 px-6 py-3 bg-zinc-800/80 backdrop-blur text-white text-sm font-semibold rounded-full hover:bg-zinc-700 border border-white/10 transition-all z-10"
           >
              [Tap to Simulate Successful Scan]
           </button>
       </div>
    </div>
  );
};

const POSReview: React.FC<{ data: any; onBack: () => void; onConfirm: (data: any) => void }> = ({ data, onBack, onConfirm }) => {
  const [form, setForm] = useState({
    price: data.basePrice,
    qty: 1,
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const total = form.price * form.qty;

  const handleSubmit = () => {
     if (!form.phone) {
       toast.error("Customer phone is required");
       return;
     }
     setLoading(true);
     setTimeout(() => {
        setLoading(false);
        onConfirm({ ...data, ...form, total });
     }, 1000);
  };

  return (
    <div className="animate-slide-in h-full flex flex-col pb-6">
       <div className="mb-6 flex items-center justify-between">
         <Button variant="ghost" onClick={onBack} size="sm" className="pl-0 hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
         </Button>
         <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Review Transaction</h2>
         <div className="w-16" /> {/* Spacer */}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex-1">
          {/* Left: Product Visuals */}
          <div className="flex flex-col">
             <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-3xl overflow-hidden relative shadow-inner mb-6 group">
                {data.image ? (
                   <img src={data.image} alt={data.product} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105" />
                ) : (
                   <div className="flex items-center justify-center h-full">
                      <ShoppingBag className="w-24 h-24 text-zinc-300 dark:text-zinc-600" />
                   </div>
                )}
                <div className="absolute top-4 left-4">
                   <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-zinc-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {data.brand}
                   </span>
                </div>
             </div>
             <div>
                <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight mb-2">{data.product}</h3>
                <div className="flex flex-wrap gap-2 text-sm">
                   <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 px-3 py-1">Size: {data.size}</Badge>
                   <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 px-3 py-1">Color: {data.color || 'N/A'}</Badge>
                </div>
             </div>
          </div>

          {/* Right: Transaction Inputs */}
          <Card className="flex flex-col h-fit p-6 lg:p-8 bg-white dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl">
             
             {/* Pricing Controls */}
             <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-end gap-4 mb-6">
                   <div className="flex-1">
                      <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Unit Price</label>
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
                           onClick={() => setForm(p => ({...p, qty: Math.max(1, p.qty - 1)}))}
                           className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                         >
                            <Minus className="w-4 h-4" />
                         </button>
                         <span className="w-8 text-center font-bold text-lg">{form.qty}</span>
                         <button 
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

             {/* Customer Inputs */}
             <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2 mb-2">
                   <User className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                   <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Customer Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <Input 
                      placeholder="Name" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900"
                   />
                   <Input 
                      placeholder="Phone (Required)" 
                      value={form.phone} 
                      onChange={e => setForm({...form, phone: e.target.value})}
                      className="bg-zinc-50 dark:bg-zinc-950 border-transparent focus:bg-white dark:focus:bg-zinc-900"
                      required
                   />
                </div>
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

             <div className="mt-auto">
                <Button onClick={handleSubmit} isLoading={loading} size="lg" className="w-full h-14 text-base shadow-xl shadow-zinc-900/20 dark:shadow-none rounded-xl font-bold">
                   Confirm Sale
                </Button>
             </div>
          </Card>
       </div>
    </div>
  );
};

const SuccessView: React.FC<{ sale: any; onNext: () => void }> = ({ sale, onNext }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendEmail = () => {
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       setEmailSent(true);
       toast.success(`Receipt sent to ${sale.brand}`);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-slide-in py-8">
       <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30">
          <CheckCircle className="w-12 h-12 text-white" />
       </div>
       
       <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">Sale Recorded!</h1>
       <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-center max-w-sm">
         Inventory updated. Don't forget to send the transaction confirmation to the brand.
       </p>

       <Card className="w-full max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl mb-8 overflow-hidden relative">
          {/* Ticket/Receipt decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#fafafa] dark:bg-zinc-950 rounded-full border border-zinc-200 dark:border-zinc-800" />
          
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Product</p>
                   <p className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">{sale.product}</p>
                   <p className="text-sm text-zinc-500">{sale.brand} • {sale.size}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Amount</p>
                   <p className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">₹{sale.total.toLocaleString()}</p>
                </div>
             </div>
             <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-100 dark:border-zinc-800">
                <User className="w-3 h-3" />
                <span>Customer: {sale.name || 'Walk-in'} ({sale.phone})</span>
             </div>
          </div>
          
          <div className="p-6">
             {!emailSent ? (
               <Button 
                 onClick={handleSendEmail} 
                 isLoading={loading} 
                 className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 py-3"
                 icon={Mail}
               >
                 Send Receipt to Brand
               </Button>
             ) : (
               <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5" /> Email Sent Successfully
               </div>
             )}
          </div>
       </Card>

       <Button variant="outline" onClick={onNext} className="min-w-[200px] border-zinc-300 dark:border-zinc-700">
          Record Next Sale
       </Button>
    </div>
  );
};