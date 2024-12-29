import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';

const Receipt: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, method } = location.state as { total: number; method: 'card' | 'cash' };

  const orderDetails = {
    orderId: Math.random().toString(36).substring(7).toUpperCase(),
    date: format(new Date(), 'MMM dd, yyyy HH:mm'),
    items: [
      // In a real app, these would come from your order state
      { name: 'Sample Item 1', price: total * 0.6 },
      { name: 'Sample Item 2', price: total * 0.4 },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Receipt</h1>
        <button
          onClick={() => navigate('/orders')}
          className="text-gray-400 hover:text-white"
        >
          View All Orders
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-300">Your payment was successful</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Order ID</span>
            <span>{orderDetails.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Date</span>
            <span>{orderDetails.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Payment Method</span>
            <span className="capitalize">{method}</span>
          </div>

          <div className="border-t border-gray-700 my-4"></div>

          {orderDetails.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}

          <div className="border-t border-gray-700 mt-4 pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 bg-menu-active hover:bg-menu-hover text-white font-medium rounded-lg transition-colors duration-200"
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
