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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Stock Prediction Node/Express Backend',
    databaseConnected: getDBStatus(),
    docs: {
      health: '/api/health',
      auth: '/api/auth',
      stocks: '/api/stocks',
      predictions: '/api/predictions',
      models: '/api/models',
      portfolio: '/api/portfolio',
      history: '/api/history'
    }
  });
});

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

// Fallback aliases in case VITE_API_URL is configured without /api
app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/stocks', stockRoutes);
app.use('/predictions', predictionRoutes);
app.use('/models', modelRoutes);
app.use('/history', historyRoutes);
app.use('/health', (req, res) => res.redirect('/api/health'));

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[OK] Stock Prediction Backend server listening on http://127.0.0.1:${PORT}`);
});
