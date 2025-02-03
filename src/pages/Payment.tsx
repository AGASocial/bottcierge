import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { processPayment } from "../store/slices/orderSlice";
import type { AppDispatch, RootState } from "../store";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder, error: orderError } = useSelector(
    (state: RootState) => state.order
  );
  const [selectedMethod, setSelectedMethod] = useState<"card" | "cash">("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMethodChange = (method: "card" | "cash") => {
    setSelectedMethod(method);
    setError(null);
  };

  // Redirect to cart if no order exists
  React.useEffect(() => {
    if (!currentOrder) {
      navigate("/cart");
    }
  }, [currentOrder, navigate]);

  // Don't render anything while redirecting
  if (!currentOrder) {
    return null;
  }

  const calculateSubtotal = () => {
    return currentOrder.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await dispatch(
        processPayment({
          method: selectedMethod,
          amount: calculateTotal(),
        })
      ).unwrap();

      navigate("/receipt", {
        state: {
          success: result.success,
          total: calculateTotal(),
          method: selectedMethod,
          transactionId: result.transactionId,
          timestamp: result.timestamp,
          orderId: currentOrder.id,
          items: currentOrder.items,
          error: result.success ? null : "Payment processing failed",
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment failed";
      navigate("/receipt", {
        state: {
          success: false,
          total: calculateTotal(),
          method: selectedMethod,
          error: errorMessage,
          orderId: currentOrder.id,
          items: currentOrder.items,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-blue py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto glass-card p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/cart")}
            className="mr-4 p-2 rounded-full bg-white/5 border border-white/20 text-white hover:bg-light-blue"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">Payment</h1>
        </div>

        {(error || orderError) && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-md text-white">
            {error || orderError}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">
              Payment Method
            </h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={selectedMethod === "card"}
                  onChange={() => handleMethodChange("card")}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <CreditCardIcon className="h-6 w-6 text-light-blue mr-2" />
                  <span className="text-white">Credit/Debit Card</span>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={selectedMethod === "cash"}
                  onChange={() => handleMethodChange("cash")}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <BanknotesIcon className="h-6 w-6 text-light-blue mr-2" />
                  <span className="text-white">Cash</span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-white">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-white/20">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white
                ${
                  loading
                    ? "bg-white/20 cursor-not-allowed"
                    : "bg-white/5 hover:bg-light-blue"
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue`}
          >
            {loading ? "Processing Payment..." : "Complete Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
