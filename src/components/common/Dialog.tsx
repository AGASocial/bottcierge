import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'error';
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          icon: 'text-red-400',
          button: 'bg-red-500 hover:bg-red-600'
        };
      case 'warning':
        return {
          icon: 'text-yellow-400',
          button: 'bg-yellow-500 hover:bg-yellow-600'
        };
      case 'info':
        return {
          icon: 'text-electric-blue',
          button: 'bg-electric-blue hover:bg-electric-blue/90'
        };
      default:
        return {
          icon: 'text-yellow-400',
          button: 'bg-yellow-500 hover:bg-yellow-600'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="glass-card p-6 max-w-md w-full">
        <div className="flex items-center space-x-4 mb-4">
          <ExclamationTriangleIcon className={`w-8 h-8 ${styles.icon}`} />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <p className="text-gray-300 mb-6">
          {message}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${styles.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
