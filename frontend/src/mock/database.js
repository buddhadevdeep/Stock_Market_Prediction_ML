// StockAI Mock Database System
// This file acts as the client-side database simulation

export const marketIndices = [
  { name: 'NIFTY 50', symbol: '^NSEI', value: 23063.10, change: -383.70, pctChange: -1.64, sparkline: [23440, 23400, 23350, 23280, 23150, 23063], status: 'bearish' },
  { name: 'SENSEX', symbol: '^BSESN', value: 73580.54, change: -1247.71, pctChange: -1.67, sparkline: [74800, 74500, 74200, 73900, 73700, 73580], status: 'bearish' },
  { name: 'NIFTY BANK', symbol: '^NSEBANK', value: 55438.50, change: -1110.40, pctChange: -1.96, sparkline: [56500, 56200, 55900, 55600, 55438], status: 'bearish' },
  { name: 'USD / INR', symbol: 'INR=X', value: 95.94, change: 0.26, pctChange: 0.27, sparkline: [95.50, 95.60, 95.70, 95.85, 95.94], status: 'bullish' },
];


export const mockStocks = {
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    price: 3682.45,
    change: 88.10,
    pctChange: 2.45,
    open: 3610.00,
    high: 3690.80,
    low: 3580.50,
    prevClose: 3594.35,
    volume: '2.53M',
    marketCap: '13.25 L Cr',
    beta: 0.98,
    dividendYield: 1.25,
    peRatio: 26.45,
    high52: 3890.00,
    low52: 2850.50,
    prediction: {
      tomorrowHigh: 3745.80,
      tomorrowLow: 3680.00,
      expectedRange: '₹3,680 - ₹3,760',
      expectedPctChange: 1.72,
      confidence: 92,
      trend: 'Bullish',
      riskLevel: 'Low',
      riskProb: 15,
      modelName: 'LSTM + XGBoost Ensemble',
      r2: 0.994,
      mae: 6.45,
      rmse: 9.59,
      features: ['OHLCV', 'Lag Prices', 'RSI 14', 'MACD', 'SMA 50/200'],
      explanation: [
        { icon: 'trending-up', text: 'Previous High is increasing, indicating upward momentum.' },
        { icon: 'chevron-up', text: 'Current Close is above the 5-day EMA and 50-day SMA.' },
        { icon: 'activity', text: 'Market momentum is positive with MACD bullish crossover.' },
        { icon: 'shield-check', text: 'RSI is in healthy bullish territory at 64.35.' },
        { icon: 'bar-chart', text: 'Volume supports the current uptrend with a 15% breakout.' }
      ]
    },
    bullFactors: [
      { factor: 'RSI above 50 (current: 64.35)', value: 'Strong momentum' },
      { factor: 'Price above 50 & 200 MA', value: 'Long-term uptrend' },
      { factor: 'Positive MACD crossover', value: 'Bullish buy signal' },
      { factor: 'High buying volume', value: 'Institution backed' },
      { factor: 'Strong IT sector sentiment', value: 'Industry tailwinds' }
    ],
    bearFactors: [
      { factor: 'Approach resistance at ₹3,800', value: 'Selling pressure expected' },
      { factor: 'Volatility index rise', value: 'Market uncertainty' },
      { factor: 'Overbought warning trigger', value: 'Minor pullback risk' }
    ],
    bullPct: 63,
    bearPct: 37
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Limited',
    exchange: 'NSE',
    price: 1645.35,
    change: 34.60,
    pctChange: 2.15,
    open: 1612.00,
    high: 1654.00,
    low: 1608.20,
    prevClose: 1610.75,
    volume: '5.12M',
    marketCap: '6.78 L Cr',
    beta: 1.12,
    dividendYield: 1.95,
    peRatio: 24.12,
    high52: 1720.00,
    low52: 1350.00,
    prediction: {
      tomorrowHigh: 1672.30,
      tomorrowLow: 1630.00,
      expectedRange: '₹1,630 - ₹1,685',
      expectedPctChange: 1.64,
      confidence: 88,
      trend: 'Bullish',
      riskLevel: 'Low',
      riskProb: 18,
      modelName: 'XGBoost Regressor',
      r2: 0.985,
      mae: 5.12,
      rmse: 8.24,
      features: ['OHLCV', 'MACD', 'RSI 14', 'Volume Ratio'],
      explanation: [
        { icon: 'trending-up', text: 'Steady rise in daily low prices.' },
        { icon: 'activity', text: 'High relative volume breakout (1.2x average).' },
        { icon: 'globe', text: 'Positive US Tech sector (NASDAQ) gains overflow.' }
      ]
    },
    bullFactors: [
      { factor: 'RSI at 58 (Bullish neutral)', value: 'Room to grow' },
      { factor: 'Price above 20 & 50 SMA', value: 'Short-term support' },
      { factor: 'Decline in short interest', value: 'Short covering' }
    ],
    bearFactors: [
      { factor: 'Currency fluctuations', value: 'Rupee strengthening pressure' },
      { factor: 'Resistance at 52w high ₹1,720', value: 'Profit booking zone' }
    ],
    bullPct: 60,
    bearPct: 40
  },
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Limited',
    exchange: 'NSE',
    price: 2905.20,
    change: 55.60,
    pctChange: 1.95,
    open: 2855.00,
    high: 2915.00,
    low: 2842.00,
    prevClose: 2849.60,
    volume: '4.89M',
    marketCap: '19.65 L Cr',
    beta: 0.85,
    dividendYield: 0.34,
    peRatio: 28.50,
    high52: 3210.00,
    low52: 2220.00,
    prediction: {
      tomorrowHigh: 2955.50,
      tomorrowLow: 2885.00,
      expectedRange: '₹2,885 - ₹2,975',
      expectedPctChange: 1.73,
      confidence: 84,
      trend: 'Neutral',
      riskLevel: 'Medium',
      riskProb: 32,
      modelName: 'Random Forest Ensemble',
      r2: 0.974,
      mae: 11.20,
      rmse: 14.80,
      features: ['OHLCV', 'Moving Averages', 'Sentiment Index'],
      explanation: [
        { icon: 'activity', text: 'Consolidating within ₹2,880 - ₹2,930 range.' },
        { icon: 'shield-check', text: 'Robust support at 200 SMA (₹2,720).' },
        { icon: 'trending-up', text: 'Bullish crossover in weekly stochastic chart.' }
      ]
    },
    bullFactors: [
      { factor: 'Crude margins expansion', value: 'Refining tailwinds' },
      { factor: 'RSI at 52 (neutral)', value: 'Healthy consolidation' }
    ],
    bearFactors: [
      { factor: 'High leverage profile', value: 'Interest expense strain' },
      { factor: 'Telecom average revenue flat', value: 'Jio growth slowdown' }
    ],
    bullPct: 53,
    bearPct: 47
  },
  SBIN: {
    symbol: 'SBIN',
    name: 'State Bank of India',
    exchange: 'NSE',
    price: 1065.00,
    change: -12.40,
    pctChange: -1.15,
    open: 1080.00,
    high: 1085.00,
    low: 1058.00,
    prevClose: 1077.40,
    volume: '8.34M',
    marketCap: '9.45 L Cr',
    beta: 1.22,
    dividendYield: 1.35,
    peRatio: 12.80,
    high52: 1120.00,
    low52: 740.00,
    prediction: {
      tomorrowHigh: 1082.00,
      tomorrowLow: 1045.00,
      expectedRange: '₹1,045 - ₹1,085',
      expectedPctChange: 0.50,
      confidence: 90,
      trend: 'Bearish',
      riskLevel: 'Medium',
      riskProb: 45,
      modelName: 'LSTM Network',
      r2: 0.981,
      mae: 4.80,
      rmse: 6.90,
      features: ['OHLCV', 'RSI 14', 'NIFTY BANK Trend'],
      explanation: [
        { icon: 'trending-down', text: 'Price fell below 20-day SMA (₹1,072).' },
        { icon: 'activity', text: 'MACD bearish crossover confirmed on daily chart.' },
        { icon: 'alert-triangle', text: 'Sell-off triggered in banking stocks due to rate hike talk.' }
      ]
    },
    bullFactors: [
      { factor: 'Low valuations (P/E 12.8)', value: 'Value buy zone' },
      { factor: 'Gross NPA levels decreasing', value: 'Improved asset quality' }
    ],
    bearFactors: [
      { factor: 'RSI at 38 (Near oversold)', value: 'Bearish pressure active' },
      { factor: 'Liquidity tightening', value: 'NIM pressure' },
      { factor: 'Institutional selling', value: 'FII flow outbound' }
    ],
    bullPct: 35,
    bearPct: 65
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    exchange: 'NSE',
    price: 1724.50,
    change: 14.25,
    pctChange: 0.83,
    open: 1710.00,
    high: 1735.00,
    low: 1705.00,
    prevClose: 1710.25,
    volume: '6.45M',
    marketCap: '12.80 L Cr',
    beta: 0.95,
    dividendYield: 1.10,
    peRatio: 18.20,
    high52: 1795.00,
    low52: 1360.00,
    prediction: {
      tomorrowHigh: 1738.60,
      tomorrowLow: 1710.00,
      expectedRange: '₹1,710 - ₹1,745',
      expectedPctChange: 0.82,
      confidence: 89,
      trend: 'Bullish',
      riskLevel: 'Low',
      riskProb: 20,
      modelName: 'Support Vector Regressor',
      r2: 0.982,
      mae: 3.80,
      rmse: 5.50,
      features: ['OHLCV', 'EMA 20/50', 'FII Net Buy'],
      explanation: [
        { icon: 'trending-up', text: 'Price consolidated above key support (₹1,700).' },
        { icon: 'activity', text: 'High retail credit growth numbers reported.' }
      ]
    },
    bullFactors: [
      { factor: 'Merge synergies materializing', value: 'Cost reductions' },
      { factor: 'RSI at 54 (Neutral bullish)', value: 'Healthy momentum' }
    ],
    bearFactors: [
      { factor: 'HDFC Corp merger drag', value: 'Short-term margin compression' }
    ],
    bullPct: 58,
    bearPct: 42
  },
  ICICIBANK: {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Limited',
    exchange: 'NSE',
    price: 1225.30,
    change: 12.10,
    pctChange: 1.00,
    open: 1210.00,
    high: 1232.00,
    low: 1205.00,
    prevClose: 1213.20,
    volume: '4.50M',
    marketCap: '8.60 L Cr',
    beta: 1.05,
    dividendYield: 0.82,
    peRatio: 17.40,
    high52: 1280.00,
    low52: 890.00,
    prediction: {
      tomorrowHigh: 1245.20,
      tomorrowLow: 1215.00,
      expectedRange: '₹1,215 - ₹1,250',
      expectedPctChange: 1.62,
      confidence: 91,
      trend: 'Bullish',
      riskLevel: 'Low',
      riskProb: 12,
      modelName: 'LSTM + XGBoost Ensemble',
      r2: 0.991,
      mae: 4.10,
      rmse: 6.20,
      features: ['OHLCV', 'RSI 14', 'Bollinger Bands'],
      explanation: [
        { icon: 'trending-up', text: 'Strong bounce back from mid-band of Bollinger (₹1,200).' },
        { icon: 'activity', text: 'RSI indicator pointing upwards at 59.' }
      ]
    },
    bullFactors: [
      { factor: 'Industry leading NIM at 4.4%', value: 'Highly profitable' },
      { factor: 'Stable credit cost profile', value: 'High credit quality' }
    ],
    bearFactors: [
      { factor: 'Deposit growth lags lending', value: 'Liquidity tightening' }
    ],
    bullPct: 62,
    bearPct: 38
  }
};

