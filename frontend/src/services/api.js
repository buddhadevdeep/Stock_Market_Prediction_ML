import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Get health status
  async getHealth() {
    const res = await client.get('/health');
    return res.data;
  },

  // Get list of available/cached stocks
  async getAvailableStocks() {
    try {
      const res = await client.get('/stocks/available');
      return res.data.stocks || [];
    } catch {
      return ["TCS", "INFY", "RELIANCE", "HDFCBANK", "ICICIBANK", "ITC", "TATAMOTORS", "SBIN", "WIPRO", "BEL"];
    }
  },

  // Request prediction for a symbol
  async getPrediction(symbol) {
    const res = await client.post('/predictions', { symbol });
    return res.data;
  },

  // Get historical dataset & EDA statistics (Phase 1 & 2)
  async getExploreData(symbol, period = '5y') {
    const res = await client.post('/stocks/explore', { symbol, period });
    return res.data;
  },

  // Get model evaluation results (Phase 4 & 5)
  async getModelResults(symbol = 'TCS') {
    const res = await client.get(`/models/results?symbol=${encodeURIComponent(symbol)}`);
    return res.data;
  },

  // Trigger model training (Phase 3 & 5)
  async trainModel(symbol, period = '5y') {
    const res = await client.post('/models/train', { symbol, period });
    return res.data;
  },

  // Get prediction search history
  async getHistory(limit = 30) {
    const res = await client.get(`/history?limit=${limit}`);
    return res.data.predictions || [];
  },

  // Clear prediction history
  async clearHistory() {
    const res = await client.delete('/history');
    return res.data;
  }
};

export default api;
