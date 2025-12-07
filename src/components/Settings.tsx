import React, { useState } from 'react';
import { StoreProfile } from '../types';
import { dbService } from '../services/dbService';
import { Save, Building2, MapPin, Phone, Mail, FileText } from 'lucide-react';

interface SettingsProps {
  profile: StoreProfile;
  currentUser: string;
}

export const Settings: React.FC<SettingsProps> = ({ profile, currentUser }) => {
  const [formData, setFormData] = useState<StoreProfile>(profile);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dbService.updateStoreProfile(formData);
    await dbService.addLog('Updated Store Settings', 'Modified store contact or billing details', currentUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Store Settings</h1>
          <p className="text-slate-500 mt-1">Manage store profile and billing details used in invoices.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Building2 size={16}/> Store Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><FileText size={16}/> GST / Tax ID</label>
              <input
                type="text"
                required
                value={formData.gst}
                onChange={e => setFormData({ ...formData, gst: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Phone size={16}/> Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Mail size={16}/> Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin size={16}/> Address</label>
              <textarea
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
             <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2 active:scale-95"
            >
              <Save size={18} /> Save Settings
            </button>
            {saved && (
                <span className="text-emerald-600 font-bold animate-in fade-in">Saved Successfully!</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
