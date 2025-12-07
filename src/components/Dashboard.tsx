import React, { useState } from 'react';
import { Product, Sale, Brand } from '../types';
import { generateDashboardInsights } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Package, Sparkles, Loader2, IndianRupee, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  brands: Brand[];
}

export const Dashboard: React.FC<DashboardProps> = ({ products, sales, brands }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // KPI Calculations
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.items.reduce((acc, item) => acc + item.quantity, 0), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  // Chart Data Preparation
  const salesByBrand = brands.map(brand => {
    const brandSales = sales.reduce((acc, sale) => {
      const brandItems = sale.items.filter(item => item.brandId === brand.id);
      return acc + brandItems.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
    }, 0);
    return { name: brand.name, sales: brandSales };
  });

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    const result = await generateDashboardInsights(products, sales, brands);
    setInsight(result);
    setLoadingInsight(false);
  };

  const KPICard = ({ title, value, icon: Icon, colorClass, bgClass, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-slate-200 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} /> +12%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-heading font-bold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Store performance overview & analytics</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Store Open • {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          bgClass="bg-emerald-50"
          colorClass="text-emerald-600"
          trend={true}
        />
        <KPICard
          title="Items Sold"
          value={totalItemsSold}
          icon={TrendingUp}
          bgClass="bg-blue-50"
          colorClass="text-blue-600"
        />
        <KPICard
          title="Active Brands"
          value={brands.length}
          icon={Package}
          bgClass="bg-violet-50"
          colorClass="text-violet-600"
        />
        <KPICard
          title="Low Stock"
          value={lowStockCount}
          icon={AlertTriangle}
          bgClass={lowStockCount > 0 ? "bg-amber-50" : "bg-slate-50"}
          colorClass={lowStockCount > 0 ? "text-amber-600" : "text-slate-400"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-heading font-bold text-slate-900">Revenue by Brand</h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View Report <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByBrand}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} dx={-10} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '0.25rem' }}
                />
                <Bar
                  dataKey="sales"
                  fill="url(#colorGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={48}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Section - Cyberpunk/Premium Look */}
        <div className="bg-slate-900 p-1 rounded-3xl shadow-2xl shadow-indigo-500/10">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-[22px] p-6 h-full flex flex-col relative overflow-hidden border border-slate-700/50">
            {/* Abstract Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none"></div>

            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Sparkles className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">Smart Analyst</h3>
                  <p className="text-xs text-indigo-300">Powered by Gemini AI</p>
                </div>
              </div>

              <div className="flex-1 bg-slate-950/50 rounded-xl p-5 mb-6 border border-slate-800 backdrop-blur-md overflow-y-auto max-h-[300px]">
                {insight ? (
                  <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-medium">
                    {insight}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <p className="text-slate-400 text-sm italic mb-2">"I analyze your data to find trends and missed opportunities."</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerateInsight}
                disabled={loadingInsight}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95"
              >
                {loadingInsight ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
                Generate Daily Insight
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};