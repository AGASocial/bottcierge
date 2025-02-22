export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "customer";
}

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "apple_pay" | "google_pay";
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
  status: "pending" | "preparing" | "ready" | "delivered";
}

export type OrderStatusType =
  | "draft" // Initial state when user is adding items
  | "paid" // Payment has been processed successfully
  | "accepted" // Club has acknowledged the order
  | "preparing" // Club is preparing the drinks/items
  | "serving" // Order is being served/delivered to the table
  | "completed" // Order has been delivered and completed
  | "cancelled"; // Order has been cancelled (can happen at any point)

export enum OrderStatus {
  DRAFT = "draft",
  PAID = "paid",
  ACCEPTED = "accepted",
  PREPARING = "preparing",
  SERVING = "serving",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  tip: number;
  additionalTip: number;
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
  status: "available" | "out_of_stock";
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
  type: "food" | "beverage";
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

export enum TableStatus {
  AVAILABLE = "available",
  RESERVED = "reserved",
  OCCUPIED = "occupied",
  MAINTENANCE = "maintenance",
}

export enum TableType {
  ROUND = "round",
  SQUARE = "square",
  RECTANGLE = "rectangle",
  DANCE_FLOOR = "dance_floor",
  LOUNGE = "lounge",
  BAR_ADJACENT = "bar_adjacent",
  BALCONY = "balcony",
  ROOFTOP = "rooftop",
  CORNER = "corner",
  HIGH_TOP = "high_top",
  SHARED = "shared",
  BOOTH = "booth",
}

export interface Table {
  id: string;
  venueId: string;
  number: string;
  qrCode: string;
  category: "regular" | "vip";
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
  minimumSpend: number;
  status: TableStatus;
  tableType: TableType;
  reservation: TableReservation | null;
  currentOrder: string | null;
  reservationHistory: ReservationHistory[];
  userId: string;
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
  address: string;
  description?: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  timezone: string;
  operatingHours: OperatingHours[];
  pricingRules: { [key: string]: number };
  taxRate: number;
  socialMedia?: {
    [key: string]: string;
  };
  image?: string;
  email: string;
  website: string;
  status: VenueStatus;
  paymentAccepted: PaymentAccepted[];
}

export enum VenueStatus {
  ACTIVE = "Active",
  CLOSED = "Closed",
  SPECIAL_EVENT = "Special Event",
  INACTIVE = "Inactive",
}

export interface OperatingHours {
  dayOfWeek: number;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface PaymentAccepted {
  id: string;
  name: string;
  type:
    | "credit_card"
    | "apple_pay"
    | "google_pay"
    | "debit_card"
    | "cash"
    | "samsung_pay";
  isActive: boolean;
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
  [key: string]: number;
  // id: string;
  // name: string;
  // minimumSpend: number;
  // startTime: string;
  // endTime: string;
  // daysApplicable: number[];
  // multiplier: number;
  // affectedCategories: string[];
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
  role: "manager" | "server" | "bartender";
  sections: string[];
  isActive: boolean;
  status: "active" | "inactive";
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

export interface NightlifePreferences {
  id: string;
  userId: string;
  favoriteVenueTypes: string[];
  preferredMusicGenres: string[];
  preferredDrinks: string[];
  spendingRange: {
    min: number;
    max: number;
  };
  preferredNights: string[];
  updatedAt: string;
}
