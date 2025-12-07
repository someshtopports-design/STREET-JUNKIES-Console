import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import { Layout } from './components/Layout';

// Pages
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { Brands } from './pages/Brands';
import { Inventory } from './pages/Inventory';
import { SalesList } from './pages/SalesList';
import { Sale } from './pages/Sale';
import { Invoices } from './pages/Invoices';

// Auth Guard Mock
const ProtectedRoute = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout><Outlet /></Layout>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        className: 'text-sm font-medium',
        style: {
          background: '#18181b',
          color: '#fff',
          padding: '12px 20px',
        },
      }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Public / Scanner Route (No Sidebar) */}
        <Route path="/sale/:qrToken" element={<Sale />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="brands" element={<Brands />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="sales" element={<SalesList />} />
          <Route path="invoices" element={<Invoices />} />
          {/* Placeholders for routes not fully implemented in this demo */}
          <Route path="settings" element={<div className="p-8 text-zinc-500">Settings Module Coming Soon</div>} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;