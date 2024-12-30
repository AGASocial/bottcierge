import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Menu from './pages/Menu';
import Table from './pages/Table';
import TableScan from './pages/TableScan';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Payment from './pages/Payment';
import Receipt from './pages/Receipt';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { getCurrentUser } from './store/slices/authSlice';
import type { AppDispatch } from './store';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-purple-900 text-white">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="table/scan" element={<TableScan />} />
          <Route path="table/:tableId" element={<Table />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payment" element={<Payment />} />
          <Route path="receipt" element={<Receipt />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
