import { io, Socket } from 'socket.io-client';
import { AppDispatch } from '../store';
import { updateOrderStatusSocket } from '../store/slices/orderSlice';
import { OrderStatus } from '../types';

type OrderStatusUpdate = {
  orderId: string;
  status: OrderStatus;
};

type OrderStatusUpdateCallback = (update: OrderStatusUpdate) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private dispatch: AppDispatch | null = null;
  private isInitialized = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private subscribedOrders: Set<string> = new Set();
  private statusUpdateCallbacks: Set<OrderStatusUpdateCallback> = new Set();

  initialize(dispatch: AppDispatch) {
    if (this.isInitialized) {
      return;
    }

    this.dispatch = dispatch;
    this.isInitialized = true;
    
    // Connect to the WebSocket server
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 30000
    });

    // Listen for order status updates
    this.socket.on('orderStatusUpdate', (update: OrderStatusUpdate) => {
      console.log('Received order status update4:', update);
      if (this.dispatch) {
        console.log('Dispatching order status update to Redux');
        this.dispatch(updateOrderStatusSocket(update));
      } else {
        console.error('Dispatch not available for order status update');
      }
      // Notify all callbacks
      this.statusUpdateCallbacks.forEach(callback => callback(update));
    });

    // Listen for all orders updates
    this.socket.on('allOrders', ({ orders }) => {
      console.log('Received all orders update:', orders);
      if (this.dispatch) {
        // Update each order in the store
        orders.forEach(order => {
          this.dispatch!(updateOrderStatusSocket({
            orderId: order.id,
            status: order.status
          }));
        });
      }
    });

    // Handle connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Resubscribe to orders after reconnection
      this.subscribedOrders.forEach(orderId => {
        this.subscribeToOrder(orderId);
      });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.handleReconnect();
    });
  }

  onOrderStatusUpdate(callback: OrderStatusUpdateCallback) {
    if (this.socket) {
      this.socket.on('orderStatusUpdate', callback);
      this.statusUpdateCallbacks.add(callback);
    }
  }

  subscribeToOrder(orderId: string) {
    if (this.socket) {
      console.log('Subscribing to order:', orderId);
      this.socket.emit('subscribeToOrder', { orderId });
      this.subscribedOrders.add(orderId);
    }
  }

  unsubscribeFromOrder(orderId: string) {
    if (this.socket) {
      console.log('Unsubscribing from order:', orderId);
      this.socket.emit('unsubscribeFromOrder', { orderId });
      this.subscribedOrders.delete(orderId);
    }
  }

  subscribeToAllOrders() {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    console.log('Subscribing to all orders');
    this.socket.emit('subscribeToAllOrders');
  }

  unsubscribeFromAllOrders() {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    console.log('Unsubscribing from all orders');
    this.socket.emit('unsubscribeFromAllOrders');
  }

  subscribeToNewOrders() {
    if (this.socket) {
      console.log('Subscribing to new orders');
      this.socket.emit('subscribeToNewOrders');
    }
  }

  onNewOrder(callback: (order: any) => void) {
    if (this.socket) {
      this.socket.on('newOrder', callback);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.socket?.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  cleanup() {
    if (this.socket) {
      // Unsubscribe from all orders
      this.unsubscribeFromAllOrders();
      
      // Unsubscribe from individual orders
      this.subscribedOrders.forEach(orderId => {
        this.unsubscribeFromOrder(orderId);
      });
      
      this.socket.disconnect();
      this.socket = null;
      this.isInitialized = false;
      this.dispatch = null;
      this.subscribedOrders.clear();
      this.statusUpdateCallbacks.clear();
    }
  }
}

export const websocketService = new WebSocketService();
