import express from 'express';
import { menuCategories, mockProducts } from '../data/mockData';

const router = express.Router();

// GET /menu/categories - Get all menu categories
router.get('/categories', (req, res) => {
  try {
    res.json({
      success: true,
      data: menuCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu categories'
    });
  }
});

// GET /menu/categories/:id - Get a specific category
router.get('/categories/:id', (req, res) => {
  try {
    const category = menuCategories.find(cat => cat.id === req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category'
    });
  }
});

// GET /menu/products - Get all products
router.get('/products', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// GET /menu/products/:id - Get a specific product
router.get('/products/:id', (req, res) => {
  try {
    const product = mockProducts.find(prod => prod.id === req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// GET /menu/categories/:categoryId/products - Get products by category
router.get('/categories/:categoryId/products', (req, res) => {
  try {
    const products = mockProducts.filter(prod => prod.category === req.params.categoryId);
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products for category'
    });
  }
});

export const menuRoutes = router;
