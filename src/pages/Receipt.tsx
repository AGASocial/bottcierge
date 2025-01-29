import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ReceiptState {
  success: boolean;
  total: number;
  method: 'card' | 'cash';
  transactionId?: string;
  timestamp?: string;
  orderId: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  error?: string | null;
}

const Receipt: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ReceiptState;

  if (!state) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-deep-blue">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/20">
          <div className="text-center mb-8">
            {state.success ? (
              <>
                <CheckCircleIcon className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-light-blue">Your order has been processed</p>
              </>
            ) : (
              <>
                <XCircleIcon className="h-16 w-16 mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
                <p className="text-red-400">{state.error || 'An error occurred during payment'}</p>
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Transaction Details</h3>
              <div className="space-y-4 text-white">
                <div className="flex justify-between">
                  <span className="text-light-blue">Order ID</span>
                  <span>{state.orderId}</span>
                </div>
                {state.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-light-blue">Transaction ID</span>
                    <span>{state.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-light-blue">Date</span>
                  <span>{state.timestamp ? format(new Date(state.timestamp), 'MMM dd, yyyy HH:mm') : format(new Date(), 'MMM dd, yyyy HH:mm')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-blue">Payment Method</span>
                  <span className="capitalize">{state.method}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-4">
                {state.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-white">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-white/20 pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg text-white">
                    <span>Total</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              {state.success ? (
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 px-4 bg-white/5 hover:bg-light-blue text-white font-medium rounded-lg border border-white/20 transition-colors duration-200"
                >
                  Return to Home
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate(-1)}
                    className="w-full py-3 px-4 bg-white/5 hover:bg-light-blue text-white font-medium rounded-lg border border-white/20 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate('/cart')}
                    className="w-full py-3 px-4 bg-white/5 hover:bg-light-blue text-white font-medium rounded-lg border border-white/20 transition-colors duration-200"
                  >
                    Return to Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
