import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  removeItemFromOrder,
  updateOrderItemQuantity,
  updateOrder,
} from "../store/slices/orderSlice";
import type { OrderItem, Order } from "../types";
import type { RootState, AppDispatch } from "../store";

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentOrder, orderHistory } = useSelector(
    (state: RootState) => state.order
  );
  const { currentVenue } = useSelector((state: RootState) => state.venue);
  const { currentTable } = useSelector((state: RootState) => state.table);

  const total =
    currentOrder?.items.reduce(
      (sum: number, item: OrderItem) => sum + item.price * item.quantity,
      0
    ) || 0;

  const handleQuantityChange = async (itemId: string, delta: number) => {
    if (!currentOrder) return;

    const item = currentOrder.items.find((i) => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      dispatch(
        removeItemFromOrder({
          orderId: currentOrder.id,
          itemId: itemId,
        })
      );
    } else {
      dispatch(
        updateOrderItemQuantity({
          orderId: currentOrder.id,
          itemId: itemId,
          quantity: newQuantity,
        })
      );
    }
  };

  const handleCheckout = () => {
    navigate("/payment");
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "authorized":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateSubtotal = () => {
    return (
      currentOrder?.items.reduce(
        (sum, item) => sum + item.totalPrice * item.quantity,
        0
      ) || 0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateDefaultTip = () => {
    return (calculateSubtotal() + calculateTax()) * 0.2;
  };

  const calculateAdditionalTip = () => {
    return currentOrder?.additionalTip || 0;
  };

  const calculateTotalTip = () => {
    return calculateDefaultTip() + calculateAdditionalTip();
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateTotalTip();
  };

  const [localTip, setLocalTip] = React.useState<string>("");

  const handleAdditionalTipChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!currentOrder) return;

    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setLocalTip(value);
    }
  };

  return (
    <div className="min-h-screen bg-deep-blue">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/20">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/menu")}
              className="mr-4 p-2 rounded-full bg-white/5 border border-white/20 text-white hover:bg-light-blue"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Your Order</h1>
          </div>

          {!currentOrder || currentOrder.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No active order</p>
              <button
                onClick={() => navigate("/menu")}
                className="px-6 py-2 bg-white/5 border border-white/20 text-white rounded-full hover:bg-light-blue"
              >
                {currentOrder?.items.length === 0
                  ? "Add more items"
                  : "Start New Order"}
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-6">
                {currentOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/20"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-1">
                          {item.name}
                        </h3>
                        <p className="text-light-blue text-sm mb-2">
                          Price: ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="p-1 rounded-full bg-white/5 border border-white/20 text-white hover:bg-light-blue"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="text-white font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-1 rounded-full bg-white/5 border border-white/20 text-white hover:bg-light-blue"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-white font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-white mb-2">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white mb-2">
                  <span>Tax</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-white mb-2">
                  <span>Default Tip (20%)</span>
                  <span>${calculateDefaultTip().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-white mb-2">
                  <span>Additional Tip</span>
                  <div className="flex items-center space-x-2">
                    <span>$</span>
                    <input
                      type="text"
                      value={localTip}
                      onBlur={async () => {
                        if (!currentOrder) return;
                        try {
                          await dispatch(
                            updateOrder({
                              id: currentOrder.id,
                              additionalTip:
                                localTip === "" ? 0 : parseFloat(localTip),
                            })
                          ).unwrap();
                        } catch (error) {
                          console.error(
                            "Failed to update additional tip:",
                            error
                          );
                          // Reset to current value on error
                          setLocalTip(
                            currentOrder.additionalTip?.toString() || ""
                          );
                        }
                      }}
                      onChange={handleAdditionalTipChange}
                      className="w-20 px-2 py-1 bg-white/5 border border-white/20 rounded text-right"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-white mb-2">
                  <span>Total Tip</span>
                  <span>${calculateTotalTip().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                {orderHistory.length === 0 &&
                  currentTable &&
                  Number(currentVenue?.pricingRules[currentTable.section]) >
                    calculateSubtotal() && (
                    <div className="text-red-500 text-center pt-4">
                      Table minimum: $
                      {currentVenue?.pricingRules[currentTable.section]}, please
                      add more items
                    </div>
                  )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/menu")}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/20 text-white rounded-lg hover:bg-light-blue"
                >
                  Add More Items
                </button>
                {((orderHistory.length > 0) ||
                  (orderHistory.length === 0 &&
                    currentTable &&
                    Number(currentVenue?.pricingRules[currentTable.section]) <
                      calculateSubtotal())) && (
                  <button
                    onClick={handleCheckout}
                    className="flex-1 px-6 py-3 bg-white/5 border border-white/20 text-white rounded-lg hover:bg-light-blue"
                  >
                    Proceed to Payment
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
