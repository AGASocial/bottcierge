import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { QrCodeIcon } from '@heroicons/react/24/outline';
import { getTableById, setTableCode } from '../store/slices/tableSlice';
import { setRandomVenue } from '../store/slices/venueSlice';
import QRScanner from '../components/scanner/QRScanner';
import type { AppDispatch } from '../store';

const TableScan: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [tableCode, setTableCodeState] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTableCodeSubmit = async () => {
    try {
      if (!tableCode.trim()) {
        setError('Please enter a table code');
        return;
      }

      dispatch(setTableCode(tableCode));
      await dispatch(setRandomVenue(tableCode));
      await dispatch(getTableById(tableCode));
      navigate(`/table/${tableCode}`);
    } catch (err) {
      setError('Invalid table code');
    }
  };

  const handleQRCodeScanned = async (code: string) => {
    try {
      // Validate if code is a 4-digit number
      const validCode = /^\d{4}$/.test(code) ? code : '1234';
      
      dispatch(setTableCode(validCode));
      await dispatch(setRandomVenue(validCode));
      await dispatch(getTableById(validCode));
      setQrScannerOpen(false);
      navigate(`/table/${validCode}`);
    } catch (err) {
      setError('Invalid QR code');
    }
  };

  return (
    <div className="min-h-screen bg-deep-blue py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto glass-card p-6">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome to Bottcierge</h1>

        <div className="space-y-6">
          {/* Table Code Input */}
          <div>
            <label htmlFor="tableCode" className="block text-sm font-medium text-light-blue">
              Table Code
            </label>
            <div className="mt-1 flex space-x-3">
              <input
                type="text"
                id="tableCode"
                value={tableCode}
                onChange={(e) => setTableCodeState(e.target.value)}
                className="shadow-sm focus:ring-light-blue focus:border-light-blue block w-full sm:text-sm border-white/20 rounded-md bg-white/5 text-white placeholder-light-blue"
                placeholder="Enter table code"
              />
              <button
                onClick={() => setQrScannerOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-white/20 shadow-sm text-sm font-medium rounded-md text-white bg-white/5 hover:bg-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue"
              >
                <QrCodeIcon className="h-5 w-5 mr-2" />
                Scan QR
              </button>
            </div>
          </div>

          {/* Party Size Selection */}
          <div>
            <label htmlFor="partySize" className="block text-sm font-medium text-light-blue">
              Number of People
            </label>
            <select
              id="partySize"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-white/20 focus:outline-none focus:ring-light-blue focus:border-light-blue sm:text-sm rounded-md bg-white/5 text-white"
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
            className="w-full flex justify-center py-2 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue"
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
