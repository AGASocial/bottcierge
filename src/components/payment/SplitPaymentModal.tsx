import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  UserPlusIcon,
  UserMinusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import PaymentForm from './PaymentForm';
import type { OrderItem } from '../../types';

interface Participant {
  id: string;
  name: string;
  email: string;
  items: { itemId: string; quantity: number }[];
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  paymentToken?: string;
}

interface SplitPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  orderNumber: string;
  onComplete: () => void;
}

const SplitPaymentModal: React.FC<SplitPaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  orderNumber,
  onComplete,
}) => {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: '',
      email: '',
      items: [],
      amount: 0,
      status: 'pending',
    },
  ]);
  const [activeParticipant, setActiveParticipant] = useState<string | null>(null);
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [error, setError] = useState<string | null>(null);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (splitMethod === 'equal') {
      const equalAmount = totalAmount / participants.length;
      setParticipants(participants.map(p => ({
        ...p,
        amount: Number(equalAmount.toFixed(2)),
        items: items.map(item => ({
          itemId: item.id,
          quantity: item.quantity / participants.length,
        })),
      })));
    }
  }, [splitMethod, participants.length]);

  const handleAddParticipant = () => {
    if (participants.length < 8) {
      setParticipants([
        ...participants,
        {
          id: (participants.length + 1).toString(),
          name: '',
          email: '',
          items: [],
          amount: 0,
          status: 'pending',
        },
      ]);
    }
  };

  const handleRemoveParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const handleParticipantUpdate = (id: string, updates: Partial<Participant>) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  const handleItemAssignment = (participantId: string, itemId: string, quantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setParticipants(participants.map(p => {
      if (p.id === participantId) {
        const existingItem = p.items.find(i => i.itemId === itemId);
        const updatedItems = existingItem
          ? p.items.map(i => i.itemId === itemId ? { ...i, quantity } : i)
          : [...p.items, { itemId, quantity }];

        return {
          ...p,
          items: updatedItems,
          amount: updatedItems.reduce((sum, i) => {
            const orderItem = items.find(item => item.id === i.itemId);
            return sum + (orderItem?.price || 0) * i.quantity;
          }, 0),
        };
      }
      return p;
    }));
  };

  const handlePaymentSuccess = (participantId: string, token: string) => {
    handleParticipantUpdate(participantId, {
      status: 'paid',
      paymentToken: token,
    });

    // Check if all participants have paid
    const allPaid = participants.every(p => 
      p.id === participantId ? true : p.status === 'paid'
    );

    if (allPaid) {
      onComplete();
      onClose();
    } else {
      setActiveParticipant(null);
    }
  };

  const handlePaymentError = (participantId: string) => {
    handleParticipantUpdate(participantId, { status: 'failed' });
    setError('Payment failed. Please try again.');
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
                <h2 className="text-xl font-bold">Split Payment</h2>
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

                {/* Split Method Selection */}
                <div className="mb-6">
                  <div className="flex space-x-4 mb-4">
                    <button
                      onClick={() => setSplitMethod('equal')}
                      className={`flex-1 py-2 px-4 rounded-lg ${
                        splitMethod === 'equal'
                          ? 'bg-electric-blue'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      Split Equally
                    </button>
                    <button
                      onClick={() => setSplitMethod('custom')}
                      className={`flex-1 py-2 px-4 rounded-lg ${
                        splitMethod === 'custom'
                          ? 'bg-electric-blue'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      Split by Items
                    </button>
                  </div>
                </div>

                {/* Participants List */}
                <div className="space-y-4 mb-6">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="glass-card p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-4">
                          <input
                            type="text"
                            placeholder="Name"
                            value={participant.name}
                            onChange={(e) =>
                              handleParticipantUpdate(participant.id, {
                                name: e.target.value,
                              })
                            }
                            className="input-field mb-2"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={participant.email}
                            onChange={(e) =>
                              handleParticipantUpdate(participant.id, {
                                email: e.target.value,
                              })
                            }
                            className="input-field"
                          />
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold mb-2">
                            ${participant.amount.toFixed(2)}
                          </div>
                          {participant.status === 'pending' ? (
                            <button
                              onClick={() => setActiveParticipant(participant.id)}
                              className="btn-primary text-sm"
                            >
                              Pay Now
                            </button>
                          ) : participant.status === 'paid' ? (
                            <span className="text-green-400">Paid</span>
                          ) : (
                            <button
                              onClick={() => setActiveParticipant(participant.id)}
                              className="flex items-center space-x-1 text-red-400 hover:text-red-300"
                            >
                              <ArrowPathIcon className="w-4 h-4" />
                              <span>Retry</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {splitMethod === 'custom' && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            {items.map((item) => {
                              const assignedItem = participant.items.find(
                                i => i.itemId === item.id
                              );
                              return (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm">{item.name}</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max={item.quantity}
                                    value={assignedItem?.quantity || 0}
                                    onChange={(e) =>
                                      handleItemAssignment(
                                        participant.id,
                                        item.id,
                                        Number(e.target.value)
                                      )
                                    }
                                    className="input-field w-20 text-center"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add/Remove Participant Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddParticipant}
                    disabled={participants.length >= 8}
                    className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Add Person</span>
                  </button>
                  <button
                    onClick={() => handleRemoveParticipant(participants[participants.length - 1].id)}
                    disabled={participants.length <= 1}
                    className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                  >
                    <UserMinusIcon className="w-5 h-5" />
                    <span>Remove Person</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Form Modal */}
            <AnimatePresence>
              {activeParticipant && (
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
                    className="w-full max-w-lg"
                  >
                    <div className="glass-card p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">
                          Payment for {participants.find(p => p.id === activeParticipant)?.name}
                        </h3>
                        <button
                          onClick={() => setActiveParticipant(null)}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </button>
                      </div>

                      <PaymentForm
                        amount={participants.find(p => p.id === activeParticipant)?.amount || 0}
                        orderNumber={`${orderNumber}-${activeParticipant}`}
                        onSuccess={(token) => handlePaymentSuccess(activeParticipant, token)}
                        onError={() => handlePaymentError(activeParticipant)}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplitPaymentModal;