// Generate Chart Data helper
export const generateChartData = (symbol, interval = '1M') => {
  const stock = mockStocks[symbol] || mockStocks.TCS;
  const basePrice = stock.price;
  let points = 30;
  let volatility = stock.beta * 0.015;

  switch (interval) {
    case '1D': points = 24; volatility = 0.002; break;
    case '1W': points = 7; volatility = 0.008; break;
    case '1M': points = 30; volatility = 0.015; break;
    case '3M': points = 90; volatility = 0.025; break;
    case '6M': points = 180; volatility = 0.035; break;
    case '1Y': points = 250; volatility = 0.05; break;
    case '5Y': points = 500; volatility = 0.12; break;
    default: points = 30;
  }

  const data = [];
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const date = new Date(now);
    if (interval === '1D') {
      date.setHours(now.getHours() - i);
    } else {
      date.setDate(now.getDate() - i);
    }
    
    // Pseudo-random walk with positive/negative drift based on trend
    const drift = stock.prediction.trend === 'Bullish' ? 0.0005 : (stock.prediction.trend === 'Bearish' ? -0.0005 : 0);
    const changeFactor = 1 + (Math.random() - 0.5 + drift) * volatility;
    
    const priceIndex = basePrice * Math.pow(changeFactor, points - i);
    const open = priceIndex * (1 + (Math.random() - 0.5) * 0.005);
    const close = priceIndex * (1 + (Math.random() - 0.5) * 0.005);
    const high = Math.max(open, close) * (1 + Math.random() * 0.003);
    const low = Math.min(open, close) * (1 - Math.random() * 0.003);
    const volume = Math.round(50000 + Math.random() * 100000);
    
    // SMA indicators
    const sma20 = priceIndex * 0.98;
    const sma50 = priceIndex * 0.96;
    const sma200 = priceIndex * 0.92;
    const ema20 = priceIndex * 0.99;
    const ema50 = priceIndex * 0.97;
    const rsi = 50 + (Math.random() - 0.5) * 30;
    const macdLine = (Math.random() - 0.5) * 10;
    const signalLine = macdLine * 0.8;
    const macdHist = macdLine - signalLine;

    data.push({
      date: interval === '1D' 
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : date.toLocaleDateString([], { day: '2-digit', month: 'short' }),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      price: parseFloat(close.toFixed(2)),
      volume: volume,
      sma20: parseFloat(sma20.toFixed(2)),
      sma50: parseFloat(sma50.toFixed(2)),
      sma200: parseFloat(sma200.toFixed(2)),
      ema20: parseFloat(ema20.toFixed(2)),
      ema50: parseFloat(ema50.toFixed(2)),
      rsi: parseFloat(rsi.toFixed(2)),
      macdLine: parseFloat(macdLine.toFixed(2)),
      signalLine: parseFloat(signalLine.toFixed(2)),
      macdHist: parseFloat(macdHist.toFixed(2)),
    });
  }
  return data;
};

