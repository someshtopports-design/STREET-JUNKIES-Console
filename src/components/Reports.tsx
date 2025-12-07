import React, { useState } from 'react';
import { Sale, Brand, SaleItem, StoreProfile } from '../types';
import { generateSettlementEmail } from '../services/geminiService';
import { FileText, Download, Mail, Send, Table, X, Calendar } from 'lucide-react';

interface ReportsProps {
  sales: Sale[];
  brands: Brand[];
  storeProfile: StoreProfile;
}

export const Reports: React.FC<ReportsProps> = ({ sales, brands, storeProfile }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [emailDraft, setEmailDraft] = useState<string>('');
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [draftingFor, setDraftingFor] = useState<string | null>(null);

  // Date Filter State
  const [dateFilterType, setDateFilterType] = useState<'all' | 'month' | 'custom'>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Filter Sales based on Date
  const getFilteredSales = () => {
    return sales.filter(sale => {
       const saleDate = new Date(sale.timestamp);
       
       if (dateFilterType === 'month') {
          return sale.timestamp.startsWith(selectedMonth);
       } 
       if (dateFilterType === 'custom' && customStart && customEnd) {
          const start = new Date(customStart);
          const end = new Date(customEnd);
          end.setHours(23, 59, 59); // End of day
          return saleDate >= start && saleDate <= end;
       }
       return true; // 'all'
    });
  };

  const filteredSales = getFilteredSales();

  // Calculate stats per brand based on filtered sales
  const brandStats = brands.map(brand => {
    let totalSales = 0;
    let storeCommission = 0;
    let netPayable = 0;
    let itemsSold = 0;
    const soldItems: SaleItem[] = [];

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (item.brandId === brand.id) {
          totalSales += (item.sellingPrice * item.quantity);
          storeCommission += item.commission;
          netPayable += item.brandRevenue;
          itemsSold += item.quantity;
          soldItems.push(item);
        }
      });
    });

    return {
      brand,
      totalSales,
      storeCommission,
      netPayable,
      itemsSold,
      soldItems
    };
  });

<<<<<<< HEAD
<<<<<<<< HEAD:src/components/Reports.tsx
  const filteredStats = selectedBrand === 'all'
    ? brandStats
========
  const displayStats = selectedBrand === 'all' 
    ? brandStats 
