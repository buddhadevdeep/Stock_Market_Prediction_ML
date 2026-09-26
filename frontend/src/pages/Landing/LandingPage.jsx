import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  BarChart2, 
  Activity, 
  ArrowRight, 
  Layers, 
  CheckCircle,
  Play,
  Mail,
  Lock,
  User,
  X,
  Zap,
  AlertCircle,
  Menu,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  Radio
} from 'lucide-react';

// Sample Live Stocks Dataset for Interactive Terminal Preview & Sandbox
const PREVIEW_STOCKS = {
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    price: 3682.45,
    change: +2.45,
    forecast: 3745.80,
    forecastChange: +1.72,
    state: 'BULLISH',
    sentimentScore: 84,
    rsi: 64.2,
    macd: '+18.4 (Bullish Cross)',
    lstmConfidence: '94.2%',
    xgboostConfidence: '92.8%',
    signal: 'Strong Buy',
    chartPoints: [3590, 3610, 3595, 3630, 3645, 3625, 3660, 3682],
    predictedPoint: 3745.80
  },
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    exchange: 'NSE',
    price: 2940.10,
    change: +1.15,
    forecast: 2985.50,
    forecastChange: +1.54,
    state: 'BULLISH',
    sentimentScore: 79,
    rsi: 58.6,
    macd: '+12.1 (Upward Momentum)',
    lstmConfidence: '91.5%',
    xgboostConfidence: '89.4%',
    signal: 'Buy Signal',
    chartPoints: [2880, 2895, 2910, 2890, 2925, 2915, 2930, 2940],
    predictedPoint: 2985.50
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Limited',
    exchange: 'NSE',
    price: 1875.30,
    change: +1.80,
    forecast: 1912.00,
    forecastChange: +1.95,
    state: 'BULLISH',
    sentimentScore: 88,
    rsi: 68.4,
    macd: '+22.0 (Breakout)',
    lstmConfidence: '95.1%',
    xgboostConfidence: '93.7%',
    signal: 'Strong Buy',
    chartPoints: [1810, 1825, 1840, 1830, 1855, 1860, 1865, 1875],
    predictedPoint: 1912.00
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    exchange: 'NSE',
    price: 1660.00,
    change: +0.40,
    forecast: 1682.30,
    forecastChange: +1.34,
    state: 'NEUTRAL-BULLISH',
    sentimentScore: 68,
    rsi: 52.1,
    macd: '+4.5 (Consolidating)',
    lstmConfidence: '88.3%',
    xgboostConfidence: '87.1%',
    signal: 'Accumulate',
    chartPoints: [1645, 1650, 1642, 1655, 1648, 1658, 1655, 1660],
    predictedPoint: 1682.30
  },
  TATAMOTORS: {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    exchange: 'NSE',
    price: 985.60,
    change: +3.10,
    forecast: 1024.00,
    forecastChange: +3.89,
    state: 'BULLISH',
    sentimentScore: 92,
    rsi: 72.3,
    macd: '+31.8 (High Volume Surge)',
    lstmConfidence: '96.8%',
    xgboostConfidence: '95.2%',
    signal: 'Strong Buy',
    chartPoints: [920, 935, 940, 955, 950, 970, 975, 985],
    predictedPoint: 1024.00
  }
};

const TICKER_ITEMS = [
  { sym: 'NIFTY 50', val: '24,845.20', chg: '+0.68%', up: true },
  { sym: 'SENSEX', val: '81,420.50', chg: '+0.72%', up: true },
  { sym: 'TCS', val: '₹3,682.45', chg: '+2.45%', up: true },
  { sym: 'RELIANCE', val: '₹2,940.10', chg: '+1.15%', up: true },
  { sym: 'INFY', val: '₹1,875.30', chg: '+1.80%', up: true },
  { sym: 'HDFCBANK', val: '₹1,660.00', chg: '+0.40%', up: true },
  { sym: 'TATAMOTORS', val: '₹985.60', chg: '+3.10%', up: true },
  { sym: 'ICICIBANK', val: '₹1,220.80', chg: '+0.95%', up: true },
  { sym: 'WIPRO', val: '₹540.25', chg: '+1.35%', up: true },
  { sym: 'BHARTIARTL', val: '₹1,580.00', chg: '+0.85%', up: true }
];

