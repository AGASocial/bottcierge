import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon,
  QrCodeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { getTableById, setQRScanning } from "../store/slices/tableSlice";
import { createOrder } from "../store/slices/orderSlice";
import QRScanner from "../components/scanner/QRScanner";
import Cart from "../components/cart/Cart";
import QuickActions from "../components/table/QuickActions";
import type { AppDispatch, RootState } from "../store";
import { useNavigate } from "react-router-dom";

const Table: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const { selectedTable: currentTable, qrScanning } = useSelector(
    (state: RootState) => state.table
  );
  const { currentVenue } = useSelector((state: RootState) => state.venue);
  const {
    currentOrder,
    loading: orderLoading,
    error: orderError,
  } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (tableId) {
      dispatch(getTableById(tableId));
    }
  }, [dispatch, tableId]);

  const handleStartOrder = async () => {
    console.log("Handling start order", currentTable);
    console.log("Handling start order", currentVenue);
    if (!currentTable || !currentVenue) return;

    try {
      setIsCreatingOrder(true);
      const result = await dispatch(
        createOrder({
          venueId: currentVenue.id,
          tableId: currentTable.id,
          type: "regular",
        })
      ).unwrap();

      // Only navigate if the order was created successfully
      if (result) {
        navigate("/menu");
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleAddMoreItems = () => {
    navigate("/menu");
  };

  const renderTableStatus = (table: typeof currentTable) => {
    if (!table) return null;

    const colors = {
      available: "bg-green-400",
      occupied: "bg-red-400",
      reserved: "bg-yellow-400",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[table.status]
        }`}
      >
        {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
      </span>
    );
  };

  if (!currentTable) {
    return <div>Loading...</div>;
  }

  const canStartOrder = !isCreatingOrder && !currentOrder;

  return (
    <div className="min-h-screen bg-deep-blue">
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white/20">
          {orderError && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-md text-white">
              {orderError}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Table {currentTable?.number}
              </h1>
              <p className="text-light-blue">Welcome! Ready to order?</p>
              {renderTableStatus(currentTable)}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/cart")}
                className="inline-flex items-center px-4 py-2 border border-white/20 shadow-sm text-sm font-medium rounded-md text-white bg-white/5 hover:bg-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                View Cart
                {currentOrder && currentOrder.items.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-light-blue rounded-full">
                    {currentOrder.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <UsersIcon className="h-6 w-6 mr-2 text-white" />
                <h2 className="text-lg font-semibold text-white">
                  Table Information
                </h2>
              </div>
              <div className="space-y-2 text-white/90">
                <p>Capacity: {currentTable?.capacity} people</p>
                {currentTable?.status && (
                  <p>
                    Status:{" "}
                    {currentTable.status.charAt(0).toUpperCase() +
                      currentTable.status.slice(1)}
                  </p>
                )}
              </div>
            </div>

            {/* Add QuickActions component */}
            <QuickActions tableId={currentTable.id} />
          </div>

          <div className="mt-6">
            {canStartOrder ? (
              <button
                onClick={handleStartOrder}
                disabled={isCreatingOrder}
                className={`w-full flex justify-center py-3 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white 
                  ${
                    isCreatingOrder
                      ? "bg-white/20 cursor-not-allowed"
                      : "bg-white/5 hover:bg-light-blue"
                  } 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue`}
              >
                {isCreatingOrder ? "Creating Order..." : "Start Order"}
              </button>
            ) : currentOrder ? (
              <button
                onClick={handleAddMoreItems}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-light-blue rounded-md 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue"
              >
                Add more items
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {qrScanning && (
          <QRScanner
            isOpen={qrScanning}
            onClose={() => dispatch(setQRScanning(false))}
            onScan={async (tableId) => {
              await dispatch(getTableById(tableId));
              dispatch(setQRScanning(false));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Table;
