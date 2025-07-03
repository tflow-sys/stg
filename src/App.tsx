import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { Equipment } from './pages/Equipment';
import { EquipmentDetail } from './pages/EquipmentDetail';
import { EquipmentRental } from './pages/EquipmentRental';
import { Packages } from './pages/Packages';
import { PackageDetail } from './pages/PackageDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { Dashboard } from './pages/Dashboard';
import Admin from './pages/Admin';
import { StaffDashboard } from './pages/StaffDashboard';
import { UserManagement } from './pages/UserManagement';
import { Auth } from './pages/Auth';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, isRole } = useAuth();
  
  // Check if user is system user (admin, manager, staff, partner)
  const isSystemUser = user && !isRole('customer');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/equipment/rent" element={<EquipmentRental />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/track/:orderNumber" element={<OrderTracking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
                <p className="text-lg text-gray-600">This page is under development</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
      {/* Only show footer for customers and guests */}
      {!isSystemUser && <Footer />}
    </div>
  );
}

export default App;