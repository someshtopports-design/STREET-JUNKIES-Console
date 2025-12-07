import React from 'react';
import { Card, Badge } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingCart, ArrowUpRight } from 'lucide-react';

const mockData = [
  { name: 'Nike', sales: 4000 },
  { name: 'Adidas', sales: 3000 },
  { name: 'Puma', sales: 2000 },
  { name: 'NB', sales: 2780 },
  { name: 'Reebok', sales: 1890 },
  { name: 'Asics', sales: 2390 },
  { name: 'Crocs', sales: 3490 },
];

const StatCard: React.FC<{ title: string; value: string; icon: any; trend?: string; trendUp?: boolean }> = ({ title, value, icon: Icon, trend, trendUp }) => (
  <Card className="flex flex-col justify-between h-full hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
    <div className="flex items-start justify-between">
      <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-700">
        <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
      </div>
      {trend && (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${trendUp ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
          {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
          {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{value}</h3>
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">{title}</p>
    </div>
  </Card>
);

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Sales (May)" value="₹12,45,000" icon={DollarSign} trend="12.5%" trendUp={true} />
        <StatCard title="Total Payout" value="₹8,90,000" icon={ShoppingCart} trend="4.3%" trendUp={true} />
        <StatCard title="Commission Earned" value="₹1,24,500" icon={ArrowUpRight} trend="5.1%" trendUp={true} />
        <StatCard title="Active Brands" value="24" icon={Users} />
      </div>

      {/* Charts & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Brand Performance</h3>
               <p className="text-sm text-zinc-500 dark:text-zinc-400">Sales breakdown by brand for this month.</p>
             </div>
             <select className="text-xs border-zinc-200 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 px-2 py-1">
               <option>Last 30 Days</option>
             </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" strokeOpacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₹${value/1000}k`} 
                />
                <Tooltip 
                  cursor={{fill: 'rgba(161, 161, 170, 0.1)', radius: 4}} 
                  contentStyle={{
                    borderRadius: '8px', 
                    border: '1px solid #3f3f46', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    backgroundColor: '#18181b',
                    color: '#fafafa'
                  }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Recent Sales</h3>
             <button className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300">View All</button>
          </div>
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="group flex items-center justify-between p-3 -mx-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-semibold text-xs mr-3">
                    NK
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Nike Air Max 90</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wide">UK 9 • Delhi</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">₹12,999</p>
                  <p className="text-[10px] text-zinc-400">2m ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};