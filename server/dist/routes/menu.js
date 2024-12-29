"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
router.get('/products', (req, res) => {
    res.json(mockData_1.mockProducts);
});
router.get('/products/:id', (req, res) => {
    const product = mockData_1.mockProducts.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});
router.put('/products/:id', (req, res) => {
    const index = mockData_1.mockProducts.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    mockData_1.mockProducts[index] = Object.assign(Object.assign({}, mockData_1.mockProducts[index]), req.body);
    res.json(mockData_1.mockProducts[index]);
});
router.patch('/products/:id/inventory', (req, res) => {
    const product = mockData_1.mockProducts.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    product.inventory = Object.assign(Object.assign({}, product.inventory), req.body);
    res.json(product);
});
exports.menuRoutes = router;
//# sourceMappingURL=menu.js.map