import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import {
  removeFromCart,
  updateItemQuantity,
  clearCart,
} from '../../store/slices/orderSlice';
import type { OrderItem } from '../../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: any) => state.order);
  const [showPayment, setShowPayment] = useState(false);

  const total = cart.reduce(
    (sum: number, item: OrderItem) => sum + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateItemQuantity({ id: itemId, quantity }));
    }
  };

  const handleCheckout = () => {
    setShowPayment(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item: OrderItem) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            ${item.price} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="rounded-full bg-gray-100 p-1 hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="rounded-full bg-gray-100 p-1 hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t p-4">
                  <div className="mb-4 flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
                    >
                      Checkout
                    </button>
                    <button
                      onClick={() => dispatch(clearCart())}
                      className="w-full rounded border py-2 text-gray-600 hover:bg-gray-50"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CartContainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useSelector((state: any) => state.order);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 z-40"
      >
        <XMarkIcon className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>

      <Cart isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default CartContainer;
