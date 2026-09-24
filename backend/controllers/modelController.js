import { mlService } from '../services/mlService.js';
import { ModelResult } from '../models/ModelResult.js';
import { getDBStatus } from '../config/db.js';

const memoryModelResults = [];

export const trainModel = async (req, res, next) => {
  try {
    const { symbol = 'TCS', period = '5y' } = req.body;
    const trainResult = await mlService.trainModels(symbol, period);

    if (getDBStatus() && trainResult.metrics) {
      try {
        await ModelResult.create({
          symbol,
          task: 'full_pipeline',
          metrics: trainResult.metrics,
          datasetSize: trainResult.metrics.dataset_info?.total_records,
          trainedAt: new Date(),
        });
      } catch (e) {
        console.warn('MongoDB save warning for ModelResult:', e.message);
      }
    } else if (trainResult.metrics) {
      memoryModelResults.unshift({
        symbol,
        metrics: trainResult.metrics,
        trainedAt: new Date(),
      });
    }

    res.json(trainResult);
  } catch (error) {
    next(error);
  }
};

export const getModelResults = async (req, res, next) => {
  try {
    const symbol = req.query.symbol || 'TCS';
    const info = await mlService.getModelInfo(symbol);
    res.json(info);
  } catch (error) {
    next(error);
  }
};
