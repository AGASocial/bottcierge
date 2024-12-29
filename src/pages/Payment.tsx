import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { processPayment } from '../store/slices/orderSlice';
import type { AppDispatch } from '../store';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'cash'>('card');
  const [loading, setLoading] = useState(false);
  
  // Get total from location state
  const { total } = location.state as { total: number };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await dispatch(processPayment({
        method: selectedMethod,
        amount: total,
      })).unwrap();
      navigate('/receipt', { state: { total, method: selectedMethod } });
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        >
          Back
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
          <div className="space-y-4">
            <button
              onClick={() => setSelectedMethod('card')}
              className={`w-full p-4 rounded-lg border ${
                selectedMethod === 'card'
                  ? 'border-menu-active bg-menu-active/10'
                  : 'border-gray-600 hover:border-menu-hover'
              }`}
            >
              Credit/Debit Card
            </button>
            <button
              onClick={() => setSelectedMethod('cash')}
              className={`w-full p-4 rounded-lg border ${
                selectedMethod === 'cash'
                  ? 'border-menu-active bg-menu-active/10'
                  : 'border-gray-600 hover:border-menu-hover'
              }`}
            >
              Cash
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-300">Total</span>
            <span className="text-xl font-bold">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 px-4 bg-menu-active hover:bg-menu-hover text-white font-medium rounded-lg transition-colors duration-200"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
