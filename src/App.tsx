import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Table from "./pages/Table";
import TableScan from "./pages/TableScan";
import Profile from "./pages/Profile";
import NightlifePreferences from "./pages/NightlifePreferences";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import Receipt from "./pages/Receipt";
import ProductDetails from "./pages/ProductDetails";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { getCurrentUser } from "./store/slices/authSlice";
import { websocketService } from "./services/websocketService";
import { getOrders, updateOrderStatusSocket } from "./store/slices/orderSlice";
import type { AppDispatch, RootState } from "./store";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { orderHistory } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    // dispatch(getCurrentUser());

    // Initialize WebSocket connection
    websocketService.initialize(dispatch);

    // Subscribe to all orders for real-time updates
    websocketService.subscribeToAllOrders();

    // Listen for individual order status updates
    websocketService.onOrderStatusUpdate((update) => {
      console.log("Received order status update:", update);

      // Update the order in Redux store
      dispatch(updateOrderStatusSocket(update));

      // // Fetch fresh order data
      // dispatch(getOrders());

      // Show toast notification for status change
      const statusMessages: { [key: string]: string } = {
        paid: "Order received and paid! 🎉",
        accepted: "Your order has been accepted! 🎉",
        preparing: "Your order is being prepared! 👨‍🍳",
        ready: "Your order is ready! 🍸",
        serving: "Your order is on its way! 🏃‍♂️",
        completed: "Your order has been delivered! ✅",
        cancelled: "Your order has been cancelled. 😢",
      };

      const message = statusMessages[update.status.toLowerCase()];
      if (message) {
        console.log("Showing toast notification:", message);
        toast.success(message, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#dedede",
            color: "#000",
            borderRadius: "10px",
          },
        });
      }
    });

    return () => {
      websocketService.cleanup();
    };
  }, [dispatch]);

  // Subscribe to individual active orders
  useEffect(() => {
    // const token = localStorage.getItem('token');
    if (!orderHistory) return;

    console.log("Setting up order subscriptions for:", orderHistory);

    // Subscribe to updates for all active orders
    orderHistory.forEach((order) => {
      if (
        ["paid", "accepted", "preparing", "ready", "serving"].includes(
          order.status.toLowerCase()
        )
      ) {
        console.log("Subscribing to order:", order.id);
        websocketService.subscribeToOrder(order.id);
      }
    });

    // Cleanup function to unsubscribe from orders
    return () => {
      orderHistory.forEach((order) => {
        websocketService.unsubscribeFromOrder(order.id);
      });
    };
  }, [orderHistory]);

  // Fetch fresh order data when status changes
  useEffect(() => {
    if (!orderHistory) return;
    const activeOrders = orderHistory.filter((order) =>
      ["paid", "accepted", "preparing", "ready", "serving"].includes(
        order.status.toLowerCase()
      )
    );

    if (activeOrders.length > 0) {
      dispatch(getOrders());
    }
  }, [dispatch, orderHistory?.some((order) => order.status)]);

  return (
    <div className="min-h-screen bg-deep-blue text-white">
      <Toaster position="top-center" />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="menu/:productId" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="table/scan" element={<TableScan />} />
          <Route path="table/:tableId" element={<Table />} />
          <Route path="profile" element={<Profile />} />
          <Route path="preferences" element={<NightlifePreferences />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payment" element={<Payment />} />
          <Route path="receipt" element={<Receipt />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
