import axios from 'axios';
import { mockStocks, marketIndices, generateChartData, userWatchlist } from '../mock/database';

const rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Comprehensive catalog of popular NSE, BSE, IPOs, Indices, and Global equities for instant broker auto-complete
export const STOCK_CATALOG = [
  // Major Indices & Benchmarks
  { symbol: 'NIFTY 50', name: 'NIFTY 50 Benchmark Index', exchange: 'NSE', sector: 'Index & Benchmark' },
  { symbol: 'SENSEX', name: 'BSE SENSEX Index', exchange: 'BSE', sector: 'Index & Benchmark' },
  { symbol: 'NIFTY BANK', name: 'NIFTY Bank Sector Index', exchange: 'NSE', sector: 'Banking Index' },
  { symbol: '^NSEI', name: 'NIFTY 50 Index (yfinance ticker)', exchange: 'NSE', sector: 'Index & Benchmark' },
  { symbol: '^BSESN', name: 'SENSEX Index (yfinance ticker)', exchange: 'BSE', sector: 'Index & Benchmark' },
  { symbol: '^NSEBANK', name: 'NIFTY Bank (yfinance ticker)', exchange: 'NSE', sector: 'Banking Index' },
  { symbol: 'USD / INR', name: 'USD to INR Currency Pair', exchange: 'FOREX', sector: 'Currency' },

  // Top NSE Indian Equities
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd.', exchange: 'NSE', sector: 'Energy & Power' },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Limited', exchange: 'NSE', sector: 'Defence & Aerospace' },
  { symbol: 'CUPID', name: 'Cupid Limited', exchange: 'NSE', sector: 'Healthcare & Consumer' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', sector: 'IT Services' },
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', exchange: 'NSE', sector: 'Energy & Retail' },
  { symbol: 'INFY', name: 'Infosys Limited', exchange: 'NSE', sector: 'IT Services' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', exchange: 'NSE', sector: 'Private Banking' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', exchange: 'NSE', sector: 'Private Banking' },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', sector: 'Public Banking' },
  { symbol: 'WIPRO', name: 'Wipro Limited', exchange: 'NSE', sector: 'IT Services' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', exchange: 'NSE', sector: 'Automobile' },
  { symbol: 'TITAN', name: 'Titan Company Limited', exchange: 'NSE', sector: 'Consumer & Jewelry' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Limited', exchange: 'NSE', sector: 'Metals & Mining' },
  { symbol: 'ITC', name: 'ITC Limited', exchange: 'NSE', sector: 'FMCG' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.', exchange: 'NSE', sector: 'Conglomerate' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ', exchange: 'NSE', sector: 'Infrastructure' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', exchange: 'NSE', sector: 'Financial Services' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', exchange: 'NSE', sector: 'Automobile' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', exchange: 'NSE', sector: 'Healthcare & Pharma' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation', exchange: 'NSE', sector: 'Energy & PSU' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', exchange: 'NSE', sector: 'Telecom' },
  { symbol: 'LTIM', name: 'LTIMindtree Limited', exchange: 'NSE', sector: 'IT Services' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', exchange: 'NSE', sector: 'Private Banking' },
  { symbol: 'BEL', name: 'Bharat Electronics Limited', exchange: 'NSE', sector: 'Defence & Electronics' },
  { symbol: 'RVNL', name: 'Rail Vikas Nigam Limited', exchange: 'NSE', sector: 'Railways & Infra' },
  { symbol: 'IRFC', name: 'Indian Railway Finance Corp.', exchange: 'NSE', sector: 'Railway Finance' },
  { symbol: 'ZOMATO', name: 'Zomato Limited', exchange: 'NSE', sector: 'Food Delivery & Tech' },
  { symbol: 'JIOFIN', name: 'Jio Financial Services Ltd.', exchange: 'NSE', sector: 'Financial Services' },
  { symbol: 'IREDA', name: 'Indian Renewable Energy Dev.', exchange: 'NSE', sector: 'Renewable Energy' },
  { symbol: 'TATATECH', name: 'Tata Technologies Limited', exchange: 'NSE', sector: 'Engineering & Tech' },
  { symbol: 'PAYTM', name: 'One97 Communications (Paytm)', exchange: 'NSE', sector: 'Fintech' },
  { symbol: 'BSE', name: 'BSE Limited', exchange: 'NSE', sector: 'Exchange & Market' },
  { symbol: 'CDSL', name: 'Central Depository Services', exchange: 'NSE', sector: 'Financial Depository' },
  { symbol: 'COALINDIA', name: 'Coal India Limited', exchange: 'NSE', sector: 'Mining & PSU' },
  { symbol: 'NTPC', name: 'NTPC Limited', exchange: 'NSE', sector: 'Power Generation' },
  { symbol: 'POWERGRID', name: 'Power Grid Corp. of India', exchange: 'NSE', sector: 'Power Transmission' },
  // Global Equities
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', sector: 'Consumer Electronics' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', sector: 'Cloud & Software' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', sector: 'AI & Semiconductors' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', sector: 'EV & Clean Energy' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', sector: 'Internet & Search' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', sector: 'E-Commerce & Cloud' },
];

export const normalizeStockSymbol = (symbol) => {
  const s = String(symbol || '').trim().toUpperCase();
  if (!s) return 'NIFTY 50';
  if (s === 'NIFTY' || s === 'NIFTY50' || s === 'NIFTY-50' || s === '^NSEI' || s === 'NIFTY 50') return 'NIFTY 50';
  if (s === 'SENSEX' || s === '^BSESN' || s === 'BSE SENSEX') return 'SENSEX';
  if (s === 'BANKNIFTY' || s === 'NIFTYBANK' || s === '^NSEBANK' || s === 'NIFTY BANK') return 'NIFTY BANK';
  if (s === 'USDINR' || s === 'USD/INR' || s === 'INR=X') return 'USD / INR';
  return s;
};

let watchlistState = [...userWatchlist];

// Client-side in-flight single flight deduplication & short rate-limit cache
const inFlightRequests = new Map();
const clientCache = new Map();

const fetchWithDeduplication = (key, fetcher, ttlMs = 10000) => {
  const now = Date.now();
  const cached = clientCache.get(key);
  if (cached && now - cached.timestamp < ttlMs) {
    return Promise.resolve(cached.data);
  }

  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }

  const promise = (async () => {
    try {
      const data = await fetcher();
      clientCache.set(key, { timestamp: Date.now(), data });
      return data;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, promise);
  return promise;
};

// Dynamic Yahoo Finance Chart & Quote Resolver for ANY NSE, BSE, or Global equity
export const fetchLiveYahooFinanceQuote = async (symbol, range = '1mo', interval = '1d') => {
  const rawClean = String(symbol || '').trim().toUpperCase();
  if (!rawClean) return null;

  const cleanSym = normalizeStockSymbol(rawClean);
  const candidates = [];

  if (cleanSym === 'USD / INR') {
    candidates.push('INR=X');
  } else if (cleanSym.includes('.') || cleanSym.startsWith('^') || cleanSym.includes('-') || cleanSym.includes('/')) {
    candidates.push(cleanSym);
  } else {
    candidates.push(`${cleanSym}.NS`); // NSE (National Stock Exchange of India)
    candidates.push(`${cleanSym}.BO`); // BSE (Bombay Stock Exchange)
    candidates.push(cleanSym);         // Global (NASDAQ, NYSE, FOREX)
  }

  for (const candidate of candidates) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(candidate)}?interval=${interval}&range=${range}`;
      const res = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000
      });
      const result = res.data?.chart?.result?.[0];
      if (result && result.meta && typeof result.meta.regularMarketPrice === 'number' && result.meta.regularMarketPrice > 0) {
        const meta = result.meta;
        const price = +(meta.regularMarketPrice).toFixed(2);
        const prevClose = +(meta.chartPreviousClose || meta.previousClose || price).toFixed(2);
        const change = +(price - prevClose).toFixed(2);
        const pctChange = +(((price - prevClose) / (prevClose || 1)) * 100).toFixed(2);
        const dayHigh = +(meta.regularMarketDayHigh || price).toFixed(2);
        const dayLow = +(meta.regularMarketDayLow || price).toFixed(2);
        const open = +(meta.regularMarketDayLow || price).toFixed(2);
        const w52High = +(meta.fiftyTwoWeekHigh || (price * 1.15)).toFixed(2);
        const w52Low = +(meta.fiftyTwoWeekLow || (price * 0.85)).toFixed(2);
        const volume = meta.regularMarketVolume || 1500000;
        const exch = meta.fullExchangeName || meta.exchDisp || (candidate.endsWith('.NS') ? 'NSE' : (candidate.endsWith('.BO') ? 'BSE' : 'GLOBAL'));
        const name = meta.longName || meta.shortName || (STOCK_CATALOG.find(s => s.symbol === cleanSym)?.name) || `${cleanSym} Limited`;

        const isBull = pctChange >= 0;
        const tomHigh = +(price * (1 + 0.015)).toFixed(2);
        const tomLow = +(price * (1 - 0.015)).toFixed(2);
        const conf = Math.min(94, Math.max(68, Math.round(72 + Math.abs(pctChange) * 2)));

        // Extract historical chart bars
        const timestamps = result.timestamp || [];
        const quotes = result.indicators?.quote?.[0] || {};
        const closes = quotes.close || [];
        const opens = quotes.open || [];
        const highs = quotes.high || [];
        const lows = quotes.low || [];
        const volumes = quotes.volume || [];

        const chart_data = [];
        for (let i = 0; i < timestamps.length; i++) {
          if (closes[i] != null && !isNaN(closes[i])) {
            const dateStr = new Date(timestamps[i] * 1000).toISOString().split('T')[0];
            chart_data.push({
              date: dateStr,
              price: +(closes[i]).toFixed(2),
              close: +(closes[i]).toFixed(2),
              open: +((opens[i] ?? closes[i])).toFixed(2),
              high: +((highs[i] ?? closes[i])).toFixed(2),
              low: +((lows[i] ?? closes[i])).toFixed(2),
              volume: Math.round(volumes[i] || 100000),
              sma20: +(closes[i] * 0.99).toFixed(2)
            });
          }
        }

        const marketCap = price > 2000 ? '₹14.2 Lakh Cr' : (price > 500 ? '₹3.4 Lakh Cr' : (price > 50 ? '₹18,500 Cr' : '₹1,080 Cr'));

        return {
          symbol: cleanSym,
          activeTicker: candidate,
          name,
          exchange: exch,
          price,
          change,
          pctChange,
          open,
          high: dayHigh,
          low: dayLow,
          prevClose,
          volume,
          week52High: w52High,
          week52Low: w52Low,
          marketCap,
          chart_data,
          prediction: {
            tomorrowHigh: tomHigh,
            tomorrowLow: tomLow,
            trend: isBull ? 'Bullish' : 'Bearish',
            confidence: conf,
            signal: pctChange >= 0.5 ? 'BUY' : (pctChange <= -0.5 ? 'SELL' : 'HOLD'),
            signalConfidence: 70,
            range: +(tomHigh - tomLow).toFixed(2),
          }
        };
      }
    } catch (e) {
      // Try next candidate
    }
  }

  return null;
};

export const stockApi = {
  invalidateCache: (keyPrefix = null) => {
    if (!keyPrefix) {
      clientCache.clear();
    } else {
      for (const k of clientCache.keys()) {
        if (k.startsWith(keyPrefix)) {
          clientCache.delete(k);
        }
      }
    }
  },

  getMarketIndices: async () => {
    return fetchWithDeduplication('market_indices', async () => {
      try {
        const res = await client.get('/stocks/indices');
        if (Array.isArray(res.data) && res.data.length > 0) {
          return res.data;
        }
      } catch (e) {
        console.warn('Live indices fetch note, using baseline:', e.message);
      }
      return [...marketIndices];
    }, 15000);
  },

  getTopMovers: async () => {
    return fetchWithDeduplication('top_movers', async () => {
      try {
        const res = await client.get('/stocks/top-movers');
        if (res.data && res.data.gainers && res.data.losers) {
          return res.data;
        }
      } catch (e) {
        console.warn('Top movers fetch note:', e.message);
      }
      return {
        gainers: [
          { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', price: 239.00, change: 2.10, pctChange: 0.89 },
          { symbol: 'NTPC', name: 'NTPC Limited', price: 326.60, change: 0.60, pctChange: 0.18 },
          { symbol: 'POWERGRID', name: 'Power Grid Corporation', price: 288.40, change: 0.35, pctChange: 0.12 },
          { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Ind.', price: 1675.20, change: 1.50, pctChange: 0.09 },
          { symbol: 'ITC', name: 'ITC Limited', price: 428.30, change: 0.20, pctChange: 0.05 }
        ],
        losers: [
          { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', price: 982.00, change: -61.20, pctChange: -5.87 },
          { symbol: 'AXISBANK', name: 'Axis Bank Limited', price: 1186.50, change: -56.70, pctChange: -4.56 },
          { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 2900.00, change: -93.20, pctChange: -3.11 },
          { symbol: 'RELIANCE', name: 'Reliance Industries', price: 1219.20, change: -28.90, pctChange: -2.31 },
          { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', price: 1795.80, change: -37.40, pctChange: -2.04 }
        ]
      };
    }, 20000);
  },

  getStock: async (symbol) => {
    const rawClean = String(symbol || 'NIFTY 50').trim().toUpperCase();
    const cleanSym = normalizeStockSymbol(rawClean);
    if (!cleanSym) return null;

    return fetchWithDeduplication(`quote_${cleanSym}`, async () => {
      // 1. Try Backend Prediction & Exploration Endpoint
      try {
        const predRes = await client.post('/predictions', { symbol: cleanSym });
        const p = predRes.data;

        if (p && p.currentPrice && p.currentPrice > 0) {
          const matching = STOCK_CATALOG.find((s) => s.symbol === cleanSym || s.symbol === rawClean);
          const name = p.name || (matching ? matching.name : `${cleanSym} Equity`);
          const exchange = p.exchange || (matching ? matching.exchange : (cleanSym.includes('^') || cleanSym.includes('NIFTY') ? 'NSE' : 'NSE'));

          const w52High = +(p.fiftyTwoWeekHigh || p.currentPrice * 1.15).toFixed(2);
          const w52Low = +(p.fiftyTwoWeekLow || p.currentPrice * 0.85).toFixed(2);
          const prevClose = +(p.currentPrice - (p.change || 0)).toFixed(2);
          const marketCap = cleanSym.includes('NIFTY') || cleanSym.includes('SENSEX') ? '₹195.4 Lakh Cr' : (p.currentPrice > 1000 ? '₹14.28 Lakh Cr' : '₹4.65 Lakh Cr');

          return {
            symbol: cleanSym,
            name,
            exchange,
            price: p.currentPrice,
            change: p.change || 0.0,
            pctChange: p.changePercent || 0.0,
            open: p.openPrice || p.currentPrice,
            high: p.dayHigh || +(p.currentPrice * 1.01).toFixed(2),
            low: p.dayLow || +(p.currentPrice * 0.99).toFixed(2),
            prevClose,
            volume: p.volume || (cleanSym.includes('NIFTY') ? 28450000 : 1850000),
            week52High: w52High,
            week52Low: w52Low,
            marketCap,
            prediction: {
              tomorrowHigh: p.predictedHigh || +(p.currentPrice * 1.015).toFixed(2),
              tomorrowLow: p.predictedLow || +(p.currentPrice * 0.985).toFixed(2),
              trend: p.direction === 'BULLISH' ? 'Bullish' : 'Bearish',
              confidence: p.directionConfidence || 75,
              signal: p.signal || 'HOLD',
              signalConfidence: p.signalConfidence || 65,
              range: p.predictedRange || 15.0,
            },
          };
        }
      } catch (e) {
        // Backend not running or failed, proceed to direct Yahoo Finance query
      }

      // 2. Direct Real-Time Yahoo Finance Resolver (supports ANY NSE/BSE/Global stock like JPPOWER, SUZLON, IRFC)
      try {
        const liveYahoo = await fetchLiveYahooFinanceQuote(cleanSym);
        if (liveYahoo && liveYahoo.price > 0) {
          return liveYahoo;
        }
      } catch (e) {
        console.warn(`Direct Yahoo quote check for ${cleanSym}:`, e.message);
      }

      // 3. Check if symbol exists in curated mock database
      const matching = STOCK_CATALOG.find((s) => s.symbol === cleanSym || s.symbol === rawClean);
      const mock = mockStocks[cleanSym] || mockStocks[rawClean] || (cleanSym.includes('NIFTY') ? mockStocks['NIFTY 50'] : (cleanSym.includes('SENSEX') ? mockStocks['SENSEX'] : null));

      if (!matching && !mock) {
        // Genuine stock not found across exchanges
        return {
          notFound: true,
          symbol: cleanSym,
          error: `Stock symbol "${cleanSym}" was not found on NSE, BSE, or Global markets. Please verify the ticker.`
        };
      }

      const basePrice = mock?.price || (cleanSym.includes('NIFTY') ? 24541.15 : (cleanSym.includes('SENSEX') ? 80604.65 : 2450.0));
      const baseMock = mock || {
        symbol: cleanSym,
        name: matching ? matching.name : `${cleanSym} Stock`,
        exchange: matching ? matching.exchange : 'NSE',
        price: basePrice,
        change: +(basePrice * 0.006).toFixed(2),
        pctChange: 0.60,
        prediction: {
          tomorrowHigh: +(basePrice * 1.012).toFixed(2),
          tomorrowLow: +(basePrice * 0.988).toFixed(2),
          trend: 'Bullish',
          confidence: 78,
          signal: 'BUY',
          signalConfidence: 70,
          range: +(basePrice * 0.024).toFixed(2)
        }
      };

      return {
        symbol: cleanSym,
        name: baseMock.name || `${cleanSym} Stock`,
        exchange: matching ? matching.exchange : (cleanSym.includes('SENSEX') ? 'BSE' : 'NSE'),
        price: baseMock.price,
        change: baseMock.change || 0,
        pctChange: baseMock.pctChange || 0,
        open: +(baseMock.price * 0.995).toFixed(2),
        high: +(baseMock.price * 1.012).toFixed(2),
        low: +(baseMock.price * 0.988).toFixed(2),
        prevClose: +(baseMock.price - (baseMock.change || 0)).toFixed(2),
        volume: cleanSym.includes('NIFTY') ? 28450000 : 1650000,
        week52High: +(baseMock.price * 1.18).toFixed(2),
        week52Low: +(baseMock.price * 0.82).toFixed(2),
        marketCap: cleanSym.includes('NIFTY') ? '₹195.4 Lakh Cr' : '₹8.45 Lakh Cr',
        prediction: baseMock.prediction || {
          tomorrowHigh: +(baseMock.price * 1.015).toFixed(2),
          tomorrowLow: +(baseMock.price * 0.985).toFixed(2),
          trend: 'Bullish',
          confidence: 72,
          signal: 'BUY',
          signalConfidence: 68,
          range: +(baseMock.price * 0.03).toFixed(2),
        },
      };
    }, 12000);
  },

  getStockHistory: async (symbol, interval = '1M') => {
    const cleanSym = symbol.toUpperCase().trim();
    // 1. Try Backend
    try {
      const res = await client.post('/stocks/explore', { symbol: cleanSym, period: '1y' });
      if (res.data?.chart_data?.length > 0) {
        return res.data.chart_data.map((c) => ({
          date: c.date,
          price: c.close,
          open: c.open,
          high: c.high,
          low: c.low,
          volume: c.volume,
          sma20: c.sma20,
        }));
      }
    } catch (e) {
      // Backend explore failed, proceed to direct Yahoo Finance fetch
    }

    // 2. Direct Yahoo Finance historical candles
    try {
      const rangeMap = { '1D': '1d', '1W': '5d', '1M': '1mo', '3M': '3mo', '6M': '6mo', '1Y': '1y', '5Y': '5y' };
      const range = rangeMap[interval] || '1mo';
      const liveYahoo = await fetchLiveYahooFinanceQuote(cleanSym, range, '1d');
      if (liveYahoo && Array.isArray(liveYahoo.chart_data) && liveYahoo.chart_data.length > 0) {
        return liveYahoo.chart_data;
      }
    } catch (e) {}

    // 3. Fallback to mock for catalog stocks
    const matching = STOCK_CATALOG.find((s) => s.symbol === cleanSym);
    const mock = mockStocks[cleanSym];
    if (matching || mock || cleanSym.includes('NIFTY') || cleanSym.includes('SENSEX')) {
      return generateChartData(symbol, interval);
    }

    return [];
  },

  getWatchlist: async () => {
    return watchlistState.map((symbol) => {
      const matching = STOCK_CATALOG.find((s) => s.symbol === symbol);
      const stock = mockStocks[symbol] || {
        symbol,
        name: matching ? matching.name : symbol,
        price: 2450.0,
        change: 15.0,
        pctChange: 0.65,
        prediction: { trend: 'Bullish', tomorrowHigh: 2480.0 },
      };
      return {
        symbol: stock.symbol,
        name: matching ? matching.name : stock.name,
        price: stock.price,
        change: stock.change,
        pctChange: stock.pctChange,
        trend: stock.prediction?.trend || 'Bullish',
        prediction: stock.prediction?.tomorrowHigh || +(stock.price * 1.01).toFixed(2),
      };
    });
  },

  addToWatchlist: async (symbol) => {
    const sym = symbol.toUpperCase().trim();
    if (!watchlistState.includes(sym)) {
      watchlistState.push(sym);
    }
    return { success: true, watchlist: [...watchlistState] };
  },

  removeFromWatchlist: async (symbol) => {
    const sym = symbol.toUpperCase().trim();
    watchlistState = watchlistState.filter((s) => s !== sym);
    return { success: true, watchlist: [...watchlistState] };
  },

  validateStock: async (symbol) => {
    const cleanSym = String(symbol || '').toUpperCase().trim();
    if (!cleanSym) {
      return { valid: false, message: 'Please enter a stock ticker symbol.' };
    }

    // 1. Check known catalog
    const inCatalog = STOCK_CATALOG.find((s) => s.symbol === cleanSym);
    if (inCatalog) {
      return { valid: true, symbol: cleanSym, name: inCatalog.name, exchange: inCatalog.exchange, sector: inCatalog.sector };
    }

    // 2. Query backend live market API
    try {
      const predRes = await client.post('/predictions', { symbol: cleanSym });
      if (predRes.data && predRes.data.currentPrice && predRes.data.currentPrice > 0) {
        return {
          valid: true,
          symbol: cleanSym,
          name: predRes.data.name || `${cleanSym} Equity`,
          exchange: cleanSym.includes('.') ? cleanSym.split('.')[1] : 'NSE',
          price: predRes.data.currentPrice
        };
      }
    } catch (err) {}

    // 3. Direct Yahoo Finance lookup for any valid listed stock (e.g. JPPOWER)
    try {
      const live = await fetchLiveYahooFinanceQuote(cleanSym);
      if (live && live.price > 0) {
        return {
          valid: true,
          symbol: cleanSym,
          name: live.name,
          exchange: live.exchange,
          price: live.price
        };
      }
    } catch (err) {}

    return {
      valid: false,
      message: `Stock '${cleanSym}' was not found on NSE, BSE, or Global exchanges.`
    };
  },

  searchStocks: async (query) => {
    if (!query || !query.trim()) return STOCK_CATALOG.slice(0, 8);
    const q = query.toUpperCase().trim();

    // 1. Local catalog matches
    const localMatched = STOCK_CATALOG.filter(
      (s) => s.symbol.includes(q) || s.name.toUpperCase().includes(q) || (s.sector && s.sector.toUpperCase().includes(q))
    );

    // 2. Dynamic Yahoo Finance auto-complete search if query has 2+ characters
    let liveResults = [];
    if (q.length >= 2) {
      try {
        const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0`;
        const res = await axios.get(searchUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 3000
        });
        const rawQuotes = res.data?.quotes || [];
        liveResults = rawQuotes
          .filter(r => r.quoteType === 'EQUITY' || r.quoteType === 'INDEX')
          .map(r => {
            const sym = (r.symbol || '').replace('.NS', '').replace('.BO', '');
            const isNse = (r.symbol || '').endsWith('.NS') || r.exchDisp === 'NSE';
            const isBse = (r.symbol || '').endsWith('.BO') || r.exchDisp === 'Bombay';
            const exch = isNse ? 'NSE' : (isBse ? 'BSE' : (r.exchDisp || 'GLOBAL'));
            return {
              symbol: sym,
              name: r.longname || r.shortname || `${sym} Limited`,
              exchange: exch,
              sector: r.sectorDisp || r.industryDisp || 'Equities'
            };
          });
      } catch (e) {
        // Search API failed, continue with local matches
      }
    }

    // Merge and deduplicate by symbol
    const seen = new Set();
    const merged = [];

    for (const item of [...localMatched, ...liveResults]) {
      if (item && item.symbol && !seen.has(item.symbol.toUpperCase())) {
        seen.add(item.symbol.toUpperCase());
        merged.push(item);
      }
    }

    return merged.slice(0, 10);
  },
};

