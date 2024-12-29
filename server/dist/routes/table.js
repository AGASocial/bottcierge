"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json(mockData_1.mockTables);
});
router.get('/:id', (req, res) => {
    const table = mockData_1.mockTables.find(t => t.id === req.params.id);
    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
});
router.patch('/:id/status', (req, res) => {
    const table = mockData_1.mockTables.find(t => t.id === req.params.id);
    if (!table) {
        return res.status(404).json({ message: 'Table not found' });
    }
    table.status = req.body.status;
    res.json(table);
});
router.post('/:id/reservations', (req, res) => {
    const table = mockData_1.mockTables.find(t => t.id === req.params.id);
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
router.delete('/:id/reservations/:reservationId', (req, res) => {
    const table = mockData_1.mockTables.find(t => t.id === req.params.id);
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
exports.tableRoutes = router;
//# sourceMappingURL=table.js.map