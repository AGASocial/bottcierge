import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  EnvelopeIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { receiptService } from '../../services/receiptService';
import type { ReceiptDetails } from '../../services/receiptService';
import type { OrderItem } from '../../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    orderNumber: string;
    items: OrderItem[];
    subtotal: number;
    tip: number;
    total: number;
    venue: {
      name: string;
      address: string;
      phone: string;
    };
    table: {
      number: string;
      section: string;
    };
    server: {
      name: string;
    };
    paymentMethod: {
      type: string;
      last4?: string;
    };
    splitPayment?: {
      participants: {
        name: string;
        amount: number;
        items?: OrderItem[];
      }[];
    };
  };
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  orderDetails,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const receiptDetails: ReceiptDetails = {
        ...orderDetails,
        timestamp: new Date().toISOString(),
      };
      const blob = await receiptService.generateReceipt(receiptDetails);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${orderDetails.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSuccess('Receipt downloaded successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailReceipt = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await receiptService.emailReceipt({
        email,
        receiptDetails: {
          ...orderDetails,
          timestamp: new Date().toISOString(),
        },
      });
      setSuccess('Receipt sent to your email');
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-2xl"
          >
            <div className="glass-card overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h2 className="text-xl font-bold">Receipt</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-6 bg-red-500/20 text-red-400 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 bg-green-500/20 text-green-400 p-4 rounded-lg">
                    {success}
                  </div>
                )}

                {/* Receipt Preview */}
                <div className="mb-8 p-6 bg-white/5 rounded-lg">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{orderDetails.venue.name}</h3>
                    <p className="text-gray-300">{orderDetails.venue.address}</p>
                    <p className="text-gray-300">{orderDetails.venue.phone}</p>
                  </div>

                  <div className="flex justify-between text-sm mb-4">
                    <div>
                      <p>Order #: {orderDetails.orderNumber}</p>
                      <p>Table: {orderDetails.table.number}</p>
                      <p>Server: {orderDetails.server.name}</p>
                    </div>
                    <div className="text-right">
                      <p>
                        {receiptService.formatDateTime(new Date().toISOString())}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 mb-4">
                    {orderDetails.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm mb-2"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>
                          {receiptService.formatCurrency(
                            item.price * item.quantity
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>
                        {receiptService.formatCurrency(orderDetails.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Tip</span>
                      <span>{receiptService.formatCurrency(orderDetails.tip)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        {receiptService.formatCurrency(orderDetails.total)}
                      </span>
                    </div>
                  </div>

                  {orderDetails.splitPayment && (
                    <div className="border-t border-white/10 mt-4 pt-4">
                      <h4 className="font-bold mb-2">Split Payment Details</h4>
                      {orderDetails.splitPayment.participants.map(
                        (participant, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm mb-2"
                          >
                            <span>{participant.name}</span>
                            <span>
                              {receiptService.formatCurrency(participant.amount)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <div className="text-center text-sm text-gray-300 mt-6">
                    Thank you for your visit!
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  {/* Email Receipt */}
                  <div className="flex space-x-4">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field flex-1"
                    />
                    <button
                      onClick={handleEmailReceipt}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <EnvelopeIcon className="w-5 h-5" />
                      <span>Email</span>
                    </button>
                  </div>

                  {/* Download and Print */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleDownload}
                      disabled={loading}
                      className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                    >
                      <DocumentArrowDownIcon className="w-5 h-5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      disabled={loading}
                      className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                    >
                      <PrinterIcon className="w-5 h-5" />
                      <span>Print</span>
                    </button>
                  </div>

                  {/* View History */}
                  <button
                    onClick={() => {}}
                    className="w-full py-2 flex items-center justify-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ClockIcon className="w-5 h-5" />
                    <span>View Receipt History</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReceiptModal;