>>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f:components/Reports.tsx
=======
  const displayStats = selectedBrand === 'all' 
    ? brandStats 
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
    : brandStats.filter(s => s.brand.id === selectedBrand);

  const handleDraftEmail = async (stat: typeof brandStats[0]) => {
    if (stat.itemsSold === 0) {
        alert("No sales for this period to generate invoice.");
        return;
    }
    setDraftingFor(stat.brand.id);
    setLoadingDraft(true);
    
<<<<<<< HEAD
    // Determine date string for invoice
=======
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
    let dateStr = new Date().toLocaleDateString();
    if (dateFilterType === 'month') {
        const [y, m] = selectedMonth.split('-');
        dateStr = new Date(parseInt(y), parseInt(m)-1).toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    const draft = await generateSettlementEmail(
      stat.brand.name,
      stat.totalSales,
      stat.storeCommission,
      stat.netPayable,
      dateStr,
      stat.soldItems,
      stat.brand.commissionRate,
      storeProfile
    );
    setEmailDraft(draft);
    setLoadingDraft(false);
  };

<<<<<<< HEAD
=======
  const sendEmail = () => {
      const brand = brands.find(b => b.id === draftingFor);
      if (!brand) return;

      const subject = `Invoice / Settlement Statement - ${brand.name}`;
      const body = encodeURIComponent(emailDraft);
      const recipient = brand.contactEmail;
      
      // Open default mail client
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
  const downloadFullReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Sale ID,Date,Customer Name,Customer Phone,Brand,Product,Size,Qty,Unit Price,Total,Store Comm.,Net Brand Payout\n";

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const row = [
          sale.id,
          new Date(sale.timestamp).toLocaleDateString(),
          `"${sale.customerName || ''}"`,
          `"${sale.customerPhone || ''}"`,
          `"${item.brandName}"`,
          `"${item.productName}"`,
          item.size,
          item.quantity,
          item.sellingPrice.toFixed(2),
          (item.sellingPrice * item.quantity).toFixed(2),
          item.commission.toFixed(2),
          item.brandRevenue.toFixed(2)
        ].join(",");
        csvContent += row + "\n";
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateLabel = dateFilterType === 'month' ? selectedMonth : 'full';
    link.setAttribute("download", `street_junkies_sales_report_${dateLabel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
<<<<<<< HEAD
=======
      {/* Header and Filter sections remain similar, omitted for brevity, logic below */}
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Settlements</h1>
          <p className="text-slate-500 mt-1">Monthly payouts and automated brand reports.</p>
        </div>
<<<<<<< HEAD
<<<<<<<< HEAD:src/components/Reports.tsx
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex-1 sm:flex-none">
            <span className="text-xs text-slate-400 font-bold uppercase">Filter:</span>
            <select
              className="bg-transparent border-none text-sm font-bold focus:ring-0 text-slate-700 py-1 outline-none w-full"
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
            >
              <option value="all">All Brands</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <button
            onClick={downloadFullReport}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex-1 sm:flex-none"
          >
            <Table size={18} /> Export Excel
          </button>
========
        
=======
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-end">
             {/* Date Filters */}
             <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2">
                 <select 
                    className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-2 px-3 rounded-lg outline-none"
                    value={dateFilterType}
                    onChange={(e) => setDateFilterType(e.target.value as any)}
                 >
                     <option value="all">All Time</option>
                     <option value="month">Monthly</option>
                     <option value="custom">Custom Range</option>
                 </select>
<<<<<<< HEAD

=======
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
                 {dateFilterType === 'month' && (
                     <input 
                        type="month" 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-2 px-3 rounded-lg outline-none"
                     />
                 )}
<<<<<<< HEAD

=======
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
                 {dateFilterType === 'custom' && (
                     <div className="flex gap-2">
                        <input 
                            type="date" 
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-2 px-3 rounded-lg outline-none"
                        />
                        <span className="self-center text-slate-400">-</span>
                        <input 
                            type="date" 
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-2 px-3 rounded-lg outline-none"
                        />
                     </div>
                 )}
             </div>
<<<<<<< HEAD

=======
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
             <div className="flex items-center gap-2 bg-white px-3 py-3 rounded-xl border border-slate-200 shadow-sm">
               <span className="text-xs text-slate-400 font-bold uppercase">Brand:</span>
               <select 
                 className="bg-transparent border-none text-sm font-bold focus:ring-0 text-slate-700 outline-none w-32"
                 value={selectedBrand}
                 onChange={e => setSelectedBrand(e.target.value)}
               >
                 <option value="all">All Brands</option>
                 {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
               </select>
            </div>
<<<<<<< HEAD
             <button 
                onClick={downloadFullReport}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
             >
                <Table size={18} /> Export Excel
             </button>
>>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f:components/Reports.tsx
=======
             <button onClick={downloadFullReport} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"><Table size={18} /> Export Excel</button>
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Table Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold">Brand</th>
                  <th className="px-6 py-4 text-right font-semibold">Items Sold</th>
                  <th className="px-6 py-4 text-right font-semibold">Total Sales</th>
                  <th className="px-6 py-4 text-right font-semibold">Store Comm.</th>
                  <th className="px-6 py-4 text-right font-semibold">Net Payout</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
<<<<<<< HEAD
<<<<<<<< HEAD:src/components/Reports.tsx
                {filteredStats.map((stat) => (
                  <tr key={stat.brand.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900 text-base">{stat.brand.name}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{stat.itemsSold}</td>
                    <td className="px-6 py-4 text-right font-mono font-medium">₹{stat.totalSales.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono text-emerald-600 bg-emerald-50/30">+₹{stat.storeCommission.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 text-base">₹{stat.netPayable.toFixed(2)}</td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleDraftEmail(stat)}
                        className="flex items-center gap-2 px-3 py-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all font-medium text-xs bg-indigo-50"
                      >
                        <Mail size={16} /> Draft Invoice
                      </button>
                    </td>
                  </tr>
                ))}
========
=======
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
                {displayStats.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-400">No data found for selected period.</td></tr>
                ) : (
                    displayStats.map((stat) => (
                    <tr key={stat.brand.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-slate-900 text-base">{stat.brand.name}</td>
                        <td className="px-6 py-4 text-right text-slate-600">{stat.itemsSold}</td>
                        <td className="px-6 py-4 text-right font-mono font-medium">₹{stat.totalSales.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-mono text-emerald-600 bg-emerald-50/30">+₹{stat.storeCommission.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 text-base">₹{stat.netPayable.toFixed(2)}</td>
                        <td className="px-6 py-4 flex justify-center gap-2">
                        <button 
                            onClick={() => handleDraftEmail(stat)}
                            disabled={stat.itemsSold === 0}
<<<<<<< HEAD
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium text-xs ${
                                stat.itemsSold === 0 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'text-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-50'
                            }`}
=======
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium text-xs ${stat.itemsSold === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-50'}`}
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
                        >
                            <Mail size={16} /> Draft Invoice
                        </button>
                        </td>
                    </tr>
                    ))
                )}
