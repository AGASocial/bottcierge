"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json(mockData_1.mockStaff);
});
router.get('/:id', (req, res) => {
    const staff = mockData_1.mockStaff.find(s => s.id === req.params.id);
    if (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
});
router.post('/', (req, res) => {
    const newStaff = Object.assign({ id: (0, uuid_1.v4)(), metrics: {
            averageRating: 0,
            ordersServed: 0,
            salesVolume: 0
        }, isActive: true, status: 'active' }, req.body);
    mockData_1.mockStaff.push(newStaff);
    res.status(201).json(newStaff);
});
router.put('/:id', (req, res) => {
    const index = mockData_1.mockStaff.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Staff member not found' });
    }
    mockData_1.mockStaff[index] = Object.assign(Object.assign({}, mockData_1.mockStaff[index]), req.body);
    res.json(mockData_1.mockStaff[index]);
});
router.patch('/:id/metrics', (req, res) => {
    const staff = mockData_1.mockStaff.find(s => s.id === req.params.id);
    if (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
    }
    staff.metrics = Object.assign(Object.assign({}, staff.metrics), req.body);
    res.json(staff);
});
router.post('/:id/deactivate', (req, res) => {
    const staff = mockData_1.mockStaff.find(s => s.id === req.params.id);
    if (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
    }
    staff.isActive = false;
    staff.status = 'inactive';
    res.json(staff);
});
exports.staffRoutes = router;
//# sourceMappingURL=staff.js.map