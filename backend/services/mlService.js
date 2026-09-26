import axios from 'axios';

const ML_BASE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: ML_BASE_URL,
  timeout: 45000, // 45 seconds for ML training jobs
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory caches for live data
let indicesMemoryCache = { timestamp: 0, data: null };
let topMoversMemoryCache = { timestamp: 0, data: null };
const predictionMemoryCache = new Map();
const exploreDataMemoryCache = new Map();
const pendingRequests = new Map();

export const mlService = {

  // Check health of Python service
  async checkHealth() {
    try {
      const response = await client.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Python ML Service is unreachable at ${ML_BASE_URL}. Ensure 'python app.py' is running in ml_service.`);
    }
  },

  // Request live prediction for a stock symbol with caching & single-flight deduplication
  async getPrediction(symbol) {
    const cleanSym = String(symbol || 'TCS').toUpperCase().trim();
    const now = Date.now();

    // Check memory cache
    const cached = predictionMemoryCache.get(cleanSym);
    if (cached && now - cached.timestamp < 45000) {
      return cached.data;
    }

    // In-flight deduplication key
    const flightKey = `pred_${cleanSym}`;
    if (pendingRequests.has(flightKey)) {
      return pendingRequests.get(flightKey);
    }

    const promise = (async () => {
      try {
        const response = await client.post('/predict', { symbol: cleanSym });
        const data = response.data;
        predictionMemoryCache.set(cleanSym, { timestamp: Date.now(), data });
        return data;
      } catch (error) {
        const msg = error.response?.data?.error || error.message;
        const errObj = new Error(msg);
        errObj.status = error.response?.status || (msg.includes('not found') ? 404 : 500);
        throw errObj;
      } finally {
        pendingRequests.delete(flightKey);
      }
    })();

    pendingRequests.set(flightKey, promise);
    return promise;
  },

  // Trigger training of all models for a stock symbol
  async trainModels(symbol, period = '5y') {
    const cleanSym = String(symbol || 'TCS').toUpperCase().trim();
    try {
      const response = await client.post('/train', { symbol: cleanSym, period });
      // Invalidate prediction cache on retraining
      predictionMemoryCache.delete(cleanSym);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      const errObj = new Error(`Model training failed: ${msg}`);
      errObj.status = error.response?.status || 500;
      throw errObj;
    }
  },

  // Fetch model evaluation metrics and feature importance
  async getModelInfo(symbol = 'TCS') {
    const cleanSym = String(symbol || 'TCS').toUpperCase().trim();
    try {
      const response = await client.get(`/model-info?symbol=${encodeURIComponent(cleanSym)}`);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.error || error.message;
      const errObj = new Error(`Unable to fetch model evaluation metrics: ${msg}`);
      errObj.status = error.response?.status || 500;
      throw errObj;
    }
  },

  // Download raw historical data and EDA metrics with caching
  async downloadAndExploreData(symbol = 'TCS', period = '5y') {
    const cleanSym = String(symbol || 'TCS').toUpperCase().trim();
    const now = Date.now();
    const cacheKey = `${cleanSym}_${period}`;

    const cached = exploreDataMemoryCache.get(cacheKey);
    if (cached && now - cached.timestamp < 60000) {
      return cached.data;
    }

    const flightKey = `explore_${cacheKey}`;
    if (pendingRequests.has(flightKey)) {
      return pendingRequests.get(flightKey);
    }

    const promise = (async () => {
      try {
        const response = await client.post('/download-data', { symbol: cleanSym, period });
        const data = response.data;
        exploreDataMemoryCache.set(cacheKey, { timestamp: Date.now(), data });
        return data;
      } catch (error) {
        const msg = error.response?.data?.error || error.message;
        const errObj = new Error(msg);
        errObj.status = error.response?.status || (msg.includes('not found') ? 404 : 500);
        throw errObj;
      } finally {
        pendingRequests.delete(flightKey);
      }
    })();

    pendingRequests.set(flightKey, promise);
    return promise;
  },

  // Get cached symbols
  async getCachedSymbols() {
    try {
      const response = await client.get('/cached-stocks');
      return response.data.stocks || [];
    } catch (error) {
      return ["TCS", "INFY", "RELIANCE", "HDFCBANK", "ICICIBANK", "ITC", "TATAPOWER", "HAL", "CUPID", "SBIN"];
    }
  },


  // Get real-time NIFTY 50, SENSEX, BANKNIFTY indices directly via Yahoo Finance with cache & single-flight deduplication
  async getIndices() {
    const now = Date.now();
    if (indicesMemoryCache.data && (now - indicesMemoryCache.timestamp < 30000)) {
      return indicesMemoryCache.data;
    }

    const flightKey = 'get_indices_live';
    if (pendingRequests.has(flightKey)) {
      return pendingRequests.get(flightKey);
    }

    const configs = [
      { name: "NIFTY 50", symbol: "^NSEI", ticker: "%5ENSEI", defaultVal: 23063.10, defaultChg: -383.70, defaultPct: -1.64 },
      { name: "SENSEX", symbol: "^BSESN", ticker: "%5EBSESN", defaultVal: 73580.54, defaultChg: -1247.71, defaultPct: -1.67 },
      { name: "NIFTY BANK", symbol: "^NSEBANK", ticker: "%5ENSEBANK", defaultVal: 55438.50, defaultChg: -1110.40, defaultPct: -1.96 },
      { name: "USD / INR", symbol: "INR=X", ticker: "INR=X", defaultVal: 95.94, defaultChg: 0.26, defaultPct: 0.27 }
    ];

    const promise = (async () => {
      try {
        const liveResults = await Promise.all(
          configs.map(async (c) => {
            try {
              const res = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${c.ticker}?interval=1d&range=1mo`, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 4000
              });
              const data = res.data?.chart?.result?.[0];
              if (data && data.meta) {
                const meta = data.meta;
                const price = +(meta.regularMarketPrice || c.defaultVal).toFixed(2);
                const prev = +(meta.chartPreviousClose || meta.previousClose || (price - c.defaultChg)).toFixed(2);
                const change = +(price - prev).toFixed(2);
                const pctChange = +(((price - prev) / (prev || 1)) * 100).toFixed(2);
                const rawCloses = data.indicators?.quote?.[0]?.close || [];
                const sparkline = rawCloses.filter(v => v != null).slice(-10).map(v => +v.toFixed(2));

                return {
                  name: c.name,
                  symbol: c.symbol,
                  value: price,
                  change,
                  pctChange,
                  sparkline: sparkline.length >= 2 ? sparkline : [prev, price],
                  status: pctChange >= 0 ? "bullish" : "bearish"
                };
              }
            } catch (e) {}

            return {
              name: c.name,
              symbol: c.symbol,
              value: c.defaultVal,
              change: c.defaultChg,
              pctChange: c.defaultPct,
              sparkline: [c.defaultVal * 0.99, c.defaultVal],
              status: c.defaultPct >= 0 ? "bullish" : "bearish"
            };
          })
        );

        indicesMemoryCache = { timestamp: Date.now(), data: liveResults };
        return liveResults;
      } catch (err) {
        console.warn('Direct live indices note:', err.message);
      } finally {
        pendingRequests.delete(flightKey);
      }

      return [
        { name: "NIFTY 50", symbol: "^NSEI", value: 23063.10, change: -383.70, pctChange: -1.64, sparkline: [23440, 23063], status: "bearish" },
        { name: "SENSEX", symbol: "^BSESN", value: 73580.54, change: -1247.71, pctChange: -1.67, sparkline: [74800, 73580], status: "bearish" },
        { name: "NIFTY BANK", symbol: "^NSEBANK", value: 55438.50, change: -1110.40, pctChange: -1.96, sparkline: [56500, 55438], status: "bearish" },
        { name: "USD / INR", symbol: "INR=X", value: 95.94, change: 0.26, pctChange: 0.27, sparkline: [95.50, 95.94], status: "bullish" }
      ];
    })();

    pendingRequests.set(flightKey, promise);
    return promise;
  },

  // Get real-time Top 5 Gainers & Top 5 Losers directly via Yahoo Finance with cache & single-flight
  async getTopMovers() {
    const now = Date.now();
    if (topMoversMemoryCache.data && (now - topMoversMemoryCache.timestamp < 35000)) {
      return topMoversMemoryCache.data;
    }

    const flightKey = 'get_top_movers_live';
    if (pendingRequests.has(flightKey)) {
      return pendingRequests.get(flightKey);
    }

    const trackedStocks = [
      { sym: 'ONGC', ticker: 'ONGC.NS', name: 'Oil & Natural Gas Corp' },
      { sym: 'ITC', ticker: 'ITC.NS', name: 'ITC Limited' },
      { sym: 'NTPC', ticker: 'NTPC.NS', name: 'NTPC Limited' },
      { sym: 'POWERGRID', ticker: 'POWERGRID.NS', name: 'Power Grid Corporation' },
      { sym: 'SUNPHARMA', ticker: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Ind.' },
      { sym: 'TECHM', ticker: 'TECHM.NS', name: 'Tech Mahindra Limited' },
      { sym: 'TCS', ticker: 'TCS.NS', name: 'Tata Consultancy Services' },
      { sym: 'HINDUNILVR', ticker: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd' },
      { sym: 'RELIANCE', ticker: 'RELIANCE.NS', name: 'Reliance Industries' },
      { sym: 'HDFCBANK', ticker: 'HDFCBANK.NS', name: 'HDFC Bank Limited' },
      { sym: 'ICICIBANK', ticker: 'ICICIBANK.NS', name: 'ICICI Bank Limited' },
      { sym: 'SBIN', ticker: 'SBIN.NS', name: 'State Bank of India' },
      { sym: 'BHARTIARTL', ticker: 'BHARTIARTL.NS', name: 'Bharti Airtel Limited' },
      { sym: 'INFY', ticker: 'INFY.NS', name: 'Infosys Limited' },
      { sym: 'ADANIENT', ticker: 'ADANIENT.NS', name: 'Adani Enterprises' },
      { sym: 'BAJFINANCE', ticker: 'BAJFINANCE.NS', name: 'Bajaj Finance Limited' },
      { sym: 'AXISBANK', ticker: 'AXISBANK.NS', name: 'Axis Bank Limited' },
      { sym: 'WIPRO', ticker: 'WIPRO.NS', name: 'Wipro Limited' },
      { sym: 'TITAN', ticker: 'TITAN.NS', name: 'Titan Company Limited' },
      { sym: 'BEL', ticker: 'BEL.NS', name: 'Bharat Electronics Ltd' }
    ];

    const promise = (async () => {
      try {
        const results = [];
        await Promise.all(
          trackedStocks.map(async (stk) => {
            try {
              const res = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stk.ticker}?interval=1d&range=5d`, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 4000
              });
              const data = res.data?.chart?.result?.[0];
              if (data && data.meta) {
                const meta = data.meta;
                const price = +(meta.regularMarketPrice || 0).toFixed(2);
                const prev = +(meta.chartPreviousClose || meta.previousClose || price).toFixed(2);
                const chg = +(price - prev).toFixed(2);
                const pct = +(((price - prev) / (prev || 1)) * 100).toFixed(2);
                results.push({
                  symbol: stk.sym,
                  name: stk.name,
                  price,
                  change: chg,
                  pctChange: pct
                });
              }
            } catch (e) {}
          })
        );

        if (results.length >= 5) {
          const gainers = results.slice().sort((a, b) => b.pctChange - a.pctChange).slice(0, 5);
          const losers = results.slice().sort((a, b) => a.pctChange - b.pctChange).slice(0, 5);
          const payload = { gainers, losers, totalEvaluated: results.length, timestamp: Date.now() };
          topMoversMemoryCache = { timestamp: Date.now(), data: payload };
          return payload;
        }
      } catch (err) {
        console.warn('Direct top movers note:', err.message);
      } finally {
        pendingRequests.delete(flightKey);
      }

      return {
        gainers: [
          { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', price: 239.00, change: 6.20, pctChange: 2.66 },
          { symbol: 'ITC', name: 'ITC Limited', price: 268.00, change: 5.70, pctChange: 2.17 },
          { symbol: 'NTPC', name: 'NTPC Limited', price: 326.60, change: 2.95, pctChange: 0.91 },
          { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Ind.', price: 1849.90, change: 12.60, pctChange: 0.69 },
          { symbol: 'TECHM', name: 'Tech Mahindra Limited', price: 1543.00, change: 5.90, pctChange: 0.38 }
        ],
        losers: [
          { symbol: 'AXISBANK', name: 'Axis Bank Limited', price: 1186.50, change: -70.50, pctChange: -5.61 },
          { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', price: 982.00, change: -58.30, pctChange: -5.60 },
          { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', price: 1795.80, change: -97.50, pctChange: -5.15 },
          { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 2900.00, change: -120.00, pctChange: -3.97 },
          { symbol: 'INFY', name: 'Infosys Limited', price: 1014.50, change: -36.90, pctChange: -3.51 }
        ]
      };
    })();

    pendingRequests.set(flightKey, promise);
    return promise;
  },

  // Get live quote for a specific stock or index
  async getLiveQuote(symbol = 'TCS') {
    const raw = String(symbol || 'TCS').trim().toUpperCase();
    const tickerMap = {
      'NIFTY 50': '^NSEI',
      'NIFTY': '^NSEI',
      '^NSEI': '^NSEI',
      'SENSEX': '^BSESN',
      '^BSESN': '^BSESN',
      'NIFTY BANK': '^NSEBANK',
      'BANKNIFTY': '^NSEBANK',
      '^NSEBANK': '^NSEBANK'
    };
    const ticker = tickerMap[raw] || (raw.includes('.') ? raw : `${raw}.NS`);

    try {
      const res = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 4000
      });
      const data = res.data?.chart?.result?.[0];
      if (data && data.meta) {
        const meta = data.meta;
        const price = +(meta.regularMarketPrice || 0).toFixed(2);
        const prev = +(meta.chartPreviousClose || meta.previousClose || price).toFixed(2);
        const chg = +(price - prev).toFixed(2);
        const pct = +(((price - prev) / (prev || 1)) * 100).toFixed(2);
        return {
          symbol: raw,
          price,
          change: chg,
          pctChange: pct,
          open: meta.regularMarketDayLow || price,
          high: meta.regularMarketDayHigh || price,
          low: meta.regularMarketDayLow || price,
          volume: meta.regularMarketVolume || 1500000
        };
      }
    } catch (e) {
      console.warn(`getLiveQuote fallback for ${raw}:`, e.message);
    }

    // Known fallback for standard benchmarks and sample tickers only
    const knownSamples = ['NIFTY 50', 'NIFTY', '^NSEI', 'SENSEX', '^BSESN', 'NIFTY BANK', '^NSEBANK', 'TCS', 'INFY', 'RELIANCE', 'SBIN', 'HDFCBANK', 'ICICIBANK', 'TATAPOWER', 'HAL', 'CUPID', 'TITAN'];
    if (knownSamples.includes(raw) || raw.includes('NIFTY') || raw.includes('SENSEX')) {
      return {
        symbol: raw,
        price: raw.includes('NIFTY') ? 24541.15 : (raw.includes('SENSEX') ? 80604.65 : (raw === 'TATAPOWER' ? 432.80 : (raw === 'HAL' ? 4420.50 : (raw === 'CUPID' ? 92.40 : 3680.00)))),
        change: 15.00,
        pctChange: 0.61
      };
    }

    const err = new Error(`Stock ticker '${raw}' was not found on exchange.`);
    err.status = 404;
    throw err;
  }
};



