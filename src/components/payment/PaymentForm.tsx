import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { paymentService } from '../../services/paymentService';
import type { CreditCardInfo, BillingAddress } from '../../services/paymentService';

interface PaymentFormProps {
  amount: number;
  orderNumber: string;
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  orderNumber,
  onSuccess,
  onError,
}) => {
  const [step, setStep] = useState<'card' | 'billing'>('card');
  const [loading, setLoading] = useState(false);
  const [cardInfo, setCardInfo] = useState<CreditCardInfo>({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    name: '',
  });
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [validations, setValidations] = useState({
    number: true,
    expiry: true,
    cvv: true,
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = paymentService.formatCardNumber(e.target.value);
    setCardInfo({ ...cardInfo, number: formattedNumber });
    setValidations({
      ...validations,
      number: paymentService.validateCardNumber(formattedNumber),
    });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedCard = { ...cardInfo, [name]: value };
    setCardInfo(updatedCard);
    
    if (updatedCard.expiryMonth && updatedCard.expiryYear) {
      setValidations({
        ...validations,
        expiry: paymentService.validateExpiry(updatedCard.expiryMonth, updatedCard.expiryYear),
      });
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cvv = e.target.value;
    setCardInfo({ ...cardInfo, cvv });
    setValidations({
      ...validations,
      cvv: paymentService.validateCVV(cvv),
    });
  };

  const handleNextStep = () => {
    if (
      !validations.number ||
      !validations.expiry ||
      !validations.cvv ||
      !cardInfo.name
    ) {
      return;
    }
    setStep('billing');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await paymentService.validateCreditCard(cardInfo, billingAddress);
      onSuccess(token);
    } catch (error: any) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Payment Details</h2>
          <div className="flex items-center space-x-2">
            <LockClosedIcon className="w-5 h-5 text-electric-blue" />
            <span className="text-sm text-gray-300">Secure Payment</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 'card' ? (
              <motion.div
                key="card-info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardInfo.number}
                      onChange={handleCardNumberChange}
                      className={`input-field w-full pl-10 ${
                        !validations.number ? 'border-red-500' : ''
                      }`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    {cardInfo.number && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validations.number ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Holder */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    value={cardInfo.name}
                    onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                    className="input-field w-full"
                    placeholder="John Doe"
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expiry Date
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        name="expiryMonth"
                        value={cardInfo.expiryMonth}
                        onChange={handleExpiryChange}
                        className="input-field"
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = (i + 1).toString().padStart(2, '0');
                          return (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          );
                        })}
                      </select>
                      <select
                        name="expiryYear"
                        value={cardInfo.expiryYear}
                        onChange={handleExpiryChange}
                        className="input-field"
                      >
                        <option value="">YY</option>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = (new Date().getFullYear() + i).toString();
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      value={cardInfo.cvv}
                      onChange={handleCVVChange}
                      className={`input-field w-full ${
                        !validations.cvv ? 'border-red-500' : ''
                      }`}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary w-full"
                  disabled={!validations.number || !validations.expiry || !validations.cvv || !cardInfo.name}
                >
                  Continue
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="billing-info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={billingAddress.street}
                    onChange={(e) =>
                      setBillingAddress({ ...billingAddress, street: e.target.value })
                    }
                    className="input-field w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={billingAddress.city}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, city: e.target.value })
                      }
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      value={billingAddress.state}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, state: e.target.value })
                      }
                      className="input-field w-full"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={billingAddress.zipCode}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, zipCode: e.target.value })
                      }
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Country
                    </label>
                    <select
                      value={billingAddress.country}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, country: e.target.value })
                      }
                      className="input-field w-full"
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep('card')}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      </div>
                    ) : (
                      `Pay $${amount.toFixed(2)}`
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
