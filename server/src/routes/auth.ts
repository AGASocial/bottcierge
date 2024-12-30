import express from 'express';
import { mockUsers } from '../data/mockData';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  console.log(password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  // In a real app, you would verify the password here
  return res.json({
    success: true,
    data: user,
    token: 'mock-jwt-token'
  });
});

// Register
router.post('/register', (req, res) => {
  const { email } = req.body;
  const existingUser = mockUsers.find(u => u.email === email);
  
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  
  const newUser = {
    ...req.body,
    id: Math.random().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  };
  
  mockUsers.push(newUser);
  return res.status(201).json({
    success: true,
    data: newUser,
    token: 'mock-jwt-token'
  });
});

// Get current user
router.get('/me', (req, res) => {
  // In a real app, you would get the user from the JWT token
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token || token !== 'mock-jwt-token') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  res.json({
    success: true,
    data: mockUsers[0]
  });
});

export const authRoutes = router;
