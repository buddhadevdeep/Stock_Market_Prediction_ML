import axios from 'axios';
import { stockApi, STOCK_CATALOG } from './stockApi';

const rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('stockai_token');
  const userStr = localStorage.getItem('stockai_user');
  const user = userStr ? JSON.parse(userStr) : null;
  return {
    Authorization: token ? `Bearer ${token}` : undefined,
    'x-user-email': user?.email || '',
  };
};

export const portfolioApi = {
  // Get all raw holdings for the currently logged-in user
  getUserPortfolio: async () => {
    const token = localStorage.getItem('stockai_token');
    const userStr = localStorage.getItem('stockai_user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (token && user?.email) {
      try {
        const response = await axios.get(`${API_BASE_URL}/portfolio`, {
          headers: getAuthHeaders(),
        });
        if (Array.isArray(response.data?.holdings)) {
          return response.data.holdings;
        }
      } catch (err) {
        console.warn('Backend portfolio fetch note, using local user store:', err.message);
      }
    }

    // Instant Demo / Guest user fallback (in-memory / local storage without saving to DB)
    const email = user?.email ? user.email.toLowerCase() : 'demo_guest';
    const local = localStorage.getItem(`portfolio_${email}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return [];
      }
    }
    return [];
  },

  // Calculate full portfolio summary, valuations, and algorithmic stability rank
  getPortfolioSummary: async () => {
    const rawHoldings = await portfolioApi.getUserPortfolio();
    if (!rawHoldings || rawHoldings.length === 0) {
      return {
        holdings: [],
        summary: {
          invested: 0,
          totalValue: 0,
          totalGain: 0,
          returnPct: 0,
          todayGain: 0,
          todayPct: 0,
          stabilityScore: 0,
          stabilityRank: 'EMPTY PORTFOLIO',
          stabilityDesc: '0 holdings registered. Add stocks to start computing diversification & risk rating.'
        }
      };
    }

    let totalInvested = 0;
    let totalVal = 0;
    let totalToday = 0;
    const sectorsSet = new Set();

    const liveList = await Promise.all(
      rawHoldings.map(async (h) => {
        const sym = h.symbol.toUpperCase();
        const shares = Number(h.shares) || 1;
        const avgPrice = Number(h.avgPrice) || 100;
        const invested = shares * avgPrice;

        let currentPrice = avgPrice;
        let change = 0;
        let changePercent = 0;

        try {
          const live = await stockApi.getStock(sym);
          if (live && live.price) {
            currentPrice = live.price;
            change = live.change || 0;
            changePercent = live.pctChange || 0;
            if (live.sector) sectorsSet.add(live.sector);
          }
        } catch (e) {
          // fallback to avgPrice
        }

        const currentValue = +(shares * currentPrice).toFixed(2);
        const gainLoss = +(currentValue - invested).toFixed(2);
        const todayPnl = +(shares * change).toFixed(2);

        totalInvested += invested;
        totalVal += currentValue;
        totalToday += todayPnl;

        return {
          ...h,
          symbol: sym,
          shares,
          avgPrice,
          invested,
          currentPrice,
          currentValue,
          gainLoss,
          todayPnl,
          changePercent,
        };
      })
    );

    const totalGain = +(totalVal - totalInvested).toFixed(2);
    const returnPct = +( (totalGain / (totalInvested || 1)) * 100 ).toFixed(2);
    const todayPct = +( (totalToday / (totalVal || 1)) * 100 ).toFixed(2);

    // Algorithmic Stability Rank based on holdings count, sector diversity & positive returns
    const count = liveList.length;
    const sectorCount = Math.max(1, sectorsSet.size);
    let stabilityScore = 0;
    let stabilityRank = 'EMPTY PORTFOLIO';
    let stabilityDesc = '';

    if (count === 1) {
      stabilityScore = 42;
      stabilityRank = 'SINGLE ASSET RISK';
      stabilityDesc = '1 stock held (100% concentration). Add 2+ stocks across different sectors to reduce single-asset risk.';
    } else if (count === 2) {
      stabilityScore = 68;
      stabilityRank = 'MODERATE BALANCE';
      stabilityDesc = `2 stocks held across ${sectorCount} sector${sectorCount > 1 ? 's' : ''}. Balanced foundation with moderate risk mitigation.`;
    } else if (count >= 3 && count <= 5) {
      stabilityScore = Math.min(92, 76 + sectorCount * 4 + (returnPct > 0 ? 4 : 0));
      stabilityRank = 'OPTIMAL DIVERSIFICATION';
      stabilityDesc = `${count} stocks balanced across ${sectorCount} sectors. Strong multi-asset risk mitigation and drawdown defense.`;
    } else {
      stabilityScore = Math.min(98, 86 + sectorCount * 3);
      stabilityRank = 'INSTITUTIONAL GRADE';
      stabilityDesc = `${count} stocks widely diversified across ${sectorCount} sectors with institutional drawdown defense.`;
    }

    return {
      holdings: liveList,
      summary: {
        invested: Math.round(totalInvested),
        totalValue: Math.round(totalVal),
        totalGain,
        returnPct,
        todayGain: Math.round(totalToday),
        todayPct,
        stabilityScore,
        healthScore: stabilityScore,
        stabilityRank,
        stabilityDesc,
      }
    };
  },

  // Alias getPortfolio to getPortfolioSummary
  getPortfolio: async () => {
    return await portfolioApi.getPortfolioSummary();
  },

  // Add a new stock transaction to user's portfolio
  addStock: async (stockData) => {
    const token = localStorage.getItem('stockai_token');
    const userStr = localStorage.getItem('stockai_user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (token && user?.email) {
      try {
        const response = await axios.post(`${API_BASE_URL}/portfolio`, stockData, {
          headers: getAuthHeaders(),
        });
        if (Array.isArray(response.data?.holdings)) {
          return response.data.holdings;
        }
      } catch (err) {
        console.warn('Backend add stock note, updating local store:', err.message);
      }
    }

    const email = user?.email ? user.email.toLowerCase() : 'demo_guest';
    
    const current = await portfolioApi.getUserPortfolio();
    const cleanSym = stockData.symbol.toUpperCase();
    const existingIdx = current.findIndex(h => h.symbol === cleanSym);
    let updated;

    if (existingIdx >= 0) {
      const existing = current[existingIdx];
      const totalExistingValue = existing.shares * existing.avgPrice;
      const newAddedValue = stockData.shares * stockData.avgPrice;
      const totalShares = existing.shares + stockData.shares;
      const newAvgPrice = +( (totalExistingValue + newAddedValue) / totalShares ).toFixed(2);
      
      current[existingIdx] = {
        ...existing,
        shares: totalShares,
        avgPrice: newAvgPrice,
        name: stockData.name || existing.name,
      };
      updated = [...current];
    } else {
      updated = [
        {
          _id: `local_${Date.now()}`,
          ...stockData,
          symbol: cleanSym,
          buyDate: stockData.buyDate || new Date().toISOString().split('T')[0],
        },
        ...current,
      ];
    }

    localStorage.setItem(`portfolio_${email}`, JSON.stringify(updated));
    return updated;
  },

  // Remove a stock holding
  deleteStock: async (id) => {
    const token = localStorage.getItem('stockai_token');
    const userStr = localStorage.getItem('stockai_user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (token && user?.email) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/portfolio/${id}`, {
          headers: getAuthHeaders(),
        });
        if (Array.isArray(response.data?.holdings)) {
          return response.data.holdings;
        }
      } catch (err) {
        console.warn('Backend delete stock note, updating local store:', err.message);
      }
    }

    const email = user?.email ? user.email.toLowerCase() : 'demo_guest';
    
    const current = await portfolioApi.getUserPortfolio();
    const updated = current.filter((h) => h._id !== id && h.symbol !== String(id).toUpperCase());
    localStorage.setItem(`portfolio_${email}`, JSON.stringify(updated));
    return updated;
  },
};

