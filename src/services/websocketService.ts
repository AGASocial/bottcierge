import { io, Socket } from 'socket.io-client';
import { AppDispatch } from '../store';
import { updateOrderStatusSocket } from '../store/slices/orderSlice';

class WebSocketService {
  private socket: Socket | null = null;
  private dispatch: AppDispatch | null = null;
  private isInitialized = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  initialize(dispatch: AppDispatch) {
    if (this.isInitialized) {
      return;
    }

    this.dispatch = dispatch;
    this.isInitialized = true;
    
    // Connect to the WebSocket server
    this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3002', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 30000
    });

    // Listen for order status updates
    this.socket.on('orderStatusUpdate', (data: { orderId: string; status: string }) => {
      console.log('Received order status update:', data);
      if (this.dispatch) {
        console.log('Dispatching order status update to Redux');
        this.dispatch(updateOrderStatusSocket(data));
      } else {
        console.error('Dispatch not available for order status update');
      }
    });

    // Handle connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connected', () => {
      console.log('Server confirmed connection');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.cleanup();
      }
    });
  }

  // Clean up method
  cleanup() {
    if (this.socket) {
      // Remove all listeners before disconnecting
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.isInitialized = false;
    this.dispatch = null;
    this.reconnectAttempts = 0;
  }

  // Subscribe to specific order updates
  subscribeToOrder(orderId: string) {
    if (this.socket?.connected) {
      console.log('Subscribing to order updates for order ID:', orderId);
      this.socket.emit('subscribeToOrder', { orderId });
    }
  }

  // Unsubscribe from specific order updates
  unsubscribeFromOrder(orderId: string) {
    if (this.socket?.connected) {
      console.log('Unsubscribing from order updates for order ID:', orderId);
      this.socket.emit('unsubscribeFromOrder', { orderId });
    }
  }
}

export const websocketService = new WebSocketService();
