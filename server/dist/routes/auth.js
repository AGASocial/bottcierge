"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
router.post('/login', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const user = mockData_1.mockUsers.find(u => u.email === email);
    console.log(password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({
        user,
        token: 'mock-jwt-token'
    });
});
router.post('/register', (req, res) => {
    const { email } = req.body;
    const existingUser = mockData_1.mockUsers.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
    }
    const newUser = Object.assign(Object.assign({}, req.body), { id: Math.random().toString(), createdAt: new Date(), updatedAt: new Date(), lastLoginAt: new Date() });
    mockData_1.mockUsers.push(newUser);
    return res.status(201).json(newUser);
});
router.get('/me', (req, res) => {
    res.json(mockData_1.mockUsers[0]);
});
exports.authRoutes = router;
//# sourceMappingURL=auth.js.map