import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { QrCodeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../store';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const currentTableCode = useSelector((state: RootState) => state.table.currentTableCode);

  const handleStartOrder = () => {
    if (currentTableCode) {
      navigate(`/table/${currentTableCode}`);
    } else {
      navigate('/table/scan');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Bottcierge</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Scan QR Code */}
        <div
          onClick={handleStartOrder}
          className="glass-card p-6 cursor-pointer hover:bg-white/20 transition-all duration-300"
        >
          <div className="flex items-center space-x-4 mb-4">
            <QrCodeIcon className="w-8 h-8 text-electric-blue" />
            <h2 className="text-xl font-bold">Start a new Order</h2>
          </div>
          <p className="text-gray-300">
            {currentTableCode 
              ? "Continue ordering for your current table"
              : "To start a new order, please enter or scan your table's QR code"
            }
          </p>
        </div>

        {/* View Orders */}
        <div
          onClick={() => navigate('/orders')}
          className="glass-card p-6 cursor-pointer hover:bg-white/20 transition-all duration-300"
        >
          <div className="flex items-center space-x-4 mb-4">
            <ClipboardDocumentListIcon className="w-8 h-8 text-neon-pink" />
            <h2 className="text-xl font-bold">View Orders</h2>
          </div>
          <p className="text-gray-300">
            Check your current and past orders
          </p>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Featured Drinks</h2>
        <div className="glass-card p-6">
          <p className="text-center text-gray-300">
            Loading featured drinks...
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/menu')}
            className="btn-primary"
          >
            Browse Menu
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="btn-secondary"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
