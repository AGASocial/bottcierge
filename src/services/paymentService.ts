import axios from 'axios';

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
  token: string;
  amount: number;
  orderNumber: string;
}

class PaymentService {
  private static instance: PaymentService;
  private baseUrl: string = '/api/payments';

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
      const response = await axios.post(`${this.baseUrl}/authorize`, {
        card: {
          number: cardInfo.number,
          expiryMonth: cardInfo.expiryMonth,
          expiryYear: cardInfo.expiryYear,
          cvv: cardInfo.cvv,
          name: cardInfo.name,
        },
        billing: billingAddress,
      });

      return response.data.token;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to validate credit card');
    }
  }

  public async processPayment(paymentRequest: PaymentRequest): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/charge`, paymentRequest);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Payment processing failed');
    }
  }

  // Helper method to format credit card number with spaces
  public formatCardNumber(number: string): string {
    return number.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  }

  // Helper method to validate credit card number using Luhn algorithm
  public validateCardNumber(number: string): boolean {
    const digits = number.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Helper method to validate expiry date
  public validateExpiry(month: string, year: string): boolean {
    const currentDate = new Date();
    const expiry = new Date(parseInt(year), parseInt(month) - 1);
    return expiry > currentDate;
  }

  // Helper method to validate CVV
  public validateCVV(cvv: string): boolean {
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(cvv);
  }
}

export const paymentService = PaymentService.getInstance();
export type { CreditCardInfo, BillingAddress, PaymentRequest };