// Portfolio simulator
export let userPortfolio = {
  summary: {
    totalValue: 2478320.45,
    invested: 2020000.00,
    totalGain: 458320.45,
    todayGain: 58320.45,
    todayPct: 2.46,
    returnPct: 22.68,
    healthScore: 86,
    healthText: 'Very Good'
  },
  holdings: [
    { symbol: 'TCS', qty: 50, avgPrice: 3200.00, value: 184122.50, gainLoss: 24122.50, gainPct: 15.07 },
    { symbol: 'INFY', qty: 30, avgPrice: 1450.00, value: 49360.50, gainLoss: 5860.50, gainPct: 13.46 },
    { symbol: 'RELIANCE', qty: 10, avgPrice: 2450.00, value: 29052.00, gainLoss: 4552.00, gainPct: 18.57 },
    { symbol: 'HDFCBANK', qty: 20, avgPrice: 1600.00, value: 34490.00, gainLoss: 2490.00, gainPct: 7.78 },
    { symbol: 'ICICIBANK', qty: 25, avgPrice: 1050.00, value: 30632.50, gainLoss: 4382.50, gainPct: 15.68 }
  ],
  allocation: [
    { name: 'Equity', value: 70, color: '#6366f1' },
    { name: 'Mutual Funds', value: 20, color: '#06b6d4' },
    { name: 'Cash', value: 10, color: '#10b981' }
  ]
};

