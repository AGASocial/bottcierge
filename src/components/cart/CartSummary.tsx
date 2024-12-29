import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../../store';
import { calculateTotal, calculateSubtotal, calculateTax } from '../../utils/cart';

interface CartSummaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart } = useSelector((state: RootState) => state.order);
  
  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(cart);

  const handlePayment = () => {
    navigate('/payment', { state: { total } });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-menu-active hover:bg-menu-hover text-white py-3 rounded-lg transition-colors duration-200"
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartSummary;
