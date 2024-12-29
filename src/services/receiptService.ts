import axios from 'axios';
import { format } from 'date-fns';
import type { OrderItem } from '../types';

interface ReceiptDetails {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tip: number;
  total: number;
  venue: {
    name: string;
    address: string;
    phone: string;
  };
  table: {
    number: string;
    section: string;
  };
  server: {
    name: string;
  };
  paymentMethod: {
    type: string;
    last4?: string;
  };
  splitPayment?: {
    participants: {
      name: string;
      amount: number;
      items?: OrderItem[];
    }[];
  };
  timestamp: string;
}

interface EmailReceipt {
  email: string;
  receiptDetails: ReceiptDetails;
}

class ReceiptService {
  private static instance: ReceiptService;
  private baseUrl: string = '/api/receipts';

  private constructor() {}

  public static getInstance(): ReceiptService {
    if (!ReceiptService.instance) {
      ReceiptService.instance = new ReceiptService();
    }
    return ReceiptService.instance;
  }

  public async generateReceipt(details: ReceiptDetails): Promise<Blob> {
    try {
      const response = await axios.post(`${this.baseUrl}/generate`, details, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate receipt');
    }
  }

  public async emailReceipt(data: EmailReceipt): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/email`, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to email receipt');
    }
  }

  public async getReceiptHistory(orderNumber: string): Promise<ReceiptDetails[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/history/${orderNumber}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch receipt history');
    }
  }

  public formatReceiptNumber(orderNumber: string): string {
    return `RCP-${orderNumber}-${format(new Date(), 'yyyyMMdd')}`;
  }

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  public formatDateTime(timestamp: string): string {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  }
}

export const receiptService = ReceiptService.getInstance();
export type { ReceiptDetails, EmailReceipt };