// Prediction History
export const predictionHistory = [
  { date: '20 May 2026', symbol: 'TCS', predictedHigh: 3745.80, actualHigh: 3748.10, error: 2.30, direction: 'Bullish', accuracy: 99.94 },
  { date: '18 May 2026', symbol: 'INFY', predictedHigh: 1672.30, actualHigh: 1674.80, error: 2.50, direction: 'Bullish', accuracy: 99.85 },
  { date: '18 May 2026', symbol: 'RELIANCE', predictedHigh: 2955.50, actualHigh: 2942.30, error: 13.20, direction: 'Neutral', accuracy: 99.55 },
  { date: '17 May 2026', symbol: 'HDFCBANK', predictedHigh: 1738.60, actualHigh: 1732.50, error: 6.10, direction: 'Bullish', accuracy: 99.64 },
  { date: '16 May 2026', symbol: 'ICICIBANK', predictedHigh: 1245.20, actualHigh: 1248.90, error: 3.70, direction: 'Bullish', accuracy: 99.70 },
  { date: '15 May 2026', symbol: 'SBIN', predictedHigh: 1082.00, actualHigh: 1079.10, error: 2.90, direction: 'Bearish', accuracy: 99.73 }
];

export const historyPerformance = {
  mae: 6.45,
  rmse: 9.59,
  r2: 0.994,
  correctDirectionPct: 98.92,
  predictionCount: 1540
};

