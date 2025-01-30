export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'apple_pay' | 'google_pay';
  lastFour: string;
  token: string;
  isDefault: boolean;
  expiryDate: string;
}

export interface Favorite {
  templateId: string;
  name: string;
  items: OrderItem[];
  lastUsed: Date;
}

export interface OrderHistory {
  orderId: string;
  venueId: string;
  date: Date;
  status: OrderStatus;
  total: number;
}

export interface Size {
  id: string;
  name: string;
  currentPrice: number;
  isAvailable: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  totalPrice: number;
  quantity: number;
  size: Size;
  options: Record<string, string | string[]>;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
}

export type OrderStatus =
  | 'draft'      // Initial state when user is adding items
  | 'paid'       // Payment has been processed successfully
  | 'accepted'   // Club has acknowledged the order
  | 'preparing'  // Club is preparing the drinks/items
  | 'serving'    // Order is being served/delivered to the table
  | 'completed'  // Order has been delivered and completed
  | 'cancelled'; // Order has been cancelled (can happen at any point)

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  brand: string;
  status: 'available' | 'out_of_stock';
  section: string;
  brandId: string;
  type: string;
  inventory: {
    current: number;
    minimum: number;
    maximum: number;
  };
  sizes: Size[];
}

export interface MenuCategory {
  id: string;
  name: string;
  code: string;
  displayOrder: number;
  isActive: boolean;
  parentCategoryId?: string;
  type: 'food' | 'beverage';
}

export interface Category {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Section {
  id: string;
  name: string;
}

export interface Table {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved';
  x: number;
  y: number;
  capacity: number;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  description: string;
  email?: string;
  openingHours?: OperatingHours[];
  image?: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  timezone: string;
  taxRate: number;
  status: 'open' | 'active' | 'closed' | 'special_event';
  type: 'bar' | 'restaurant' | 'cafe' | 'nightclub';
  capacity: number;
  operatingHours: OperatingHours[];
  sections: Section[];
  amenities: string[];
  tables: Table[];
  rating: number;
}

export interface VenueLocation {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  timezone: string;
  taxRate: number;
}

export interface OperatingHours {
  dayOfWeek: number;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface PricingRule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  daysApplicable: number[];
  multiplier: number;
  affectedCategories: string[];
}

export interface VenueEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  specialMenu: boolean;
  minimumSpend: number;
  specialPricing: boolean;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: 'manager' | 'server' | 'bartender';
  sections: string[];
  isActive: boolean;
  status: 'active' | 'inactive';
  metrics: {
    averageRating: number;
    ordersServed: number;
    salesVolume: number;
  };
}

export interface TableReservation {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  minimumSpend: number;
  specialRequests: string;
}

export interface ReservationHistory {
  id: string;
  date: Date;
  revenue: number;
  rating: number;
}
