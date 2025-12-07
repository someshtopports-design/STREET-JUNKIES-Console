import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { Plus, Search, Edit2, Filter, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data
const MOCK_BRANDS = [
  { id: '1', name: 'Nike', email: 'contact@nike.com', phone: '9876543210', type: 'exclusive', commission: 15, active: true },
  { id: '2', name: 'Adidas', email: 'sales@adidas.com', phone: '9876543211', type: 'non-exclusive', commission: 12, active: true },
  { id: '3', name: 'Puma', email: 'india@puma.com', phone: '9876543212', type: 'non-exclusive', commission: 12, active: false },
  { id: '4', name: 'New Balance', email: 'nb@india.com', phone: '9876543213', type: 'exclusive', commission: 18, active: true },
];

export const Brands: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {!isFormOpen ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input 
                placeholder="Search brands..." 
                className="pl-9 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
               <Button variant="outline" icon={Filter} className="hidden sm:flex">Filter</Button>
               <Button onClick={() => { setEditingBrand(null); setIsFormOpen(true); }} icon={Plus} className="w-full sm:w-auto">Add Brand</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_BRANDS.map(brand => (
              <Card key={brand.id} className="flex flex-col group hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm">
                      {brand.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{brand.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={brand.type === 'exclusive' ? 'warning' : 'outline'}>
                            {brand.type === 'exclusive' ? 'Exclusive' : 'Standard'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${brand.active ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                </div>
                
                <div className="text-sm space-y-3 flex-1 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
                  <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                    <Mail className="w-4 h-4 mr-2 text-zinc-400 dark:text-zinc-500" /> {brand.email}
                  </div>
                  <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                    <Phone className="w-4 h-4 mr-2 text-zinc-400 dark:text-zinc-500" /> {brand.phone}
                  </div>
                  <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-2 rounded-lg mt-2">
                     <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Commission</span>
                     <span className="font-bold text-zinc-900 dark:text-zinc-100">{brand.commission}%</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditingBrand(brand); setIsFormOpen(true); }} className="w-full" icon={Edit2}>
                    Manage
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <BrandForm 
          initialData={editingBrand} 
          onCancel={() => setIsFormOpen(false)} 
          onSave={() => { setIsFormOpen(false); toast.success('Brand saved successfully'); }} 
        />
      )}
    </div>
  );
};

const BrandForm: React.FC<{ initialData?: any; onCancel: () => void; onSave: () => void }> = ({ initialData, onCancel, onSave }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{initialData ? 'Edit Brand' : 'Onboard Brand'}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage partnership details and commission rates.</p>
        </div>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
               <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">Basic Info</h3>
            </div>
            <Input label="Brand Name" defaultValue={initialData?.name} placeholder="e.g. Nike" required />
            <Input label="Phone Number" defaultValue={initialData?.phone} placeholder="+91..." required />
            <Input label="Email Address" type="email" defaultValue={initialData?.email} className="md:col-span-2" placeholder="contact@brand.com" required />
            
            <div className="md:col-span-2 mt-2">
               <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">Partnership Terms</h3>
            </div>

            <Select 
              label="Partner Type" 
              defaultValue={initialData?.type || 'non-exclusive'}
              options={[
                { value: 'exclusive', label: 'Exclusive Partner' },
                { value: 'non-exclusive', label: 'Standard Partner' }
              ]} 
            />
            
            <Input label="Commission (%)" type="number" min="0" max="100" defaultValue={initialData?.commission} required />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-2">
            <Button type="button" variant="outline" onClick={onCancel}>Discard</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};