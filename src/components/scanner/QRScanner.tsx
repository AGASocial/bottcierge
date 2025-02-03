import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { ArrowPathIcon, CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
  onScannedResult?: (result: string | null) => void;
  defaultScannedResult?: string | null;
}

const QRScanner: React.FC<QRScannerProps> = ({ 
  isOpen, 
  onClose, 
  onScan, 
  onError, 
  onScannedResult, 
  defaultScannedResult = null 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(defaultScannedResult);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream after getting permission
      setHasPermission(true);
      return true;
    } catch (error) {
      setHasPermission(false);
      setError('Camera permission denied. Please allow camera access to scan QR codes.');
      if (onError) onError(new Error('Camera permission denied'));
      return false;
    }
  };

  const startScanning = async () => {
    try {
      setError('');
      if (!videoRef.current) return;

      // First check if we have permission
      const hasPermissionResult = await requestCameraPermission();
      if (!hasPermissionResult) return;

      const codeReader = new BrowserQRCodeReader();
      
      // Get list of video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const allVideoDevices = devices.filter(device => device.kind === 'videoinput');
      
      // Filter to get one front and one back camera
      const filteredDevices = allVideoDevices.reduce((acc: MediaDeviceInfo[], device) => {
        const label = device.label?.toLowerCase() || '';
        const isBack = label.includes('back') || label.includes('rear');
        const isFront = label.includes('front');
        
        // For back camera, prefer the one without 'wide' or 'ultra' in the name
        if (isBack) {
          const existingBack = acc.find(d => d.label?.toLowerCase().includes('back') || d.label?.toLowerCase().includes('rear'));
          if (!existingBack || (label.includes('back') && !label.includes('wide') && !label.includes('ultra'))) {
            if (existingBack) {
              acc = acc.filter(d => d !== existingBack);
            }
            acc.push(device);
          }
        } else if (isFront && !acc.some(d => d.label?.toLowerCase().includes('front'))) {
          acc.push(device);
        } else if (allVideoDevices.length === 2) {
          // If we have exactly 2 cameras and they're not labeled
          if (device === allVideoDevices[0] && !acc.some(d => d.label?.toLowerCase().includes('front'))) {
            acc.push(device); // Assume first is front
          } else if (device === allVideoDevices[1] && !acc.some(d => d.label?.toLowerCase().includes('back'))) {
            acc.push(device); // Assume second is back
          }
        }
        return acc;
      }, []);

      setVideoInputDevices(filteredDevices);

      // Use the first available device if none selected, prefer back camera
      let deviceId = selectedDeviceId;
      if (!deviceId) {
        // Try to find a back camera first
        const backCamera = filteredDevices.find(d => {
          const label = d.label?.toLowerCase() || '';
          return label.includes('back') || label.includes('rear');
        });
        deviceId = backCamera?.deviceId || filteredDevices[0]?.deviceId;
      }
      
      if (!deviceId) {
        const noDeviceError = new Error('No camera found. Please make sure your device has a camera.');
        setError(noDeviceError.message);
        if (onError) onError(noDeviceError);
        return;
      }

      setIsScanning(true);
      
      // Start scanning with selected device
      controlsRef.current = await codeReader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result) => {
          if (result) {
            const text = result.getText();
            setScannedResult(text);
            onScan(text);
            if (onScannedResult) onScannedResult(text);
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
            className="bg-deep-blue rounded-lg p-4 max-w-lg w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Scan QR Code</h2>
              <button
                onClick={() => {
                  stopScanning();
                  onClose();
                }}
                className="text-light-blue hover:text-white focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
                <button
                  onClick={() => {
                    setError('');
                    startScanning();
                  }}
                  className="mt-2 text-sm text-red-200 hover:text-white flex items-center gap-1"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Try again
                </button>
              </div>
            )}

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
              />
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <CameraIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>{hasPermission === false ? 'Camera access denied' : hasPermission === null ? 'Camera permission needed' : 'Camera is off'}</p>
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
                  {videoInputDevices.map((device) => {
                    let label = device.label?.toLowerCase() || '';
                    let friendlyName = 'Camera';
                    
                    // Simpler logic since we've already filtered the devices
                    if (label.includes('back') || label.includes('rear') || 
                        (videoInputDevices.length === 2 && device === videoInputDevices[1])) {
                      friendlyName = 'Back Camera';
                    } else if (label.includes('front') || 
                             (videoInputDevices.length === 2 && device === videoInputDevices[0])) {
                      friendlyName = 'Front Camera';
                    }
                    
                    return (
                      <option key={device.deviceId} value={device.deviceId}>
                        {friendlyName}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={toggleScanning}
                className="flex items-center px-4 py-2 bg-deep-blue text-white rounded-lg hover:bg-light-blue transition-colors"
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
