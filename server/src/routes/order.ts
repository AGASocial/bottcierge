import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockOrders } from '../data/mockData';
import { OrderStatus } from '../types';

const router = express.Router();

// Get all orders
router.get('/', (req, res) => {
  res.json(mockOrders);
});

// Get order by ID
router.get('/:id', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

// Create new order
router.post('/', (req, res) => {
  const newOrder = {
    id: uuidv4(),
    orderNumber: `ORD-${Math.floor(Math.random() * 1000)}`,
    status: OrderStatus.CREATED,
    items: [],
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...req.body
  };
  mockOrders.push(newOrder);
  res.status(201).json(newOrder);
});

// Update order status
router.patch('/:id', (req, res) => {
  var order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    const newOrder = {
      id: req.params.id,
      orderNumber: `ORD-${Math.floor(Math.random() * 1000)}`,
      status: OrderStatus.CREATED,
      items: [],
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...req.body
    };
    mockOrders.push(newOrder);
    // return res.status(404).json({ message: 'Order not found' });
  }
  order = mockOrders.find(o => o.id === req.params.id);
  order!.status = req.body.status;
  res.json(order);
});

// Add item to order
router.post('/:id/items', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Check if item already exists in order
  const existingItem = order.items.find(item =>
    item.productId === req.body.productId &&
    item.size === req.body.size
  );

  if (existingItem) {
    existingItem.quantity += req.body.quantity;
  } else {
    order.items.push({ ...req.body, id: uuidv4() });
  }

  order.total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json(order);
});

// Remove item from order
router.delete('/:orderId/items/:itemId', (req, res) => {
  const { orderId, itemId } = req.params;
  const order = mockOrders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const itemIndex = order.items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const item = order.items[itemIndex];

  // Decrease quantity by 1
  item.quantity--;

  // Remove item if quantity reaches 0
  if (item.quantity <= 0) {
    order.items.splice(itemIndex, 1);
  }

  // Update order total
  order.total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.json(order);
});

export const orderRoutes = router;
