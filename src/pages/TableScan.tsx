import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { QrCodeIcon } from '@heroicons/react/24/outline';
import { getTableById } from '../store/slices/tableSlice';
import { setRandomVenue } from '../store/slices/venueSlice';
import QRScanner from '../components/scanner/QRScanner';
import type { AppDispatch } from '../store';

const TableScan: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [tableCode, setTableCode] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTableCodeSubmit = async () => {
    try {
      if (!tableCode.trim()) {
        setError('Please enter a table code');
        return;
      }
      await dispatch(setRandomVenue(tableCode));
      await dispatch(getTableById(tableCode));
      navigate(`/table/${tableCode}`);
    } catch (err) {
      setError('Invalid table code');
    }
  };

  const handleQRCodeScanned = async (code: string) => {
    try {
      await dispatch(setRandomVenue(code));
      await dispatch(getTableById(code));
      setQrScannerOpen(false);
      navigate(`/table/${code}`);
    } catch (err) {
      setError('Invalid QR code');
    }
  };

  return (
    <div className="min-h-screen bg-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-purple-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome to Bottcierge</h1>
        
        <div className="space-y-6">
          {/* Table Code Input */}
          <div>
            <label htmlFor="tableCode" className="block text-sm font-medium text-purple-100">
              Table Code
            </label>
            <div className="mt-1 flex space-x-3">
              <input
                type="text"
                id="tableCode"
                value={tableCode}
                onChange={(e) => setTableCode(e.target.value)}
                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-purple-600 rounded-md bg-purple-700 text-white placeholder-purple-300"
                placeholder="Enter table code"
              />
              <button
                onClick={() => setQrScannerOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-purple-500 shadow-sm text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <QrCodeIcon className="h-5 w-5 mr-2" />
                Scan QR
              </button>
            </div>
          </div>

          {/* Party Size Selection */}
          <div>
            <label htmlFor="partySize" className="block text-sm font-medium text-purple-100">
              Number of People
            </label>
            <select
              id="partySize"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-purple-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md bg-purple-700 text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Start Order Button */}
          <button
            onClick={handleTableCodeSubmit}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Continue
          </button>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        onScan={handleQRCodeScanned}
      />
    </div>
  );
};

export default TableScan;
