import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, Button, Input, Select, Modal } from '../components/UI';
import { Plus, QrCode, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export const Inventory: React.FC = () => {
  const [view, setView] = useState<'list' | 'new'>('list');
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {view === 'list' ? (
        <InventoryList onViewNew={() => setView('new')} onShowQr={(token) => setSelectedQr(token)} />
      ) : (
        <InventoryForm onCancel={() => setView('list')} onSuccess={(token) => { setView('list'); setSelectedQr(token); }} />
      )}

      <Modal isOpen={!!selectedQr} onClose={() => setSelectedQr(null)} title="Product QR Code">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-inner">
             {selectedQr && (
               <QRCodeSVG 
                 value={`${window.location.origin}/#/sale/${selectedQr}`} 
                 size={200} 
                 level="H"
               />
             )}
          </div>
          <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 break-all bg-zinc-50 dark:bg-zinc-800 p-2 rounded w-full">
            {`${window.location.origin}/#/sale/${selectedQr}`}
          </p>
          <div className="flex w-full space-x-3">
            <Button variant="secondary" className="flex-1" icon={Download} onClick={() => toast.success('Downloaded')}>PNG</Button>
            <Button variant="primary" className="flex-1" icon={Printer} onClick={() => window.print()}>Print</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const InventoryList: React.FC<{ onViewNew: () => void; onShowQr: (t: string) => void }> = ({ onViewNew, onShowQr }) => (
  <>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input 
          placeholder="Search products..." 
          className="pl-9 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100" 
        />
      </div>
      <Button onClick={onViewNew} icon={Plus}>Add Item</Button>
    </div>

    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100">Air Force 1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">Nike</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">UK 9</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">₹8,999</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">DEL: 5 | BLR: 2</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onShowQr(`mock-token-${i}`)} className="text-violet-600 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 inline-flex items-center">
                    <QrCode className="w-4 h-4 mr-1" /> QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

const InventoryForm: React.FC<{ onCancel: () => void; onSuccess: (t: string) => void }> = ({ onCancel, onSuccess }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    toast.success('Inventory item created!');
    onSuccess('new-token-' + Date.now());
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Add Inventory Item</h2>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label="Brand" options={[{value: 'nike', label: 'Nike'}, {value: 'adidas', label: 'Adidas'}]} required />
            <Select label="Size" options={[{value: 'S', label: 'S'}, {value: 'M', label: 'M'}, {value: 'L', label: 'L'}, {value: 'XL', label: 'XL'}]} required />
            <Input label="Product Name" placeholder="e.g. Graphic Tee" className="md:col-span-2" required />
            <Input label="Base Price (₹)" type="number" required />
            
            <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
              <p className="col-span-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Initial Stock</p>
              <Input label="Delhi (DEL)" type="number" placeholder="0" />
              <Input label="Bangalore (BLR)" type="number" placeholder="0" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Create & Generate QR</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};