const FAQS = [
  {
    q: 'How does StockAI forecast tomorrow\'s stock prices?',
    a: 'StockAI ingests continuous daily OHLCV candlestick data along with 14 engineered technical indicators (RSI, MACD, Bollinger Bands, ATR, EMA lags). These are processed through an ensemble of Deep LSTM recurrent neural networks and XGBoost regressors to project next-session high, low, and probability bands.'
  },
  {
    q: 'Are the AI predictions updated in real time?',
    a: 'Yes. Market data and predictive inferences refresh continuously with live tick updates during market hours, calculating dynamic support, resistance, and momentum signals.'
  },
  {
    q: 'What does the Confidence Score indicate?',
    a: 'The Confidence Score (e.g. 94.2%) measures ensemble consensus across LSTM, XGBoost, and Random Forest models along with historical backtest accuracy over 10 years of NSE dataset validation.'
  },
  {
    q: 'Can I test the terminal without entering credit card info?',
    a: 'Absolutely. We provide immediate 1-Click Instant Demo access and a free starter tier with no payment details required.'
  }
];

const LandingPage = () => {
  const { login, register, user, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  // Mobile menu drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Selected Stock in Hero Graphical Terminal & Sandbox
  const [selectedSymbol, setSelectedSymbol] = useState('TCS');
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const currentStock = PREVIEW_STOCKS[selectedSymbol] || PREVIEW_STOCKS.TCS;

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthError('');
    setMobileMenuOpen(false);
    setShowAuthModal(true);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        await login(authEmail, authPassword, true);
      } else {
        await register(authName, authEmail, authPassword);
        await login(authEmail, authPassword, true);
      }
      setShowAuthModal(false);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInstantDemo = () => {
    setMobileMenuOpen(false);
    navigate('/dashboard');
  };

  // Generate SVG Chart Points for the interactive card
  const chartSvgData = useMemo(() => {
    const pts = [...currentStock.chartPoints];
    const pred = currentStock.predictedPoint;
    const minVal = Math.min(...pts) * 0.995;
    const maxVal = Math.max(...pts, pred) * 1.005;
    const range = maxVal - minVal || 1;

    const width = 360;
    const height = 130;
    const stepX = (width - 60) / (pts.length - 1);

    const historicalCoords = pts.map((p, i) => {
      const x = i * stepX + 10;
      const y = height - 20 - ((p - minVal) / range) * (height - 40);
      return { x, y, val: p };
    });

    const lastCoord = historicalCoords[historicalCoords.length - 1];
    const predCoord = {
      x: width - 15,
      y: height - 20 - ((pred - minVal) / range) * (height - 40),
      val: pred
    };

    const histPath = historicalCoords.reduce((acc, curr, i) => {
      return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');

    const areaPath = `${histPath} L ${lastCoord.x} ${height} L 10 ${height} Z`;
    const forecastPath = `M ${lastCoord.x} ${lastCoord.y} L ${predCoord.x} ${predCoord.y}`;

    return { historicalCoords, lastCoord, predCoord, histPath, areaPath, forecastPath, width, height };
  }, [currentStock]);

  return (
    <div className="landing-page-wrapper" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden', width: '100%' }}>
      
      {/* Background ambient glowing light orbs */}
      <div style={{ position: 'fixed', width: 'min(600px, 90vw)', height: 'min(600px, 90vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)', top: '-150px', left: '-100px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 'min(550px, 90vw)', height: 'min(550px, 90vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(0,0,0,0) 70%)', top: '35%', right: '-120px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header / Top Navigation */}
      <header className="landing-header">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)',
            flexShrink: 0
          }}>
            <Cpu size={20} style={{ color: '#ffffff' }} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.28rem', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
            Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span>
          </span>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hide-on-mobile" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#hero" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem', transition: 'color 0.2s' }}>Home</a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', transition: 'color 0.2s' }}>Features</a>
          <a href="#sandbox" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', transition: 'color 0.2s' }}>AI Sandbox</a>
          <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', transition: 'color 0.2s' }}>How It Works</a>
          <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>About</Link>
        </nav>

        {/* Right Actions & Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          {/* Market Status Pill */}
          <div className="hide-on-mobile" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '20px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: '0.74rem',
            fontWeight: '700',
            color: 'var(--bullish-green)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--bullish-green)', display: 'inline-block' }} />
            NSE LIVE
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              background: 'var(--bg-chip)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              width: '36px',
              height: '36px',
              flexShrink: 0
            }}
          >
            {theme === 'dark' ? <Sun size={17} style={{ color: '#fbbf24' }} /> : <Moon size={17} style={{ color: '#6366f1' }} />}
          </button>

          {/* Desktop Auth Buttons */}
          <div className="hide-on-mobile" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
                }}
              >
                Launch Terminal <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => handleOpenAuth('login')}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-primary)', 
                    cursor: 'pointer', 
                    fontWeight: '700', 
                    fontSize: '0.86rem',
                    padding: '6px 12px'
                  }}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleOpenAuth('register')}
                  style={{ 
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                    color: '#ffffff', 
                    border: 'none',
                    borderRadius: '8px', 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="hide-on-desktop" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              onClick={handleInstantDemo}
              style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '6px 10px', 
                fontSize: '0.78rem', 
                fontWeight: '700', 
                cursor: 'pointer' 
              }}
            >
              Demo
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              style={{
                background: 'var(--bg-chip)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Live Market Ticker Marquee */}
      <div className="landing-ticker-wrapper">
        <div className="landing-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="landing-ticker-item">
              <span style={{ color: 'var(--text-secondary)' }}>{item.sym}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{item.val}</span>
              <span style={{ 
                color: item.up ? 'var(--bullish-green)' : 'var(--bearish-red)',
                backgroundColor: item.up ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.74rem'
              }}>
                {item.chg} {item.up ? '▲' : '▼'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="landing-mobile-drawer">
          <a 
            href="#hero" 
            className="landing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Home</span>
            <ChevronRight size={16} color="var(--text-muted)" />
          </a>
          <a 
            href="#features" 
            className="landing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Features</span>
            <ChevronRight size={16} color="var(--text-muted)" />
          </a>
          <a 
            href="#sandbox" 
            className="landing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>AI Prediction Sandbox</span>
            <ChevronRight size={16} color="var(--text-muted)" />
          </a>
          <a 
            href="#how-it-works" 
            className="landing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>How It Works</span>
            <ChevronRight size={16} color="var(--text-muted)" />
          </a>
          <Link 
            to="/about" 
            className="landing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>About</span>
            <ChevronRight size={16} color="var(--text-muted)" />
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <button 
              onClick={() => handleOpenAuth('register')} 
              style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                color: '#fff', 
                border: 'none',
                borderRadius: '10px', 
                padding: '12px', 
                fontSize: '0.92rem',
                fontWeight: '700',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              Get Started Free
            </button>
            <button 
              onClick={handleInstantDemo} 
              style={{ 
                background: 'var(--bg-chip)', 
                color: 'var(--text-primary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '10px', 
                padding: '12px', 
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Zap size={16} style={{ color: 'var(--accent-purple)' }} /> 1-Click Instant Demo
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="landing-hero-section">
        <div className="landing-hero-grid">
          
          {/* Left Hero Details */}
          <div className="landing-hero-content">
            {/* High-Contrast Pill Badge with Glowing Pulse */}
            <div className="landing-hero-badge">
              <span className="landing-badge-beacon" />
              <span className="landing-badge-text">
                NEXT-GEN ML FORECASTING ENGINE
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="landing-hero-title">
              AI-Powered <br className="hide-on-mobile" />
              <span style={{ 
                background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                Stock Market Prediction
              </span> <br className="hide-on-mobile" />
              with High Precision
            </h1>
            
            <p className="landing-hero-desc">
              Harness deep LSTM recurrent neural networks, XGBoost regressors, and 14+ technical momentum indicators to forecast next-day price trajectories with explainable AI confidence scores.
            </p>

            {/* CTAs */}
            <div className="landing-cta-group">
              <button 
                onClick={() => handleOpenAuth('register')} 
                className="landing-hero-btn-primary"
              >
                Start Predicting Free <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={handleInstantDemo} 
                className="landing-hero-btn-secondary"
              >
                <Play size={14} fill="currentColor" /> Interactive Demo
              </button>
            </div>

            {/* Quick Stats Panel */}
            <div className="landing-stats-row">
              <div className="landing-stat-item">
                <h4 className="landing-stat-val" style={{ color: 'var(--bullish-green)' }}>98.92%</h4>
                <p className="landing-stat-lbl">Historical Accuracy</p>
              </div>
              <div className="landing-stat-item">
                <h4 className="landing-stat-val" style={{ color: 'var(--accent-cyan)' }}>6+</h4>
                <p className="landing-stat-lbl">Key NSE Engines</p>
              </div>
              <div className="landing-stat-item">
                <h4 className="landing-stat-val" style={{ color: 'var(--accent-purple)' }}>LSTM + XGB</h4>
                <p className="landing-stat-lbl">Ensemble Model</p>
              </div>
            </div>
          </div>

          {/* Right Hero Live Interactive Graphical Terminal Preview Card */}
          <div className="landing-terminal-container">
            <div className="landing-terminal-card">
              
              {/* Terminal Header Bar with Stock Selector Tabs */}
              <div className="landing-terminal-topbar">
                <div className="stock-selector-scroll">
                  {Object.keys(PREVIEW_STOCKS).map((sym) => (
                    <button
                      key={sym}
                      onClick={() => setSelectedSymbol(sym)}
                      className={`stock-selector-pill ${selectedSymbol === sym ? 'active' : ''}`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>

                <div className="stock-signal-badge-wrapper">
                  <span className="stock-signal-badge">
                    {currentStock.signal}
                  </span>
                </div>
              </div>

              {/* Price & Change Banner */}
              <div className="landing-price-banner">
                <div>
                  <span className="landing-stock-exchange">
                    {currentStock.exchange} • {currentStock.name}
                  </span>
                  <h3 className="landing-stock-price">
                    ₹{currentStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className="landing-stock-change">
                    +{currentStock.change}% ▲
                  </span>
                </div>
              </div>

              {/* Interactive Graphical SVG Area & Forecast Chart */}
              <div className="landing-chart-container">
                <svg 
                  viewBox={`0 0 ${chartSvgData.width} ${chartSvgData.height}`} 
                  className="landing-chart-svg"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="forecastGlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area under historical curve */}
                  <path d={chartSvgData.areaPath} fill="url(#chartGradient)" />

                  {/* Historical Price Curve */}
                  <path 
                    d={chartSvgData.histPath} 
                    fill="none" 
                    stroke="#6366f1" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />

                  {/* AI Projection Dashed Trajectory */}
                  <path 
                    d={chartSvgData.forecastPath} 
                    fill="none" 
                    stroke="url(#forecastGlow)" 
                    strokeWidth="2.5" 
                    strokeDasharray="4 4" 
                    strokeLinecap="round" 
                  />

                  {/* Historical Coordinate Points */}
                  {chartSvgData.historicalCoords.map((pt, i) => (
                    <circle 
                      key={i} 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="3" 
                      fill="#6366f1" 
                      stroke="var(--card-bg)" 
                      strokeWidth="1.5" 
                    />
                  ))}

                  {/* Predicted Tomorrow Target Point (Animated Radar) */}
                  <circle 
                    cx={chartSvgData.predCoord.x} 
                    cy={chartSvgData.predCoord.y} 
                    r="5.5" 
                    fill="#10b981" 
                    stroke="#fff" 
                    strokeWidth="2" 
                  />
                </svg>

                {/* AI Target Tooltip Pin */}
                <div className="landing-chart-target-badge">
                  <Sparkles size={11} /> Target: ₹{currentStock.forecast} (+{currentStock.forecastChange}%)
                </div>
              </div>

              {/* Technical Indicator Badges */}
              <div className="landing-indicator-grid">
                <div className="landing-indicator-box">
                  <div className="landing-indicator-lbl">RSI (14)</div>
                  <div className="landing-indicator-val" style={{ color: 'var(--bullish-green)' }}>
                    {currentStock.rsi}
                  </div>
                </div>

                <div className="landing-indicator-box">
                  <div className="landing-indicator-lbl">MACD</div>
                  <div className="landing-indicator-val" style={{ color: 'var(--accent-cyan)' }}>
                    Bullish Cross
                  </div>
                </div>

                <div className="landing-indicator-box">
                  <div className="landing-indicator-lbl">CONFIDENCE</div>
                  <div className="landing-indicator-val" style={{ color: 'var(--accent-purple)' }}>
                    {currentStock.lstmConfidence}
                  </div>
                </div>
              </div>

              {/* Bull vs Bear Split Meter */}
              <div className="landing-sentiment-bar-card">
                <div className="landing-sentiment-header">
                  <span style={{ fontWeight: '700', color: 'var(--bullish-green)' }}>🐂 Bullish ({currentStock.sentimentScore}%)</span>
                  <span style={{ fontWeight: '700', color: 'var(--bearish-red)' }}>🐻 Bearish ({100 - currentStock.sentimentScore}%)</span>
                </div>
                <div className="landing-sentiment-track">
                  <div className="landing-sentiment-fill" style={{ width: `${currentStock.sentimentScore}%` }} />
                </div>
              </div>

            </div>

            {/* Glowing Ambient Backdrop */}
            <div className="landing-terminal-ambient" />
          </div>

        </div>
      </section>

      {/* Interactive Live AI Prediction Sandbox Playground */}
      <section id="sandbox" className="landing-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="landing-hero-badge" style={{ marginBottom: '12px' }}>
              <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
              <span className="landing-badge-text">Interactive Live Sandbox</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', fontWeight: '900', marginBottom: '10px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
              Test The AI Forecasting Engine Live
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Select any blue-chip stock in the preview terminal above to simulate real-time neural regression inference, indicator breakdown, and multi-model consensus.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            
            {/* Box 1: Model Consensus */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={18} style={{ color: 'var(--accent-purple)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '800' }}>Ensemble Consensus</h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Multi-Architecture Validation</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--bg-chip)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Deep LSTM Regressor</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--bullish-green)', fontFamily: 'var(--font-mono)' }}>{currentStock.lstmConfidence}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--bg-chip)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>XGBoost Gradient Tree</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{currentStock.xgboostConfidence}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--bg-chip)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Random Forest Engine</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>90.4%</span>
                </div>
              </div>
            </div>

            {/* Box 2: Tomorrow Forecast Signal */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={18} style={{ color: 'var(--bullish-green)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '800' }}>Target Projection</h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Session High Calculation</p>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '14px 10px', background: 'var(--bg-chip)', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Estimated Tomorrow High</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--bullish-green)', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
                  ₹{currentStock.forecast.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </h3>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--bullish-green)' }}>
                  +{currentStock.forecastChange}% Projected Upside
                </span>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '9px', 
                  fontSize: '0.82rem', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Inspect Live in Terminal <ArrowRight size={14} />
              </button>
            </div>

            {/* Box 3: Explainable Feature Breakdown */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sliders size={18} style={{ color: 'var(--accent-cyan)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '800' }}>Explainable AI Metrics</h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Top Driving Feature Weights</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px', fontWeight: '600' }}>
                    <span>14-Day RSI Momentum</span>
                    <span style={{ color: 'var(--bullish-green)' }}>38% Influence</span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--bg-chip)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '38%', height: '100%', background: 'var(--bullish-green)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px', fontWeight: '600' }}>
                    <span>MACD Crossover Delta</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>32% Influence</span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--bg-chip)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '32%', height: '100%', background: 'var(--accent-cyan)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px', fontWeight: '600' }}>
                    <span>50-Day MA Lag</span>
                    <span style={{ color: 'var(--accent-purple)' }}>30% Influence</span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--bg-chip)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '30%', height: '100%', background: 'var(--accent-purple)' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Cards Grid: Engineered for Intelligent Investors */}
      <section id="features" className="landing-section" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="landing-hero-badge" style={{ marginBottom: '12px' }}>
              <Layers size={14} style={{ color: 'var(--accent-purple)' }} />
              <span className="landing-badge-text">Architecture & Capabilities</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', fontWeight: '900', marginBottom: '10px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
              Engineered for Intelligent Investors
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Sophisticated metrics, AI analysis, and prediction tools merged into a seamless dashboard.
            </p>
          </div>

          <div className="landing-features-grid">
            
            <div className="landing-feature-card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Cpu size={22} style={{ color: 'var(--accent-purple)' }} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>Neural LSTM Predictions</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Tomorrow's High/Low calculations modeled with LSTM and XGBoost regressors based on multi-day OHLCV temporal features.
              </p>
            </div>

            <div className="landing-feature-card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Activity size={22} style={{ color: 'var(--accent-cyan)' }} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>Real-Time Market Feeds</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Live streaming quotes for NSE blue-chip companies, custom sparklines, and instant stock indicators.
              </p>
            </div>

            <div className="landing-feature-card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <BarChart2 size={22} style={{ color: 'var(--bullish-green)' }} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>14+ Technical Overlays</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                On-demand overlays for SMA, EMA, MACD, RSI 14, ATR, and Bollinger bands mapped to candlestick points.
              </p>
            </div>

            <div className="landing-feature-card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Layers size={22} style={{ color: 'var(--warning-yellow)' }} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>Explainable AI Insights</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Explainable AI predictions summarizing indicator state thresholds, feature weights, and historical trends.
              </p>
            </div>

            <div className="landing-feature-card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <ShieldCheck size={22} style={{ color: 'var(--accent-purple)' }} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>Institutional Risk Guard</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Real-time beta tracking, volatility indexes, and risk probability estimates for open positions.
              </p>
            </div>

            <div className="landing-feature-card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <TrendingUp size={22} style={{ color: 'var(--accent-cyan)' }} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>Portfolio Health Matrix</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Holdings records consolidated with allocation charts, sector exposure, and health assessments.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Workflow Section */}
      <section id="how-it-works" className="landing-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          
          <div className="landing-hero-badge" style={{ marginBottom: '12px' }}>
            <Radio size={14} style={{ color: 'var(--accent-purple)' }} />
            <span className="landing-badge-text">Processing Pipeline</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', fontWeight: '900', marginBottom: '10px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            How StockAI Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto 36px auto', fontSize: '0.92rem' }}>
            From raw exchange ticks to high-confidence probability forecasts across 5 synchronized stages.
          </p>

          {/* Desktop Workflow Pipeline */}
          <div className="hide-on-mobile landing-workflow-container">
            {[
              { num: '1', label: 'Market Data Ingestion', sub: 'Historical & Live OHLCV Feeds' },
              { num: '2', label: 'Feature Engineering', sub: '14+ Technical Momentum Indicators' },
              { num: '3', label: 'Deep Learning Regressors', sub: 'LSTM + XGBoost Ensemble' },
              { num: '4', label: 'Explainable AI Engine', sub: 'Indicator Weight Breakdown' },
              { num: '5', label: 'Target Projections', sub: 'Tomorrow High / Low & Signals' }
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div style={{ flex: 1, minWidth: '130px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent-purple)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 10px auto',
                    fontWeight: '800',
                    fontSize: '0.92rem',
                    color: '#ffffff',
                    boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)'
                  }}>
                    {step.num}
                  </div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '3px', color: 'var(--text-primary)' }}>{step.label}</h5>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{step.sub}</p>
                </div>
                {idx < arr.length - 1 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 'bold' }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Workflow Vertical Timeline */}
          <div className="hide-on-desktop" style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            {[
              { num: '1', label: 'Market Data Ingestion', sub: 'Live NSE & Global OHLCV Historical Feed' },
              { num: '2', label: 'Feature Engineering', sub: '14+ Technical Overlays & Price Momentum' },
              { num: '3', label: 'Deep Learning Regressors', sub: 'LSTM, XGBoost & Random Forest Models' },
              { num: '4', label: 'Explainable AI Engine', sub: 'Confidence Ratings & Signal Reasoning' },
              { num: '5', label: 'Target Projections', sub: 'Tomorrow Forecast & Target Targets' }
            ].map((step, idx) => (
              <div key={idx} className="landing-workflow-step-mobile">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {step.num}
                </div>
                <div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>{step.label}</h5>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{step.sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Supported Analysis Section & Model Integrity Statement */}
      <section className="landing-section" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="landing-matrix-grid">
            
            <div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', fontWeight: '900', marginBottom: '12px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                Supported Technical Analysis Matrix
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6', fontSize: '0.9rem' }}>
                StockAI parses millions of market data vectors dynamically to feed our deep learning regression models, evaluating each session against key parameters:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Daily Close & Volume Momentum Spikes',
                  'Relative Strength Index (RSI 14) threshold divergence',
                  'MACD signal line crossovers & histogram velocity',
                  'Bollinger Band limits (support/resistance envelopes)',
                  'Average True Range (ATR) historical volatility index',
                  'Historical ML backtest vs actual output calibration'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle size={14} style={{ color: 'var(--bullish-green)' }} />
                    </div>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '600' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Model Integrity Statement Card */}
            <div style={{ 
              padding: '24px 20px', 
              backgroundColor: 'var(--card-bg)', 
              borderRadius: '16px', 
              border: '1px solid var(--border-color)', 
              boxShadow: 'var(--card-shadow)',
              backdropFilter: 'blur(16px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldCheck size={20} style={{ color: 'var(--accent-purple)' }} />
                <h4 style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Model Integrity Statement</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                Our systems calculate predictive vectors using mathematical statistical regressions. These values represent mathematical probabilities based on historical indices, not financial advisory recommendations.
              </p>
              
              <div style={{ backgroundColor: 'var(--bg-chip)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Tomorrow's Session High</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Input Features:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>OHLCV + 14 Technical Indicators</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Validation Spec:</span>
                  <span style={{ fontWeight: '700', color: 'var(--bullish-green)' }}>10 Years NSE History</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="landing-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', fontWeight: '900', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Everything you need to know about StockAI machine learning models and data feeds.
            </p>
          </div>

          <div>
            {FAQS.map((faq, idx) => (
              <div key={idx} className="landing-faq-item">
                <button 
                  className="landing-faq-trigger"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span style={{ paddingRight: '8px' }}>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: 'transform 0.2s ease',
                      color: openFaq === idx ? 'var(--accent-purple)' : 'var(--text-muted)',
                      flexShrink: 0
                    }} 
                  />
                </button>
                {openFaq === idx && (
                  <div className="landing-faq-content">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Conversion Banner */}
      <section className="landing-section" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto', 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)', 
          border: '1px solid rgba(99, 102, 241, 0.35)', 
          borderRadius: '20px', 
          padding: '40px 24px', 
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', fontWeight: '900', marginBottom: '12px', color: 'var(--text-primary)' }}>
            Supercharge Your Trading with AI Forecasting
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 24px auto', fontSize: '0.94rem', lineHeight: '1.6' }}>
            Access deep LSTM neural forecasts, real-time indicators, and explainable AI confidence scores today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleOpenAuth('register')}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 28px',
                fontSize: '0.94rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
              }}
            >
              Get Started Free <ArrowRight size={16} style={{ display: 'inline', marginLeft: '6px' }} />
            </button>
            <button
              onClick={handleInstantDemo}
              style={{
                background: 'var(--bg-chip)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '12px 22px',
                fontSize: '0.94rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Zap size={16} style={{ display: 'inline', marginRight: '6px', color: 'var(--accent-purple)' }} /> 1-Click Instant Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '32px 6%', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
          <Link to="/features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Features</Link>
          <Link to="/how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>How It Works</Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>About Us</Link>
          <button onClick={handleInstantDemo} style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', cursor: 'pointer', fontWeight: '600', fontSize: 'inherit' }}>Live Demo</button>
        </div>
        <p>© 2026 StockAI Platform. All rights reserved. Powered by Deep Learning regressions.</p>
      </footer>

      {/* Simple Email & Password Auth Modal */}
      {showAuthModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuthModal(false);
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '18px',
              padding: '24px 20px',
              boxShadow: 'var(--card-shadow)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={18} style={{ color: '#fff' }} />
                </div>
                <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span>
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {authMode === 'login' ? 'Sign In to Terminal' : 'Create Free Account'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Simple Email & Password authentication
              </p>
            </div>

            {authError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 12px', color: 'var(--bearish-red)', fontSize: '0.8rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {authMode === 'register' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text"
                      required
                      placeholder="Arjun Trader"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      style={{ width: '100%', height: '40px', paddingLeft: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none' }}
                    />
                    <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    style={{ width: '100%', height: '40px', paddingLeft: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none' }}
                  />
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="password"
                    required
                    placeholder="Enter password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={{ width: '100%', height: '40px', paddingLeft: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none' }}
                  />
                  <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <button 
                type="submit"
                disabled={authLoading}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '4px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                }}
              >
                {authLoading ? 'Authenticating...' : authMode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}
              </button>
            </form>

            {/* Quick 1-Click Instant Demo Access */}
            <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={handleInstantDemo}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  color: 'var(--accent-purple)',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Zap size={14} /> Instant Demo Access (1-Click)
              </button>
            </div>

            {/* Mode Switcher */}
            <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {authMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => handleOpenAuth('register')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-purple)', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => handleOpenAuth('login')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-purple)', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
