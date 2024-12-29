import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UsersIcon,
  QrCodeIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { getTableById, setQRScanning } from '../store/slices/tableSlice';
import { createOrder } from '../store/slices/orderSlice';
import QRScanner from '../components/scanner/QRScanner';
import Cart from '../components/cart/Cart';
import type { AppDispatch, RootState } from '../store';

const Table: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTable: currentTable, qrScanning } = useSelector(
    (state: RootState) => state.table
  );
  const { currentVenue } = useSelector((state: RootState) => state.venue);
  const { cart } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (tableId) {
      dispatch(getTableById(tableId));
    }
  }, [dispatch, tableId]);

  const handleStartOrder = async () => {
    if (!currentTable || !currentVenue) return;

    await dispatch(createOrder({
      venueId: currentVenue.id,
      tableId: currentTable.id,
      type: 'regular'
    }));
  };

  const renderTableStatus = (table: typeof currentTable) => {
    if (!table) return null;

    const colors = {
      available: 'bg-green-500',
      occupied: 'bg-red-500',
      reserved: 'bg-yellow-500',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-white text-sm ${
          colors[table.status as keyof typeof colors]
        }`}
      >
        {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
      </span>
    );
  };

  if (!currentTable) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Table Information */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    Table {currentTable.number}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">
                      {renderTableStatus(currentTable)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(setQRScanning(true))}
                  className="p-2 bg-purple-100 rounded-full hover:bg-purple-200"
                >
                  <QrCodeIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Capacity */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 text-gray-500 mb-2">
                  <UsersIcon className="w-5 h-5" />
                  <span>Capacity</span>
                </div>
                <p className="text-2xl font-bold">
                  {currentTable.capacity}
                </p>
              </div>

              {/* Cart */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 text-gray-500 mb-2">
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>Cart</span>
                </div>
                <p className="text-2xl font-bold">{cart.length} items</p>
              </div>
            </div>

            {currentTable.status === 'available' && (
              <button
                onClick={handleStartOrder}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Start Order
              </button>
            )}
          </div>

          {/* Cart Component */}
          <div className="relative h-full">
            <Cart />
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {qrScanning && (
          <QRScanner
            isOpen={qrScanning}
            onClose={() => dispatch(setQRScanning(false))}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Table;
