import React from 'react';
import { LayoutDashboard, ShoppingBag, Users, ShoppingCart, FileText, X, LogOut, ChevronRight, Settings, History } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  currentUser: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, isOpen, setIsOpen, onLogout, currentUser }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: ShoppingBag },
    { id: 'brands', label: 'Brands', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'logs', label: 'Activity Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay with Blur */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white transform transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] shadow-2xl lg:shadow-none flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-8">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 shadow-xl">
                <span className="text-white font-heading font-black italic text-lg tracking-tighter">SJ</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg tracking-tight leading-none text-white">StreetJunkies</span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">Retail OS v2.1</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} strokeWidth={2} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-indigo-200" />}
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-900">
          <button 
            onClick={onLogout}
            className="w-full bg-slate-900/50 rounded-2xl p-4 flex items-center gap-3 hover:bg-slate-900 transition-colors cursor-pointer border border-slate-800/50 text-left group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white border-2 border-slate-800">
                 {currentUser.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading font-semibold text-white truncate">{currentUser}</p>
              <p className="text-xs text-slate-500 truncate">Store Staff</p>
            </div>
            <LogOut size={18} className="text-slate-600 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </>
  );
};