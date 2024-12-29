import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';
import { getOrders } from '../store/slices/orderSlice';
import type { AppDispatch, RootState } from '../store';
import type { Order } from '../types';

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const colors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    preparing: 'bg-purple-500',
    ready: 'bg-green-500',
    delivered: 'bg-gray-500',
    paid: 'bg-green-500',
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-white text-sm ${colors[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Orders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orderHistory: orders, loading, error } = useSelector((state: RootState) => state.order);
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order: Order) => {
    if (filter === 'active') {
      return ['pending', 'confirmed', 'preparing'].includes(order.status);
    }
    if (filter === 'past') {
      return ['delivered', 'paid'].includes(order.status);
    }
    return true;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded ${
              filter === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded ${
              filter === 'past'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Past
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order: Order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-xl font-bold">Order #{order.id}</h3>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <ClockIcon className="w-4 h-4" />
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Items</h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
