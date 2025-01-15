import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Venue,
  Product,
  Order,
  Staff,
  Table,
  OrderStatus,
  MenuCategory
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
    name: 'Grey Goose Vodka',
    description: 'Premium French vodka with exceptional smoothness. Distilled in France. Bottled in the US.',
    brand: 'Grey Goose',
    category: 'bottle-list',
    section: 'alcohol',
    brandId: uuidv4(),
    type: 'spirit',
    image: 'https://robohash.org/grey-goose.jpg',
    inventory: {
      current: 100,
      minimum: 20,
      maximum: 200
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Shot',
        currentPrice: 14,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Double',
        currentPrice: 24,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Bottle',
        currentPrice: 350,
        isAvailable: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Patrón Silver',
    description: 'Ultra-premium tequila, crystal clear with crisp agave flavor',
    brand: 'Patrón',
    category: 'bottle-list',
    section: 'alcohol',
    brandId: uuidv4(),
    type: 'spirit',
    image: 'https://robohash.org/patron-silver.jpg',
    inventory: {
      current: 80,
      minimum: 15,
      maximum: 150
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Shot',
        currentPrice: 16,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Double',
        currentPrice: 28,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Bottle',
        currentPrice: 400,
        isAvailable: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Macallan 12',
    description: 'Single malt Scotch whisky aged in sherry oak casks',
    brand: 'The Macallan',
    category: 'bottle-list',
    section: 'alcohol',
    brandId: uuidv4(),
    type: 'spirit',
    image: 'https://robohash.org/macallan12.jpg',
    inventory: {
      current: 50,
      minimum: 10,
      maximum: 100
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Shot',
        currentPrice: 18,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Double',
        currentPrice: 32,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Bottle',
        currentPrice: 450,
        isAvailable: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Zacapa 23',
    description: 'Premium aged rum from Guatemala',
    brand: 'Ron Zacapa',
    category: 'bottle-list',
    section: 'alcohol',
    brandId: uuidv4(),
    type: 'spirit',
    image: 'https://robohash.org/zacapa23.jpg',
    inventory: {
      current: 60,
      minimum: 12,
      maximum: 120
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Shot',
        currentPrice: 15,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Double',
        currentPrice: 26,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Bottle',
        currentPrice: 380,
        isAvailable: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Hendrick\'s Gin',
    description: 'Scottish gin infused with rose and cucumber',
    brand: 'Hendrick\'s',
    category: 'bottle-list',
    section: 'alcohol',
    brandId: uuidv4(),
    type: 'spirit',
    image: 'https://robohash.org/hendricks.jpg',
    inventory: {
      current: 70,
      minimum: 15,
      maximum: 140
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Shot',
        currentPrice: 14,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Double',
        currentPrice: 24,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Bottle',
        currentPrice: 360,
        isAvailable: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    brand: 'House Made',
    category: 'extras',
    section: 'non-alcohol',
    brandId: uuidv4(),
    type: 'juice',
    image: 'https://robohash.org/orange-juice.jpg',
    inventory: {
      current: 200,
      minimum: 50,
      maximum: 400
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Splash',
        currentPrice: 2,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Full',
        currentPrice: 6,
        isAvailable: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Cranberry Juice',
    description: 'Premium cranberry juice',
    brand: 'Ocean Spray',
    category: 'extras',
    section: 'non-alcohol',
    brandId: uuidv4(),
    type: 'juice',
    image: 'https://robohash.org/cranberry-juice.jpg',
    inventory: {
      current: 180,
      minimum: 40,
      maximum: 300
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Splash',
        currentPrice: 2,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Full',
        currentPrice: 6,
        isAvailable: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Coca-Cola',
    description: 'Classic cola',
    brand: 'Coca-Cola',
    category: 'sodas',
    section: 'non-alcohol',
    brandId: uuidv4(),
    type: 'soda',
    image: 'https://robohash.org/coca-cola.jpg',
    inventory: {
      current: 300,
      minimum: 100,
      maximum: 500
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Can',
        currentPrice: 4,
        isAvailable: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Club Soda',
    description: 'Carbonated water for mixing',
    brand: 'Schweppes',
    category: 'extras',
    section: 'non-alcohol',
    brandId: uuidv4(),
    type: 'soda',
    image: 'https://robohash.org/club-soda.jpg',
    inventory: {
      current: 250,
      minimum: 80,
      maximum: 400
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Splash',
        currentPrice: 1,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Full',
        currentPrice: 4,
        isAvailable: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Tonic Water',
    description: 'Premium tonic water',
    brand: 'Fever-Tree',
    category: 'extras',
    section: 'non-alcohol',
    brandId: uuidv4(),
    type: 'soda',
    image: 'https://robohash.org/tonic-water.jpg',
    inventory: {
      current: 200,
      minimum: 60,
      maximum: 350
    },
    sizes: [
      {
        id: uuidv4(),
        name: 'Splash',
        currentPrice: 2,
        isAvailable: true
      },
      {
        id: uuidv4(),
        name: 'Full',
        currentPrice: 5,
        isAvailable: true
      }
    ]
  }
];

export const menuCategories: MenuCategory[] = [
  {
    id: "bottle-list",
    name: "Bottle List, A La Carte",
    code: "110",
    displayOrder: 1,
    isActive: true,
    type: 'beverage'
  },
  {
    id: "vip-packages",
    name: "VIP Packages",
    code: "120",
    displayOrder: 2,
    isActive: true,
    type: 'beverage',
    parentCategoryId: "bottle-list"
  },
  {
    id: "wristband-packages",
    name: "Wristband Packages",
    code: "130",
    displayOrder: 3,
    isActive: true,
    type: 'beverage',
    parentCategoryId: "bottle-list"
  },
  {
    id: "extras",
    name: "EXTRA extras, Energy Drinks, ICE & cups",
    code: "140",
    displayOrder: 4,
    isActive: true,
    type: 'beverage'
  },
  {
    id: "parade",
    name: "Make it a Parade",
    code: "150",
    displayOrder: 5,
    isActive: true,
    type: 'beverage',
    parentCategoryId: "extras"
  }
];

export const mockOrders: Order[] = [
  {
    id: uuidv4(),
    orderNumber: 'ORD-001',
    status: OrderStatus.CANCELLED,
    items: [{
      "productId": "54f30562-d4fd-4e17-8985-63c651bb0ad2",
      "name": "Grey Goose Vodka (Shot)",
      "quantity": 1,
      "price": 14,
      "mixers": [],
      "garnishes": [],
      "size": "Shot",
      "id": "975a72b7-adf5-42e4-acc8-32f40da18598"
    }],
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date()
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
    qrCode: 'https://robohash.org/qr/101',
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
