import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getTableById, setQRScanning } from '../../store/slices/tableSlice';
import type { AppDispatch } from '../../store';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  const [controls, setControls] = useState<IScannerControls | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const codeReader = new BrowserQRCodeReader();
    let mounted = true;

    const startScanning = async () => {
      try {
        const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
        const selectedDeviceId = videoInputDevices[0]?.deviceId;

        if (!selectedDeviceId) {
          setError('No camera found');
          return;
        }

        const scannerControls = await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          'video',
          async (result) => {
            if (!mounted) return;
            if (result) {
              const tableId = result.getText();
              await dispatch(getTableById(tableId));
              dispatch(setQRScanning(false));
              onClose();
            }
          }
        );

        setControls(scannerControls);
      } catch (err) {
        if (mounted) {
          setError('Failed to access camera');
        }
      }
    };

    startScanning();

    return () => {
      mounted = false;
      controls?.stop();
    };
  }, [dispatch, isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg p-4 max-w-lg w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Scan QR Code</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : (
              <div className="relative aspect-square">
                <video
                  id="video"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRScanner;
