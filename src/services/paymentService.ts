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

  formatCardNumber(cardNumber: string): string {
    // Remove any non-digit characters
    const cleaned = cardNumber.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  }

  validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\D/g, '');
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  }

  validateExpiry(month: string, year: string): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);
    
    if (isNaN(expMonth) || isNaN(expYear)) return false;
    if (expMonth < 1 || expMonth > 12) return false;
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  }

  validateCVV(cvv: string): boolean {
    const cleaned = cvv.replace(/\D/g, '');
    return cleaned.length >= 3 && cleaned.length <= 4 && /^\d+$/.test(cleaned);
  }
}

export const paymentService = PaymentService.getInstance();
export type { CreditCardInfo, BillingAddress, PaymentRequest, PaymentResponse };
