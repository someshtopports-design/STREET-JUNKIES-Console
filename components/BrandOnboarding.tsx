import React, { useState } from 'react';
import { Brand, BrandType } from '../types';
import { Plus, Building2, Mail, Phone, Percent } from 'lucide-react';

interface BrandOnboardingProps {
  brands: Brand[];
  setBrands: (brands: Brand[]) => void;
}

export const BrandOnboarding: React.FC<BrandOnboardingProps> = ({ brands, setBrands }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: BrandType.EXCLUSIVE,
    commissionRate: 15,
  });

  const handleTypeChange = (type: BrandType) => {
    setFormData({
      ...formData,
      type,
      commissionRate: type === BrandType.EXCLUSIVE ? 15 : 25
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBrand: Brand = {
      id: `b${Date.now()}`,
      name: formData.name,
      contactEmail: formData.email,
      contactPhone: formData.phone,
      type: formData.type,
      commissionRate: Number(formData.commissionRate),
      joinedAt: new Date().toISOString(),
    };
    setBrands([...brands, newBrand]);
    setIsAdding(false);
    setFormData({ name: '', email: '', phone: '', type: BrandType.EXCLUSIVE, commissionRate: 15 });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Brand Partners</h1>
          <p className="text-slate-500 mt-1">Manage relationships and commission structures.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-slate-900/20 active:scale-95"
        >
          {isAdding ? 'Cancel' : <><Plus size={20} /> Onboard Brand</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-heading font-bold mb-6 text-slate-900 border-b border-slate-100 pb-4">New Partner Details</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Brand Name</label>
                <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Urban Threadz"
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Contact Email</label>
                <input
                    required
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@brand.com"
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Contact Phone</label>
                <input
                    required
                    type="tel"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                />
                </div>
            </div>
            
            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-heading font-bold text-slate-800">Contract Terms</h3>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Partnership Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handleTypeChange(BrandType.EXCLUSIVE)}
                            className={`py-3 rounded-xl text-sm font-bold border transition-all ${formData.type === BrandType.EXCLUSIVE ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                        >
                            Exclusive
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange(BrandType.NON_EXCLUSIVE)}
                            className={`py-3 rounded-xl text-sm font-bold border transition-all ${formData.type === BrandType.NON_EXCLUSIVE ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                        >
                            Non-Exclusive
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Commission Rate (%)</label>
                    <div className="relative">
                        <input
                            required
                            type="number"
                            min="0"
                            max="100"
                            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg text-slate-900"
                            value={formData.commissionRate}
                            onChange={e => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 flex justify-end pt-4">
              <button
                type="submit"
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200"
              >
                Save Partner
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {brands.map(brand => (
          <div key={brand.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Building2 size={28} strokeWidth={1.5} />
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                brand.type === BrandType.EXCLUSIVE 
                  ? 'bg-violet-50 text-violet-700 border-violet-100' 
                  : 'bg-blue-50 text-blue-700 border-blue-100'
              }`}>
                {brand.type === BrandType.EXCLUSIVE ? 'Exclusive' : 'Standard'}
              </span>
            </div>
            
            <h3 className="text-2xl font-heading font-bold text-slate-900 mb-1">{brand.name}</h3>
            <p className="text-slate-500 text-sm mb-6">Partner since {new Date(brand.joinedAt).getFullYear()}</p>
            
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={14} /></div>
                {brand.contactEmail}
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={14} /></div>
                {brand.contactPhone}
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl mt-2">
                 <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600"><Percent size={14} /></div>
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase">Commission</span>
                    <span className="font-heading font-bold text-slate-900">{brand.commissionRate}%</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};