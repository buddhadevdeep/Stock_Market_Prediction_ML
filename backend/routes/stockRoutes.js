import express from 'express';
import { getStockInfo, getExploreData, getAvailableStocks, getLiveIndices, getLiveQuote, getTopMovers } from '../controllers/stockController.js';

const router = express.Router();

router.get('/available', getAvailableStocks);
router.get('/indices', getLiveIndices);
router.get('/top-movers', getTopMovers);
router.get('/quote', getLiveQuote);
router.post('/explore', getExploreData);
router.get('/:symbol', getStockInfo);

export default router;


