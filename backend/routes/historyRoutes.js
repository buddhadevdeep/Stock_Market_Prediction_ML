import express from 'express';
import { getAllPredictions, clearPredictionHistory } from '../controllers/historyController.js';

const router = express.Router();

router.get('/', getAllPredictions);
router.delete('/', clearPredictionHistory);

export default router;
