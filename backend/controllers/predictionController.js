import { mlService } from '../services/mlService.js';
import { Prediction } from '../models/Prediction.js';
import { getDBStatus } from '../config/db.js';

// In-memory fallback if MongoDB is not yet configured by user
const memoryPredictions = [];

export const createPrediction = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required in request body.' });
    }

    // Request real-time prediction from Python ML Microservice
    const predictionData = await mlService.getPrediction(symbol);

    // Save in MongoDB Atlas if connected
    let savedRecord = null;
    if (getDBStatus()) {
      try {
        savedRecord = await Prediction.create({
          symbol: predictionData.symbol,
          currentPrice: predictionData.currentPrice,
          predictedHigh: predictionData.predictedHigh,
          predictedLow: predictionData.predictedLow,
          predictedRange: predictionData.predictedRange,
          direction: predictionData.direction,
          directionConfidence: predictionData.directionConfidence,
          signal: predictionData.signal,
          signalConfidence: predictionData.signalConfidence,
          baseline: predictionData.baseline,
          createdAt: new Date(),
        });
      } catch (dbErr) {
        console.warn('Could not persist to MongoDB Atlas:', dbErr.message);
      }
    } else {
      // Memory fallback
      const record = {
        _id: Date.now().toString(),
        ...predictionData,
        createdAt: new Date(),
      };
      memoryPredictions.unshift(record);
      if (memoryPredictions.length > 100) memoryPredictions.pop();
    }

    res.status(200).json({
      ...predictionData,
      persistedInDB: !!savedRecord,
    });
  } catch (error) {
    next(error);
  }
};

export const getPredictionHistoryBySymbol = async (req, res, next) => {
  try {
    const symbol = req.params.symbol?.toUpperCase();
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required.' });
    }

    if (getDBStatus()) {
      const history = await Prediction.find({
        symbol: { $regex: new RegExp(`^${symbol}`, 'i') },
      })
        .sort({ createdAt: -1 })
        .limit(30);
      return res.json({ history });
    } else {
      const filtered = memoryPredictions.filter((p) =>
        p.symbol.toUpperCase().includes(symbol.replace('.NS', ''))
      );
      return res.json({ history: filtered });
    }
  } catch (error) {
    next(error);
  }
};
