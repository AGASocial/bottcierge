"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockTables = exports.mockStaff = exports.mockOrders = exports.mockProducts = exports.mockVenues = exports.mockUsers = void 0;
const uuid_1 = require("uuid");
const types_1 = require("../types");
exports.mockUsers = [
    {
        id: (0, uuid_1.v4)(),
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
exports.mockVenues = [
    {
        id: (0, uuid_1.v4)(),
        name: 'Luxury Lounge',
        locations: [
            {
                id: (0, uuid_1.v4)(),
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
exports.mockProducts = [
    {
        id: (0, uuid_1.v4)(),
        name: 'Premium Vodka',
        description: 'Smooth, premium vodka',
        brandId: (0, uuid_1.v4)(),
        type: 'spirit',
        image: 'https://example.com/vodka.jpg',
        inventory: {
            current: 100,
            minimum: 20,
            maximum: 200
        },
        sizes: [
            {
                id: (0, uuid_1.v4)(),
                name: 'Shot',
                currentPrice: 12,
                isAvailable: true
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'Double',
                currentPrice: 20,
                isAvailable: true
            }
        ]
    }
];
exports.mockOrders = [
    {
        id: (0, uuid_1.v4)(),
        orderNumber: 'ORD-001',
        status: types_1.OrderStatus.CREATED,
        items: [],
        total: 0,
        timestamp: new Date()
    }
];
exports.mockStaff = [
    {
        id: (0, uuid_1.v4)(),
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
exports.mockTables = [
    {
        id: (0, uuid_1.v4)(),
        venueId: exports.mockVenues[0].id,
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
//# sourceMappingURL=mockData.js.map