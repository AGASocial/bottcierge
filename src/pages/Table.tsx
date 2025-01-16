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
import { useNavigate } from 'react-router-dom';

const Table: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTable: currentTable, qrScanning } = useSelector(
    (state: RootState) => state.table
  );
  const { currentVenue } = useSelector((state: RootState) => state.venue);
  const { currentOrder } = useSelector((state: RootState) => state.order);
  const navigate = useNavigate();

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

    navigate('/menu');
  };

  const renderTableStatus = (table: typeof currentTable) => {
    if (!table) return null;

    const colors = {
      available: 'bg-green-400',
      occupied: 'bg-red-400',
      reserved: 'bg-yellow-400',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[table.status]
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
    <div className="min-h-screen bg-deep-blue">
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Table {currentTable?.number}</h1>
              <p className="text-light-blue">Welcome! Ready to order?</p>
              {renderTableStatus(currentTable)}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => dispatch(setQRScanning(true))}
                className="inline-flex items-center px-4 py-2 border border-white/20 shadow-sm text-sm font-medium rounded-md text-white bg-white/5 hover:bg-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue"
              >
                <QrCodeIcon className="h-5 w-5 mr-2" />
                Scan QR
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="inline-flex items-center px-4 py-2 border border-white/20 shadow-sm text-sm font-medium rounded-md text-white bg-white/5 hover:bg-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                View Cart
                {currentOrder && currentOrder.items.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-light-blue rounded-full">
                    {currentOrder.items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20">
              <div className="flex items-center mb-4">
                <UsersIcon className="h-6 w-6 mr-2 text-light-blue" />
                <h2 className="text-lg font-semibold">Table Information</h2>
              </div>
              <div className="space-y-2 text-light-blue">
                <p>Capacity: {currentTable?.capacity} people</p>
                {currentTable?.status && (
                  <p>Status: {currentTable.status.charAt(0).toUpperCase() + currentTable.status.slice(1)}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleStartOrder}
              className="w-full flex justify-center py-3 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue"
            >
              Start Order
            </button>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {qrScanning && (
          <QRScanner
            isOpen={qrScanning}
            onClose={() => dispatch(setQRScanning(false))}
            onScan={async (tableId) => {
              await dispatch(getTableById(tableId));
              dispatch(setQRScanning(false));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Table;
