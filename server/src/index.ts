import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { venueRoutes } from './routes/venue';
import { authRoutes } from './routes/auth';
import { menuRoutes } from './routes/menu';
import { orderRoutes } from './routes/order';
import { tableRoutes } from './routes/table';
import { staffRoutes } from './routes/staff';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS to be more permissive
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mount routes
app.use('/auth', authRoutes);
app.use('/venues', venueRoutes);
app.use('/menu', menuRoutes);
app.use('/orders', orderRoutes);
app.use('/tables', tableRoutes);
app.use('/staff', staffRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
