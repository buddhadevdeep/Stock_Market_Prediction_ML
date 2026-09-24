import { mlService } from '../services/mlService.js';
import { StockSearch } from '../models/StockSearch.js';
import { getDBStatus } from '../config/db.js';

// In-memory fallback cache
const searchHistoryMemory = [];

export const getStockInfo = async (req, res, next) => {
  try {
    const symbol = req.params.symbol?.toUpperCase();
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required.' });
    }

    // Record search in DB if connected
    if (getDBStatus()) {
      StockSearch.create({ symbol }).catch(() => {});
    } else {
      searchHistoryMemory.unshift({ symbol, searchedAt: new Date() });
      if (searchHistoryMemory.length > 50) searchHistoryMemory.pop();
    }

    const data = await mlService.downloadAndExploreData(symbol, req.query.period || '1y');
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getExploreData = async (req, res, next) => {
  try {
    const { symbol = 'TCS', period = '5y' } = req.body;
    const data = await mlService.downloadAndExploreData(symbol, period);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getAvailableStocks = async (req, res, next) => {
  try {
    const stocks = await mlService.getCachedSymbols();
    res.json({ stocks });
  } catch (error) {
    res.json({ stocks: ["TCS", "INFY", "RELIANCE", "HDFCBANK", "ICICIBANK", "ITC", "TATAMOTORS"] });
  }
};

export const getLiveIndices = async (req, res, next) => {
  try {
    const data = await mlService.getIndices();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getLiveQuote = async (req, res, next) => {
  try {
    const symbol = req.query.symbol || req.params.symbol || 'TCS';
    const data = await mlService.getLiveQuote(symbol);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getTopMovers = async (req, res, next) => {
  try {
    const data = await mlService.getTopMovers();
    res.json(data);
  } catch (error) {
    next(error);
  }
};


