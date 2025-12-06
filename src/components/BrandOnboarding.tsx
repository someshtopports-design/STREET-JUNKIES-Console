import React, { useState } from 'react';
import { Brand, BrandType } from '../types';
import { dbService } from '../services/dbService'; // Using Firebase Service
import { Plus, Building2, Mail, Phone, Percent, Trash2, Edit2, Check } from 'lucide-react';

interface BrandOnboardingProps {
  brands: Brand[];
  currentUser: string;
}

export const BrandOnboarding: React.FC<BrandOnboardingProps> = ({ brands, currentUser }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', type: BrandType.EXCLUSIVE, commissionRate: 15 });

  const handleTypeChange = (type: BrandType) => setFormData({ ...formData, type, commissionRate: type === BrandType.EXCLUSIVE ? 15 : 25 });

  const startEdit = (brand: Brand) => {
    setFormData({ name: brand.name, email: brand.contactEmail, phone: brand.contactPhone, type: brand.type, commissionRate: brand.commissionRate });
    setEditingId(brand.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete ${name}?`)) {
      await dbService.deleteBrand(id);
      await dbService.addLog('Deleted Brand', `Deleted ${name}`, currentUser);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await dbService.updateBrand(editingId, { name: formData.name, contactEmail: formData.email, contactPhone: formData.phone, type: formData.type, commissionRate: Number(formData.commissionRate) });
      await dbService.addLog('Updated Brand', `Updated ${formData.name}`, currentUser);
    } else {
      const newBrand = { id: `b${Date.now()}`, name: formData.name, contactEmail: formData.email, contactPhone: formData.phone, type: formData.type, commissionRate: Number(formData.commissionRate), joinedAt: new Date().toISOString() };
      await dbService.addBrand(newBrand);
      await dbService.addLog('Onboarded Brand', `Added ${formData.name}`, currentUser);
    }
    setIsFormOpen(false); setEditingId(null); setFormData({ name: '', email: '', phone: '', type: BrandType.EXCLUSIVE, commissionRate: 15 });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div><h1 className="text-3xl font-heading font-bold text-slate-900">Brand Partners</h1><p className="text-slate-500 mt-1">Manage relationships.</p></div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg">{isFormOpen ? 'Cancel' : <><Plus size={20} /> Onboard Brand</>}</button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in slide-in-from-top-4">
          <h2 className="text-xl font-heading font-bold mb-6 text-slate-900">{editingId ? 'Edit Partner' : 'New Partner'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Brand Name</label><input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Email</label><input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Phone</label><input required type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
            </div>
            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Partnership Type</label><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => handleTypeChange(BrandType.EXCLUSIVE)} className={`py-3 rounded-xl text-sm font-bold border ${formData.type === BrandType.EXCLUSIVE ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Exclusive</button><button type="button" onClick={() => handleTypeChange(BrandType.NON_EXCLUSIVE)} className={`py-3 rounded-xl text-sm font-bold border ${formData.type === BrandType.NON_EXCLUSIVE ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Non-Exclusive</button></div></div>
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Commission Rate (%)</label><input required type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold" value={formData.commissionRate} onChange={e => setFormData({ ...formData, commissionRate: Number(e.target.value) })} /></div>
            </div>
            <div className="md:col-span-2 flex justify-end pt-4"><button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2">{editingId ? <Check size={20} /> : <Plus size={20} />} {editingId ? 'Update' : 'Save'}</button></div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {brands.map(brand => (
          <div key={brand.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 group relative">
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(brand)} className="p-2 bg-white text-indigo-600 rounded-full border border-slate-200 hover:bg-indigo-50"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(brand.id, brand.name)} className="p-2 bg-white text-red-500 rounded-full border border-slate-200 hover:bg-red-50"><Trash2 size={16} /></button>
            </div>
            <div className="flex justify-between items-start mb-6"><div className="p-4 bg-slate-50 rounded-2xl text-slate-700"><Building2 size={28} /></div><span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase border bg-slate-50 text-slate-600">{brand.type}</span></div>
            <h3 className="text-2xl font-heading font-bold text-slate-900 mb-1">{brand.name}</h3>
            <p className="text-slate-500 text-sm mb-6">Commission: {brand.commissionRate}%</p>
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-600 text-sm"><Mail size={14} />{brand.contactEmail}</div>
              <div className="flex items-center gap-3 text-slate-600 text-sm"><Phone size={14} />{brand.contactPhone}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
