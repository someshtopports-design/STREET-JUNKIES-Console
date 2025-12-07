import React, { useState } from 'react';
import { Brand, BrandType } from '../types';
import { dbService } from '../services/dbService';
import { Plus, Building2, Mail, Phone, Percent, Trash2, Edit2, Check } from 'lucide-react';

interface BrandOnboardingProps {
  brands: Brand[];
  currentUser: string;
}

export const BrandOnboarding: React.FC<BrandOnboardingProps> = ({ brands, currentUser }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const startEdit = (brand: Brand) => {
    setFormData({
      name: brand.name,
      email: brand.contactEmail,
      phone: brand.contactPhone,
      type: brand.type,
      commissionRate: brand.commissionRate
    });
    setEditingId(brand.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete ${name}? This cannot be undone.`)) {
      try {
        await dbService.deleteBrand(id);
        await dbService.addLog('Deleted Brand', `Deleted brand: ${name} (ID: ${id})`, currentUser);
      } catch (error) {
        console.error("Error deleting brand:", error);
        alert("Failed to delete brand.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update Existing
        await dbService.updateBrand(editingId, {
          name: formData.name,
          contactEmail: formData.email,
          contactPhone: formData.phone,
          type: formData.type,
          commissionRate: Number(formData.commissionRate),
        });
        await dbService.addLog('Updated Brand', `Updated details for brand: ${formData.name}`, currentUser);
      } else {
        // Create New
        const newBrand: Brand = {
          id: `b${Date.now()}`,
          name: formData.name,
          contactEmail: formData.email,
          contactPhone: formData.phone,
          type: formData.type,
          commissionRate: Number(formData.commissionRate),
          joinedAt: new Date().toISOString(),
        };
        await dbService.addBrand(newBrand);
        await dbService.addLog('Onboarded Brand', `Added new brand: ${formData.name}`, currentUser);
      }

      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', type: BrandType.EXCLUSIVE, commissionRate: 15 });
    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Failed to save brand.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Brand Partners</h1>
          <p className="text-slate-500 mt-1">Manage relationships and commission structures.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', email: '', phone: '', type: BrandType.EXCLUSIVE, commissionRate: 15 });
            setIsFormOpen(!isFormOpen);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-slate-900/20 active:scale-95"
        >
          {isFormOpen ? 'Cancel' : <><Plus size={20} /> Onboard Brand</>}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-heading font-bold mb-6 text-slate-900 border-b border-slate-100 pb-4">
            {editingId ? 'Edit Partner Details' : 'New Partner Details'}
          </h2>
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
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                {editingId ? <Check size={20} /> : <Plus size={20} />}
                {editingId ? 'Update Partner' : 'Save Partner'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {brands.map(brand => (
          <div key={brand.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative">

            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startEdit(brand)}
                className="p-2 bg-white border border-slate-200 text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
                title="Edit Brand"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(brand.id, brand.name)}
                className="p-2 bg-white border border-slate-200 text-red-500 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                title="Delete Brand"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Building2 size={28} strokeWidth={1.5} />
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${brand.type === BrandType.EXCLUSIVE
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
        {brands.length === 0 && !isFormOpen && (
          <div className="col-span-full py-16 text-center text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Building2 size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium">No brands onboarded yet.</p>
            <button onClick={() => setIsFormOpen(true)} className="text-indigo-600 font-bold hover:underline mt-2">Add your first brand</button>
          </div>
        )}
      </div>
    </div>
  );
};
