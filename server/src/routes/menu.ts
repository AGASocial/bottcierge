import express from 'express';
import { mockProducts } from '../data/mockData';

const router = express.Router();

// Get all products
router.get('/products', (req, res) => {
  res.json(mockProducts);
});

// Get product by ID
router.get('/products/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Update product
router.put('/products/:id', (req, res) => {
  const index = mockProducts.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  mockProducts[index] = { ...mockProducts[index], ...req.body };
  res.json(mockProducts[index]);
});

// Update product inventory
router.patch('/products/:id/inventory', (req, res) => {
  const product = mockProducts.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  product.inventory = { ...product.inventory, ...req.body };
  res.json(product);
});

export const menuRoutes = router;
