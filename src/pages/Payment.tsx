import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { processPayment } from '../store/slices/orderSlice';
import type { AppDispatch, RootState } from '../store';

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

  const total = currentOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) * 1.18; // Including 18% service fee

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
                  ? 'border-purple-500 bg-purple-50 text-black'
                  : 'border-gray-200'
              }`}
            >
              Credit Card
            </button>
            <button
              onClick={() => setSelectedMethod('cash')}
              className={`w-full p-4 rounded-lg border ${
                selectedMethod === 'cash'
                  ? 'border-purple-500 bg-purple-50 text-black'
                  : 'border-gray-200'
              }`}
            >
              Cash
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${(total / 1.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee (18%)</span>
              <span>${(total - total / 1.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default Payment;
