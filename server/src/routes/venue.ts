import express from 'express';
import { mockVenues } from '../data/mockData';

const router = express.Router();

// Get all venues
router.get('/', (req, res) => {
  res.json(mockVenues);
});

// Get venue by ID
router.get('/:id', (req, res) => {
  const venue = mockVenues.find(v => v.id === req.params.id);
  if (!venue) {
    return res.status(404).json({ message: 'Venue not found' });
  }
  res.json(venue);
});

// Update venue
router.put('/:id', (req, res) => {
  const index = mockVenues.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Venue not found' });
  }
  mockVenues[index] = { ...mockVenues[index], ...req.body };
  res.json(mockVenues[index]);
});

export const venueRoutes = router;
