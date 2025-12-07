import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { FileText, Download, Send, Eye, Calendar, Mail, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const MOCK_INVOICES = [
  { id: 'INV-001', brand: 'Nike', period: 'May 2024', total: 145000, commission: 21750, payout: 123250, status: 'sent', date: '2024-06-01' },
  { id: 'INV-002', brand: 'Adidas', period: 'May 2024', total: 98000, commission: 11760, payout: 86240, status: 'pending', date: '-' },
  { id: 'INV-003', brand: 'Puma', period: 'May 2024', total: 56000, commission: 6720, payout: 49280, status: 'sent', date: '2024-06-01' },
  { id: 'INV-004', brand: 'New Balance', period: 'April 2024', total: 112000, commission: 20160, payout: 91840, status: 'sent', date: '2024-05-01' },
];

const MOCK_SALES_HISTORY = [
  { id: 1, date: '2024-05-12 14:30', brand: 'Nike', product: 'Dunk Low', size: 'UK 8', price: 10999, commission: 1649, payout: 9350, customer: 'Amit K.', sent: true },
  { id: 2, date: '2024-05-12 16:15', brand: 'Adidas', product: 'Samba', size: 'UK 9', price: 8999, commission: 1079, payout: 7920, customer: 'Rahul S.', sent: false },
  { id: 3, date: '2024-05-11 11:00', brand: 'Puma', product: 'Suede', size: 'UK 7', price: 5999, commission: 719, payout: 5280, customer: 'Sneha M.', sent: true },
  { id: 4, date: '2024-05-11 09:30', brand: 'Nike', product: 'Air Force 1', size: 'UK 10', price: 8999, commission: 1349, payout: 7650, customer: 'John D.', sent: true },
];

export const Invoices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'transactions'>('invoices');
  const [selectedMonth, setSelectedMonth] = useState('may-2024');

  const handleGenerate = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Generating invoices...',
        success: 'Invoices generated successfully!',
        error: 'Error generating invoices.',
      }
    );
  };

  const handleResend = (brand: string) => {
    toast.success(`Invoice sent to ${brand}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Records & Finance</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">View transaction history and manage monthly payouts.</p>
         </div>
         <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <button 
              onClick={() => setActiveTab('invoices')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'invoices' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              Monthly Statements
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'transactions' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              All Transactions
            </button>
         </div>
      </div>

      {/* --- INVOICES TAB --- */}
      {activeTab === 'invoices' && (
        <div className="space-y-6 animate-slide-in">
           {/* Filters & Actions */}
           <Card className="flex flex-col sm:flex-row justify-between items-center gap-4" noPadding>
              <div className="p-4 flex items-center gap-3 w-full sm:w-auto">
                 <div className="relative flex-1 sm:w-48">
                   <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                   <select 
                     className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 appearance-none"
                     value={selectedMonth}
                     onChange={(e) => setSelectedMonth(e.target.value)}
                   >
                     <option value="may-2024">May 2024</option>
                     <option value="apr-2024">April 2024</option>
                     <option value="mar-2024">March 2024</option>
                   </select>
                 </div>
                 <Button onClick={handleGenerate} icon={FileText} className="whitespace-nowrap">Generate New</Button>
              </div>
              <div className="flex gap-4 px-6 sm:border-l border-zinc-100 dark:border-zinc-800 py-4 w-full sm:w-auto overflow-x-auto">
                 <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Total Payout</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">₹3,50,610</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Commission</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₹60,390</p>
                 </div>
              </div>
           </Card>

           {/* Table */}
           <Card className="overflow-hidden" noPadding>
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-800">
                 <thead className="bg-zinc-50/50 dark:bg-zinc-800/50">
                   <tr>
                     <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Invoice ID</th>
                     <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Brand</th>
                     <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Period</th>
                     <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Sales</th>
                     <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Payout</th>
                     <th className="px-6 py-4 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                     <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                   {MOCK_INVOICES.map((inv) => (
                     <tr key={inv.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                       <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-zinc-400 dark:text-zinc-500">{inv.id}</td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                           <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300 mr-3">
                             {inv.brand.substring(0, 2).toUpperCase()}
                           </div>
                           <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{inv.brand}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">{inv.period}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">₹{inv.total.toLocaleString()}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-zinc-900 dark:text-zinc-100">₹{inv.payout.toLocaleString()}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-center">
                         <Badge variant={inv.status === 'sent' ? 'success' : 'warning'}>
                           {inv.status === 'sent' ? 'Sent' : 'Pending'}
                         </Badge>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors" title="View Details">
                             <Eye className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => handleResend(inv.brand)} 
                             className="p-1.5 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors" 
                             title="Resend Email"
                           >
                             <Send className="w-4 h-4" />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </Card>
        </div>
      )}

      {/* --- TRANSACTIONS TAB --- */}
      {activeTab === 'transactions' && (
        <div className="space-y-6 animate-slide-in">
           {/* Filters */}
           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                 <input placeholder="Search customer, brand or product..." className="w-full pl-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100" />
              </div>
              <div className="flex gap-2">
                 <input type="date" className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100" />
                 <Button variant="outline" icon={Download}>Export CSV</Button>
              </div>
           </div>

           {/* Sales Table */}
           <Card className="overflow-hidden" noPadding>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Brand</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Customer</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {MOCK_SALES_HISTORY.map((sale) => (
                    <tr key={sale.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">{sale.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{sale.product}</div>
                        <div className="text-xs text-zinc-400">{sale.size}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">{sale.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">{sale.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-zinc-900 dark:text-zinc-100">₹{sale.price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                         <button className={`p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 ${sale.sent ? 'text-emerald-500 dark:text-emerald-400' : 'text-zinc-300 dark:text-zinc-600'}`}>
                            <Mail className="w-4 h-4" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};