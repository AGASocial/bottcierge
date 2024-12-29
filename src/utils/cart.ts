import type { OrderItem } from '../types';

export const calculateTotal = (items: OrderItem[]): number => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  return subtotal + tax;
};

export const calculateSubtotal = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateTax = (subtotal: number): number => {
  return subtotal * 0.08; // 8% tax
};
