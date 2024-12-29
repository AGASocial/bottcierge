import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Venue,
  Product,
  Order,
  Staff,
  Table,
  OrderStatus
} from '../types';

export const mockUsers: User[] = [
  {
    id: uuidv4(),
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    authData: {
      pin: '1234',
      biometricEnabled: true
    },
    paymentMethods: [],
    favorites: [],
    orderHistory: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  }
];

export const mockVenues: Venue[] = [
  {
    id: uuidv4(),
    name: 'Luxury Lounge',
    locations: [
      {
        id: uuidv4(),
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phoneNumber: '212-555-0123',
        timezone: 'America/New_York',
        taxRate: 8.875
      }
    ],
    operatingHours: [
      {
        dayOfWeek: 1,
        open: '16:00',
        close: '02:00',
        isOpen: true
      }
    ],
    pricingRules: [],
    events: [],
    staff: [],
    minimumSpend: {
      regular: 0,
      vip: 500,
      event: 1000
    },
    dressCode: 'Smart Casual',
    status: 'active'
  }
];

export const mockProducts: Product[] = [
  {
    id: uuidv4(),
    name: 'Premium Vodka',
    description: 'Smooth, premium vodka',
    brandId: uuidv4(),
    type: 'spirit',
    image: 'https://example.com/vodka.jpg',
    inventory: {
      current: 100,
      minimum: 20,
      maximum: 200
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Shot',
        currentPrice: 12,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Double',
        currentPrice: 20,
        isAvailable: true
      }
    ]
  }
];

export const mockOrders: Order[] = [
  {
    id: uuidv4(),
    orderNumber: 'ORD-001',
    status: OrderStatus.CREATED,
    items: [],
    total: 0,
    timestamp: new Date()
  }
];

export const mockStaff: Staff[] = [
  {
    id: uuidv4(),
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'bartender',
    sections: ['main-bar'],
    isActive: true,
    status: 'active',
    metrics: {
      averageRating: 4.8,
      ordersServed: 150,
      salesVolume: 15000
    }
  }
];

export const mockTables: Table[] = [
  {
    id: uuidv4(),
    venueId: mockVenues[0].id,
    number: '101',
    qrCode: 'https://example.com/qr/101',
    category: 'vip',
    section: 'main-floor',
    capacity: {
      minimum: 2,
      maximum: 6
    },
    location: {
      floor: 1,
      position: 'center',
      coordinates: {
        x: 100,
        y: 100
      }
    },
    status: 'available',
    reservation: null,
    currentOrder: null,
    reservationHistory: []
  }
];
