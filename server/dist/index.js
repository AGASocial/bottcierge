"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const venue_1 = require("./routes/venue");
const auth_1 = require("./routes/auth");
const menu_1 = require("./routes/menu");
const order_1 = require("./routes/order");
const table_1 = require("./routes/table");
const staff_1 = require("./routes/staff");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: false
}));
app.use(express_1.default.json());
app.use('/auth', auth_1.authRoutes);
app.use('/venues', venue_1.venueRoutes);
app.use('/menu', menu_1.menuRoutes);
app.use('/orders', order_1.orderRoutes);
app.use('/tables', table_1.tableRoutes);
app.use('/staff', staff_1.staffRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map