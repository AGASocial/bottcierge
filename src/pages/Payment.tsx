import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { processPayment } from '../store/slices/orderSlice';
import type { AppDispatch, RootState } from '../store';
import { ArrowLeftIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder } = useSelector((state: RootState) => state.order);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'cash'>('card');
  const [loading, setLoading] = useState(false);

  // Redirect to cart if no order exists
  React.useEffect(() => {
    if (!currentOrder) {
      navigate('/cart');
    }
  }, [currentOrder, navigate]);

  // Don't render anything while redirecting
  if (!currentOrder) {
    return null;
  }

  const calculateSubtotal = () => {
    return currentOrder.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      await dispatch(processPayment({
        method: selectedMethod,
        amount: calculateTotal(),
      })).unwrap();
      navigate('/receipt', { state: { total: calculateTotal(), method: selectedMethod } });
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-blue">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/20">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/cart')}
              className="mr-4 p-2 rounded-full bg-white/5 border border-white/20 text-white hover:bg-light-blue"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Payment</h1>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={selectedMethod === 'card'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <CreditCardIcon className="h-6 w-6 text-light-blue mr-2" />
                    <span className="text-white">Credit/Debit Card</span>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={selectedMethod === 'cash'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <BanknotesIcon className="h-6 w-6 text-light-blue mr-2" />
                    <span className="text-white">Cash</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-white">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Tax</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-white">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedMethod}
              className="w-full py-3 bg-white/5 border border-white/20 text-white rounded-lg hover:bg-light-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
