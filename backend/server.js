import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import modelRoutes from './routes/modelRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (Graceful handling)
connectDB();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Stock Prediction Node/Express Backend',
    databaseConnected: getDBStatus(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/history', historyRoutes);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[OK] Stock Prediction Backend server listening on http://127.0.0.1:${PORT}`);
});
