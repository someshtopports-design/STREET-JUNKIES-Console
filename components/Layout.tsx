import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, LayoutDashboard, Tags, Package, ShoppingBag, FileText, Settings, LogOut, X, ChevronRight, Moon, Sun } from 'lucide-react';

const NavItem: React.FC<{ to: string; icon: any; label: string; onClick?: () => void }> = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 shadow-md shadow-zinc-900/10'
          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
      }`
    }
  >
    <Icon className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
    {label}
  </NavLink>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('brands')) return 'Brands';
    if (path.includes('inventory')) return 'Inventory';
    if (path.includes('sales')) return 'Sales';
    if (path.includes('invoices')) return 'Invoices';
    if (path.includes('settings')) return 'Settings';
    return 'Dashboard';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 transition-colors duration-300">
      <div className="p-6 pb-2">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-50 rounded-lg flex items-center justify-center transition-colors">
            <span className="text-white dark:text-zinc-900 font-bold text-xs">SJ</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">STREET JUNKIES</h1>
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mt-0.5">Console v1.0</p>
          </div>
        </div>
      </div>
      
      <div className="px-3 mb-2">
        <p className="px-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Main</p>
        <nav className="space-y-1">
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Overview" onClick={() => setSidebarOpen(false)} />
          <NavItem to="/admin/brands" icon={Tags} label="Brands" onClick={() => setSidebarOpen(false)} />
          <NavItem to="/admin/inventory" icon={Package} label="Inventory" onClick={() => setSidebarOpen(false)} />
          <NavItem to="/admin/sales" icon={ShoppingBag} label="Sales" onClick={() => setSidebarOpen(false)} />
        </nav>
      </div>

      <div className="px-3 mt-4">
        <p className="px-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Finance</p>
        <nav className="space-y-1">
           <NavItem to="/admin/invoices" icon={FileText} label="Invoices" onClick={() => setSidebarOpen(false)} />
        </nav>
      </div>

      <div className="px-3 mt-4">
        <p className="px-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">System</p>
        <nav className="space-y-1">
           <NavItem to="/admin/settings" icon={Settings} label="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4 px-2">
           <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Theme</span>
           <button onClick={toggleTheme} className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
             {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
        </div>

        <div className="flex items-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 mb-2 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-zinc-700 dark:text-zinc-200 font-bold text-xs shadow-sm">
            JD
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">John Doe</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 flex font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-900/60 backdrop-blur-sm md:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:translate-x-0 md:static md:block ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        {isSidebarOpen && (
          <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 md:hidden text-zinc-400">
            <X className="w-6 h-6" />
          </button>
        )}
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#fafafa] dark:bg-zinc-950 transition-colors duration-300">
        {/* Mobile Header */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between md:hidden sticky top-0 z-20">
           <div className="flex items-center">
             <button onClick={() => setSidebarOpen(true)} className="mr-3 text-zinc-600 dark:text-zinc-400 p-1 -ml-1">
               <Menu className="w-6 h-6" />
             </button>
             <span className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{getPageTitle()}</span>
           </div>
           <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
        </header>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-8 py-8">
          <div>
            <div className="flex items-center text-xs text-zinc-400 mb-1 space-x-2">
              <span>Console</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">{getPageTitle()}</span>
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{getPageTitle()}</h2>
          </div>
          {/* Top actions area */}
          <div className="flex items-center space-x-4">
             {/* Add global search or notif here if needed */}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 pt-0 md:px-8 md:pb-8">
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};