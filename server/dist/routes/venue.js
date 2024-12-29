"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.venueRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json(mockData_1.mockVenues);
});
router.get('/:id', (req, res) => {
    const venue = mockData_1.mockVenues.find(v => v.id === req.params.id);
    if (!venue) {
        return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(venue);
});
router.put('/:id', (req, res) => {
    const index = mockData_1.mockVenues.findIndex(v => v.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Venue not found' });
    }
    mockData_1.mockVenues[index] = Object.assign(Object.assign({}, mockData_1.mockVenues[index]), req.body);
    res.json(mockData_1.mockVenues[index]);
});
exports.venueRoutes = router;
//# sourceMappingURL=venue.js.map