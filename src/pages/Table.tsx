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
  const { cart } = useSelector((state: RootState) => state.order);
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
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[table.status]
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
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="bg-purple-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Table {currentTable?.number}</h1>
            {renderTableStatus(currentTable)}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => dispatch(setQRScanning(true))}
              className="inline-flex items-center px-4 py-2 border border-purple-500 rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <QrCodeIcon className="h-5 w-5 mr-2" />
              Scan QR
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center px-4 py-2 border border-purple-500 rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              View Cart
              {cart.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-purple-500 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-700 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <UsersIcon className="h-6 w-6 mr-2 text-purple-200" />
              <h2 className="text-lg font-semibold">Table Information</h2>
            </div>
            <div className="space-y-2 text-purple-100">
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
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Start Order
          </button>
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