<<<<<<< HEAD
>>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f:components/Reports.tsx
=======
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Drafter Section - Modal Style */}
        {emailDraft && (
<<<<<<< HEAD
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-900">System Invoice</h3>
                    <p className="text-xs text-slate-500">AI Generated • {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => setEmailDraft('')} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 p-0 overflow-hidden relative">
                <textarea
                  className="w-full h-[500px] p-6 border-0 focus:ring-0 outline-none font-mono text-sm leading-relaxed text-slate-700 resize-none bg-white whitespace-pre"
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                />
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setEmailDraft('')} className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-colors">Discard</button>
                <button
                  onClick={() => alert("Invoice sent to brand contact!")}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  <Send size={18} /> Send Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loadingDraft && (
<<<<<<<< HEAD:src/components/Reports.tsx
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-heading font-bold text-slate-800 text-lg">Generating Invoice...</p>
            <p className="text-slate-500 text-sm">Drafting bill for {filteredStats.find(s => s.brand.id === draftingFor)?.brand.name}...</p>
========
=======
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Mail size={20} /></div>
                            <div>
                                <h3 className="font-heading font-bold text-slate-900">System Invoice</h3>
                                <p className="text-xs text-slate-500">AI Generated • {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button onClick={() => setEmailDraft('')} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><X size={20} /></button>
                    </div>
                    
                    <div className="flex-1 p-0 overflow-hidden relative">
                         <textarea 
                            className="w-full h-[500px] p-6 border-0 focus:ring-0 outline-none font-mono text-sm leading-relaxed text-slate-700 resize-none bg-white whitespace-pre"
                            value={emailDraft}
                            onChange={(e) => setEmailDraft(e.target.value)}
                        />
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        <button onClick={() => setEmailDraft('')} className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-colors">Discard</button>
                        <button 
                            onClick={sendEmail} 
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            <Send size={18} /> Open in Mail App
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
      
      {loadingDraft && (
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
              <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-heading font-bold text-slate-800 text-lg">Generating Invoice...</p>
                  <p className="text-slate-500 text-sm">Drafting bill for {displayStats.find(s => s.brand.id === draftingFor)?.brand.name}...</p>
              </div>
<<<<<<< HEAD
>>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f:components/Reports.tsx
          </div>
        </div>
      )}
    </div>
  );
};
=======
          </div>
      )}
    </div>
  );
};
>>>>>>> 04f0fd73baa47f62bd07cc7dc0628b06b7022b7f
