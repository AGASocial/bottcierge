"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const mockData_1 = require("../data/mockData");
const types_1 = require("../types");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json(mockData_1.mockOrders);
});
router.get('/:id', (req, res) => {
    const order = mockData_1.mockOrders.find(o => o.id === req.params.id);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
});
router.post('/', (req, res) => {
    const newOrder = Object.assign({ id: (0, uuid_1.v4)(), orderNumber: `ORD-${Math.floor(Math.random() * 1000)}`, status: types_1.OrderStatus.CREATED, items: [], total: 0, timestamp: new Date() }, req.body);
    mockData_1.mockOrders.push(newOrder);
    res.status(201).json(newOrder);
});
router.patch('/:id/status', (req, res) => {
    const order = mockData_1.mockOrders.find(o => o.id === req.params.id);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    order.status = req.body.status;
    res.json(order);
});
router.post('/:id/items', (req, res) => {
    const order = mockData_1.mockOrders.find(o => o.id === req.params.id);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    order.items.push(Object.assign(Object.assign({}, req.body), { id: (0, uuid_1.v4)() }));
    order.total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json(order);
});
router.delete('/:orderId/items/:itemId', (req, res) => {
    const order = mockData_1.mockOrders.find(o => o.id === req.params.orderId);
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
exports.orderRoutes = router;
//# sourceMappingURL=order.js.map