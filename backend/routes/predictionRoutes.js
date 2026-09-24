import express from 'express';
import { createPrediction, getPredictionHistoryBySymbol } from '../controllers/predictionController.js';

const router = express.Router();

router.post('/', createPrediction);
router.get('/:symbol/history', getPredictionHistoryBySymbol);

export default router;
