import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { ArrowPathIcon, CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScan, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);

  const startScanning = async () => {
    try {
      if (!videoRef.current) return;

      const codeReader = new BrowserQRCodeReader();
      
      // Get list of video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setVideoInputDevices(videoDevices);
      console.log(videoDevices);

      // Use the first available device if none selected
      const deviceId = selectedDeviceId || videoDevices[0]?.deviceId;
      
      if (!deviceId) {
        throw new Error('No video input devices found');
      }

      setIsScanning(true);
      
      // Start scanning with selected device
      controlsRef.current = await codeReader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result) => {
          if (result) {
            onScan(result.getText());
            stopScanning();
            onClose();
          }
        }
      );
    } catch (error) {
      setIsScanning(false);
      if (error instanceof Error && onError) {
        onError(error);
      }
      console.error('Error starting QR scanner:', error);
    }
  };

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleScanning = () => {
    if (isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  // Start scanning when modal opens
  useEffect(() => {
    if (isOpen && !isScanning) {
      startScanning();
    }
    // Clean up when modal closes
    return () => {
      stopScanning();
    };
  }, [isOpen]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

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
            className="bg-purple-800 rounded-lg p-4 max-w-lg w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Scan QR Code</h2>
              <button
                onClick={() => {
                  stopScanning();
                  onClose();
                }}
                className="text-purple-200 hover:text-white focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
              />
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <CameraIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera is off</p>
                  </div>
                </div>
              )}
            </div>

            {videoInputDevices.length > 1 && (
              <div className="mb-4">
                <select
                  value={selectedDeviceId}
                  onChange={(e) => {
                    setSelectedDeviceId(e.target.value);
                    if (isScanning) {
                      stopScanning();
                      startScanning();
                    }
                  }}
                  className="w-full p-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                >
                  {videoInputDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 5)}...`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={toggleScanning}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {isScanning ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                    Stop Scanning
                  </>
                ) : (
                  <>
                    <CameraIcon className="h-5 w-5 mr-2" />
                    Start Scanning
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRScanner;
