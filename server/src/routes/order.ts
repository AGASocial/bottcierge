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
router.patch('/:id/status', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  order.status = req.body.status;
  res.json(order);
});

// Add item to order
router.post('/:id/items', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  order.items.push({ ...req.body, id: uuidv4() });
  order.total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json(order);
});

// Remove item from order
router.delete('/:orderId/items/:itemId', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  const itemIndex = order.items.findIndex(item => item.id === req.params.itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  
  order.items.splice(itemIndex, 1);
  order.total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json(order);
});

export const orderRoutes = router;
