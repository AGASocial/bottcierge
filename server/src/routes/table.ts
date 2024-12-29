import express from 'express';
import { mockTables } from '../data/mockData';

const router = express.Router();

// Get all tables
router.get('/', (req, res) => {
  res.json(mockTables);
});

// Get table by ID
router.get('/:id', (req, res) => {
  const table = mockTables.find(t => t.id === req.params.id);
  if (!table) {
    return res.status(404).json({ message: 'Table not found' });
  }
  res.json(table);
});

// Update table status
router.patch('/:id/status', (req, res) => {
  const table = mockTables.find(t => t.id === req.params.id);
  if (!table) {
    return res.status(404).json({ message: 'Table not found' });
  }
  table.status = req.body.status;
  res.json(table);
});

// Create reservation
router.post('/:id/reservations', (req, res) => {
  const table = mockTables.find(t => t.id === req.params.id);
  if (!table) {
    return res.status(404).json({ message: 'Table not found' });
  }
  if (table.status !== 'available') {
    return res.status(400).json({ message: 'Table is not available' });
  }
  table.reservation = req.body;
  table.status = 'reserved';
  res.json(table);
});

// Cancel reservation
router.delete('/:id/reservations/:reservationId', (req, res) => {
  const table = mockTables.find(t => t.id === req.params.id);
  if (!table) {
    return res.status(404).json({ message: 'Table not found' });
  }
  if (!table.reservation || table.reservation.id !== req.params.reservationId) {
    return res.status(404).json({ message: 'Reservation not found' });
  }
  table.reservation = null;
  table.status = 'available';
  res.json(table);
});

export const tableRoutes = router;
