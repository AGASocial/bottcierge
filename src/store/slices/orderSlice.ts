import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { paymentService } from "../../services/paymentService";
import type { Order, OrderItem, OrderStatus } from "../../types";
import type { RootState } from "../index";

interface OrderState {
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  orderHistory: Order[];

  groupOrderStatus: {
    isHost: boolean;
    participants: {
      userId: string;
      name: string;
      status: "pending" | "ready" | "paid";
    }[];
  } | null;
}

const initialState: OrderState = {
  currentOrder: null,
  loading: false,
  error: null,
  orderHistory: [],

  groupOrderStatus: null,
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: { venueId: string; tableId: string; type: string }) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  }
);

export const getOrders = createAsyncThunk("order/getOrders", async () => {
  const response = await api.get("/orders");
  return response.data;
});

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  }
);

export const addItemToOrder = createAsyncThunk(
  "order/addItem",
  async ({
    orderId,
    item,
  }: {
    orderId: string;
    item: Omit<OrderItem, "id">;
  }) => {
    const response = await api.post(`/orders/${orderId}/items`, item);
    return response.data;
  }
);

export const removeItemFromOrder = createAsyncThunk(
  "order/removeItem",
  async ({ orderId, itemId }: { orderId: string; itemId: string }) => {
    const response = await api.delete(`/orders/${orderId}/items/${itemId}`);
    return response.data;
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (orderData: Partial<Order>) => {
    const response = await api.put(`/orders/${orderData.id}`, orderData);
    return response.data;
  }
);

export const updateOrderItemQuantity = createAsyncThunk(
  "order/updateItemQuantity",
  async (
    {
      orderId,
      itemId,
      quantity,
    }: { orderId: string; itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/orders/${orderId}/items/${itemId}`, {
        quantity,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update item quantity"
      );
    }
  }
);

export const processPayment = createAsyncThunk(
  "order/processPayment",
  async (
    paymentDetails: { method: "card" | "cash"; amount: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const { currentOrder } = state.order;

      if (!currentOrder) {
        throw new Error("No active order found");
      }

      const paymentRequest = {
        orderId: currentOrder.id,
        method: paymentDetails.method,
        amount: paymentDetails.amount,
      };

      const response = await paymentService.processPayment(paymentRequest);

      if (!response.success) {
        throw new Error("Payment failed");
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Payment processing failed");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearCart: (state) => {
      if (state.currentOrder) {
        state.currentOrder.items = [];
      }
    },
    removeFromCart: (state, action) => {
      if (state.currentOrder) {
        state.currentOrder.items = state.currentOrder.items.filter(
          (item) => item.id !== action.payload
        );
      }
    },
    updateItemQuantity: (state, action) => {
      if (state.currentOrder) {
        console.log("Updating quantity:", action.payload);
        const { id, quantity } = action.payload;
        const item = state.currentOrder.items.find((item) => item.id === id);
        if (item) {
          item.quantity = quantity;
          // Recalculate total
          state.currentOrder.total = state.currentOrder.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    updateOrderStatusSocket: (state, action) => {
      const { orderId, status } = action.payload;
      console.log("Updating order status in Redux:", { orderId, status });

      // Update in order history
      const orderExists = state.orderHistory.some(
        (order) => order.id === orderId
      );

      if (orderExists) {
        state.orderHistory = state.orderHistory.map((order) =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        );
        console.log("Updated order in history");
      } else {
        console.log("Order not found in history, fetching fresh data");
        // If we don't have the order in history, we should fetch fresh data
        state.loading = true;
      }

      // Update current order if it matches
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder = {
          ...state.currentOrder,
          status,
          updatedAt: new Date().toISOString(),
        };
        console.log("Updated current order");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create order";
      })
      // Get orders
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to get orders";
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        if (action.payload.status === ("completed" as OrderStatus)) {
          state.orderHistory.unshift(action.payload);
          state.currentOrder = null;
        }
      })
      // Update order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update order";
      })
      // Add item to order
      .addCase(addItemToOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      // Remove item from order
      .addCase(removeItemFromOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state) => {
        state.loading = false;
        state.currentOrder = null;
      })
      .addCase(updateOrderItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(updateOrderItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Payment failed";
      });
  },
});

export const {
  clearCart,
  removeFromCart,
  updateItemQuantity,
  clearError,
  updateOrderStatusSocket,
} = orderSlice.actions;

export default orderSlice.reducer;