// News feed mock data
export const newsSentiment = [
  { id: 1, stock: 'TCS', headline: 'TCS Q4 Results: Net profit up 12% YoY, declares dividend of ₹28/share', source: 'Economic Times', time: '1 hour ago', sentiment: 'Positive', score: 85 },
  { id: 2, stock: 'INFY', headline: 'Infosys signs $1.5B deal with US client for AI-led transformation projects', source: 'Bloomberg Quint', time: '2 hours ago', sentiment: 'Positive', score: 90 },
  { id: 3, stock: 'RELIANCE', headline: 'Reliance retail arm footprint expansion plan gets board nod', source: 'Mint', time: '4 hours ago', sentiment: 'Neutral', score: 55 },
  { id: 4, stock: 'SBIN', headline: 'Nifty IT index hits 6-month high, tech stocks lead market recovery', source: 'Reuters', time: '1 day ago', sentiment: 'Positive', score: 72 },
  { id: 5, stock: 'SBIN', headline: 'RBI keeps repo rate unchanged, concerns over banking margin persistence remain', source: 'CNBC-TV18', time: '1 day ago', sentiment: 'Neutral', score: 48 },
  { id: 6, stock: 'HDFCBANK', headline: 'HDFC Bank credit card additions drop due to increased regulatory compliance overhead', source: 'Financial Express', time: '2 days ago', sentiment: 'Negative', score: 28 }
];

// Active user alert definitions
export let activeAlerts = [
  { id: 1, stock: 'TCS', condition: 'Price above ₹3,800', status: 'Active', created: 'May 22, 2026 03:30 PM' },
  { id: 2, stock: 'INFY', condition: 'Prediction confidence above 90%', status: 'Active', created: 'May 21, 2026 01:45 PM' },
  { id: 3, stock: 'RELIANCE', condition: 'Price drops below ₹2,800', status: 'Active', created: 'May 20, 2026 10:15 AM' },
  { id: 4, stock: 'HDFCBANK', condition: 'Risk above Medium', status: 'Paused', created: 'May 19, 2026 11:05 AM' }
];

// Watchlist simulation
export let userWatchlist = ['TCS', 'INFY', 'RELIANCE'];

// Helper to search stock list
export const searchStocks = (query) => {
  if (!query) return Object.values(mockStocks);
  const q = query.toUpperCase();
  return Object.values(mockStocks).filter(
    s => s.symbol.includes(q) || s.name.toUpperCase().includes(q)
  );
};
