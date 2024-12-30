import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MinusIcon, PlusIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import {
  removeFromCart,
  addItemToOrder,
  removeItemFromOrder,
} from '../store/slices/orderSlice';
import type { OrderItem, Order } from '../types';
import type { RootState, AppDispatch } from '../store';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentOrder } = useSelector((state: RootState) => state.order);

  const total = currentOrder?.items.reduce(
    (sum: number, item: OrderItem) => sum + item.price * item.quantity,
    0
  ) || 0;

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (!currentOrder) return;

    const item = currentOrder.items.find(i => i.id === itemId);
    if (!item) return;

    if (quantity < 1) {
      dispatch(removeItemFromOrder({
        orderId: currentOrder.id,
        itemId: itemId
      }));
    } else {

      dispatch(addItemToOrder({
        orderId: currentOrder.id,
        item: {
          ...item,
          quantity
        }
      }));
    }
  };

  const handleCheckout = () => {
    navigate('/payment');
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'authorized':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full bg-purple-800 text-white hover:bg-purple-700"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">Your Cart</h1>
        </div>

        {currentOrder && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  <h2 className="font-semibold text-gray-900">Order in Progress</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">Order #{currentOrder.orderNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(currentOrder.status)}`}>
                {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
              </span>
            </div>
          </div>
        )}

        {!currentOrder ? (
          <div className="text-black bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No active order</p>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
            >
              Start New Order
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Items */}
            <div className="text-black bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="divide-y">
                {currentOrder.items.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No items in your order yet
                  </div>
                ) : (
                  currentOrder.items.map((item: OrderItem) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, -1)
                          }
                          className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, 1)
                          }
                          className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="text-black bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>${(total * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(total * 1.18).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/menu')}
                className="flex-1 px-6 py-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
              >
                Add More Items
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
