import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { Order, OrderItem, OrderStatus } from '../types';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const orders = useSelector((state: RootState) => state.order.orderHistory) || [];

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-500',
    preparing: 'bg-light-blue',
    ready: 'bg-green-500',
    delivered: 'bg-gray-500',
    completed: 'bg-gray-500',
    cancelled: 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-deep-blue">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-6">Your Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-light-blue mb-4">No orders yet</p>
              <button
                onClick={() => navigate('/menu')}
                className="px-6 py-2 bg-white/5 border border-white/20 text-white rounded-full hover:bg-light-blue"
              >
                Start New Order
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order) => (
                <div
                  key={order.id}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ClockIcon className="h-5 w-5 text-light-blue" />
                        <h2 className="font-semibold text-white">Order #{order.orderNumber}</h2>
                      </div>
                      <p className="text-sm text-light-blue">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                        statusColors[order.status as OrderStatus]
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item: OrderItem) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2 border-t border-white/10"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{item.name}</h3>
                          <p className="text-sm text-light-blue">
                            Size: {item.size.name}
                          </p>
                          {item.options && Object.entries(item.options).map(([category, selection]) => (
                            <p key={category} className="text-sm text-light-blue">
                              {category}:{' '}
                              {Array.isArray(selection)
                                ? selection.join(', ')
                                : String(selection)}
                            </p>
                          ))}
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">
                            ${(item.quantity * item.totalPrice).toFixed(2)}
                          </div>
                          <div className="text-sm text-light-blue">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-white">
                      <span>Total</span>
                      <span className="font-bold">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
