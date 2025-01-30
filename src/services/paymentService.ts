import axios from 'axios';
import api from './api';

interface CreditCardInfo {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
}

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentRequest {
  orderId: string;
  method: 'card' | 'cash';
  amount: number;
  tip?: number;
  token?: string;
}

interface PaymentResponse {
  success: boolean;
  orderId: string;
  transactionId: string;
  paymentStatus: 'completed' | 'failed';
  timestamp: string;
}

class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public async validateCreditCard(
    cardInfo: CreditCardInfo,
    billingAddress: BillingAddress
  ): Promise<string> {
    try {
      const response = await api.post('/payments/validate', {
        cardInfo,
        billingAddress,
      });
      return response.data.token;
    } catch (error) {
      throw new Error('Credit card validation failed');
    }
  }

  public async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await api.post('/payments/process', paymentRequest);
      return response.data;
    } catch (error) {
      throw new Error('Payment processing failed');
    }
  }

  public async getPaymentStatus(orderId: string): Promise<PaymentResponse> {
    try {
      const response = await api.get(`/payments/status/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to get payment status');
    }
  }
}

export const paymentService = PaymentService.getInstance();
export type { CreditCardInfo, BillingAddress, PaymentRequest, PaymentResponse };
