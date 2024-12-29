export enum OrderStatus {
  CREATED = 'created',
  AUTHORIZED = 'authorized',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  authData: {
    pin: string;
    biometricEnabled: boolean;
  };
  paymentMethods: PaymentMethod[];
  favorites: Favorite[];
  orderHistory: OrderHistory[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
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

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  size: string;
  mixers: string[];
  garnishes: string[];
  specialInstructions?: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  type: string;
  image: string;
  inventory: {
    current: number;
    minimum: number;
    maximum: number;
  };
  sizes: {
    id: string;
    name: string;
    currentPrice: number;
    isAvailable: boolean;
  }[];
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

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  timestamp: Date;
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

export interface Table {
  id: string;
  venueId: string;
  number: string;
  qrCode: string;
  category: 'regular' | 'vip' | 'booth';
  section: string;
  capacity: {
    minimum: number;
    maximum: number;
  };
  location: {
    floor: number;
    position: string;
    coordinates: {
      x: number;
      y: number;
    };
  };
  status: 'available' | 'reserved' | 'occupied' | 'maintenance';
  reservation: TableReservation | null;
  currentOrder: string | null;
  reservationHistory: ReservationHistory[];
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

export interface Venue {
  id: string;
  name: string;
  locations: VenueLocation[];
  operatingHours: OperatingHours[];
  pricingRules: PricingRule[];
  events: VenueEvent[];
  staff: Staff[];
  minimumSpend: {
    regular: number;
    vip: number;
    event: number;
  };
  dressCode: string;
  status: 'active' | 'closed' | 'special_event';
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
