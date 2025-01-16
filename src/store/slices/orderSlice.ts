import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Order, OrderItem, OrderStatus } from '../../types';

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
      status: 'pending' | 'ready' | 'paid';
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
  'order/createOrder',
  async (orderData: { venueId: string; tableId: string; type: string }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  }
);

export const getOrders = createAsyncThunk(
  'order/getOrders',
  async () => {
    const response = await api.get('/orders');
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  }
);

export const addItemToOrder = createAsyncThunk(
  'order/addItem',
  async ({ orderId, item }: { orderId: string; item: Omit<OrderItem, 'id'> }) => {
    const response = await api.post(`/orders/${orderId}/items`, item);
    return response.data;
  }
);

export const removeItemFromOrder = createAsyncThunk(
  'order/removeItem',
  async ({ orderId, itemId }: { orderId: string; itemId: string }) => {
    const response = await api.delete(`/orders/${orderId}/items/${itemId}`);
    return response.data;
  }
);

export const processPayment = createAsyncThunk(
  'order/processPayment',
  async ({ method, amount }: { method: 'card' | 'cash'; amount: number }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCart: (state) => {
      if (state.currentOrder) {
        state.currentOrder.items = [];
      }
    },
    removeFromCart: (state, action) => {
      if (state.currentOrder) {
        state.currentOrder.items = state.currentOrder.items.filter(item => item.id !== action.payload);
      }
    },
    updateItemQuantity: (state, action) => {
      if (state.currentOrder) {
        const { id, quantity } = action.payload;
        const item = state.currentOrder.items.find(item => item.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
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
        state.error = action.error.message || 'Failed to create order';
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
        state.error = action.error.message || 'Failed to get orders';
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        if (action.payload.status === 'completed' as OrderStatus) {
          state.orderHistory.unshift(action.payload);
          state.currentOrder = null;
        }
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
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Payment failed';
      });
  },
});

export const { clearCart, removeFromCart, updateItemQuantity, clearError } = orderSlice.actions;

export default orderSlice.reducer;
