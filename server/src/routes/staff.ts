import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockStaff } from '../data/mockData';

const router = express.Router();

// Get all staff
router.get('/', (req, res) => {
  res.json(mockStaff);
});

// Get staff member by ID
router.get('/:id', (req, res) => {
  const staff = mockStaff.find(s => s.id === req.params.id);
  if (!staff) {
    return res.status(404).json({ message: 'Staff member not found' });
  }
  res.json(staff);
});

// Create new staff member
router.post('/', (req, res) => {
  const newStaff = {
    id: uuidv4(),
    metrics: {
      averageRating: 0,
      ordersServed: 0,
      salesVolume: 0
    },
    isActive: true,
    status: 'active' as const,
    ...req.body
  };
  mockStaff.push(newStaff);
  res.status(201).json(newStaff);
});

// Update staff member
router.put('/:id', (req, res) => {
  const index = mockStaff.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Staff member not found' });
  }
  mockStaff[index] = { ...mockStaff[index], ...req.body };
  res.json(mockStaff[index]);
});

// Update staff metrics
router.patch('/:id/metrics', (req, res) => {
  const staff = mockStaff.find(s => s.id === req.params.id);
  if (!staff) {
    return res.status(404).json({ message: 'Staff member not found' });
  }
  staff.metrics = { ...staff.metrics, ...req.body };
  res.json(staff);
});

// Deactivate staff member
router.post('/:id/deactivate', (req, res) => {
  const staff = mockStaff.find(s => s.id === req.params.id);
  if (!staff) {
    return res.status(404).json({ message: 'Staff member not found' });
  }
  staff.isActive = false;
  staff.status = 'inactive';
  res.json(staff);
});

export const staffRoutes = router;
