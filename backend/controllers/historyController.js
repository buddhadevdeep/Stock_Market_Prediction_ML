import { Prediction } from '../models/Prediction.js';
import { getDBStatus } from '../config/db.js';

export const getAllPredictions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    if (getDBStatus()) {
      const records = await Prediction.find().sort({ createdAt: -1 }).limit(limit);
      return res.json({ predictions: records });
    } else {
      return res.json({ predictions: [] });
    }
  } catch (error) {
    next(error);
  }
};

export const clearPredictionHistory = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      await Prediction.deleteMany({});
    }
    res.json({ message: 'Prediction history cleared successfully.' });
  } catch (error) {
    next(error);
  }
};
