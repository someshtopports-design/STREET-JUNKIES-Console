import React, { useState } from 'react';
import { Sale, Brand, SaleItem } from '../types';
import { generateSettlementEmail } from '../services/geminiService';
import { FileText, Download, Mail, Send, Table, X } from 'lucide-react';

interface ReportsProps {
  sales: Sale[];
  brands: Brand[];
}

export const Reports: React.FC<ReportsProps> = ({ sales, brands }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [emailDraft, setEmailDraft] = useState<string>('');
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [draftingFor, setDraftingFor] = useState<string | null>(null);

  // Calculate stats per brand
  const brandStats = brands.map(brand => {
    let totalSales = 0;
    let storeCommission = 0;
    let netPayable = 0;
    let itemsSold = 0;
    const soldItems: SaleItem[] = [];

    sales.forEach(sale => {
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

  const filteredStats = selectedBrand === 'all' 
    ? brandStats 
    : brandStats.filter(s => s.brand.id === selectedBrand);

  const handleDraftEmail = async (stat: typeof brandStats[0]) => {
    setDraftingFor(stat.brand.id);
    setLoadingDraft(true);
    const draft = await generateSettlementEmail(
      stat.brand.name,
      stat.totalSales,
      stat.storeCommission,
      stat.netPayable,
      new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      stat.soldItems,
      stat.brand.commissionRate
    );
    setEmailDraft(draft);
    setLoadingDraft(false);
  };

  const downloadFullReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Sale ID,Date,Customer Name,Customer Phone,Brand,Product,Size,Qty,Unit Price,Total,Store Comm.,Net Brand Payout\n";

    sales.forEach(sale => {
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
    link.setAttribute("download", "street_junkies_sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Settlements</h1>
          <p className="text-slate-500 mt-1">Monthly payouts and automated brand reports.</p>
        </div>
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
                  <th className="px-6 py-4 text-right font-semibold">Items</th>
                  <th className="px-6 py-4 text-right font-semibold">Total Sales</th>
                  <th className="px-6 py-4 text-right font-semibold">Store Comm.</th>
                  <th className="px-6 py-4 text-right font-semibold">Net Payout</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Drafter Section - Modal Style */}
        {emailDraft && (
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
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
              <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-heading font-bold text-slate-800 text-lg">Generating Invoice...</p>
                  <p className="text-slate-500 text-sm">Drafting bill for {filteredStats.find(s => s.brand.id === draftingFor)?.brand.name}...</p>
              </div>
          </div>
      )}
    </div>
  );
};