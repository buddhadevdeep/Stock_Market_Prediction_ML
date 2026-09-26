import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { stockApi } from '../../api/stockApi';
import { predictionApi } from '../../api/predictionApi';
import ConfidenceGauge from '../../components/common/ConfidenceGauge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import StockNotFound from '../../components/common/StockNotFound';
import { 
  Cpu, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Target,
  BarChart3,
  BookOpen
} from 'lucide-react';

const POPULAR_SYMBOLS = [
  'NIFTY 50', 'SENSEX', 'NIFTY BANK', 'TCS', 'INFY', 'RELIANCE', 'TATAPOWER', 'HAL', 'CUPID', 'SBIN', 'HDFCBANK', 'TITAN'
];

export const StockPrediction = () => {
  const { currentSymbol, setCurrentSymbol, watchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [stockDetails, setStockDetails] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPredictionData = async () => {
      setLoading(true);
      setError('');
      try {
        const [details, pred] = await Promise.all([
          stockApi.getStock(currentSymbol),
          predictionApi.getPrediction(currentSymbol)
        ]);
        setStockDetails(details);
        setPrediction(pred);
      } catch (err) {
        setError(err.message || 'Failed to fetch predictions.');
      } finally {
        setLoading(false);
      }
    };
    loadPredictionData();
  }, [currentSymbol]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <SkeletonLoader type="card" count={3} />
        <SkeletonLoader type="chart" />
      </div>
    );
  }

  if (error) {
    return (
      <StockNotFound 
        symbol={currentSymbol} 
        customMessage={error} 
        onReset={() => setError('')} 
      />
    );
  }


  const isWatchlisted = watchlist.includes(currentSymbol);
  const isBullish = prediction?.trend?.toLowerCase() === 'bullish';
  const signal = prediction?.tradingSignal || 'HOLD';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Stock Selector Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="horizontal-scroll-container" style={{ flex: 1, minWidth: 0, padding: '4px 0', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', flexShrink: 0, marginRight: '4px' }}>QUICK NSE TICKERS:</span>
          {POPULAR_SYMBOLS.map(sym => (
            <button
              key={sym}
              onClick={() => setCurrentSymbol(sym)}
              className="custom-tab-btn"
              style={{
                background: currentSymbol === sym ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-chip)',
                color: currentSymbol === sym ? 'var(--accent-purple)' : 'var(--text-secondary)',
                border: currentSymbol === sym ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '6px 14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {sym}
            </button>
          ))}
        </div>

        <button 
          onClick={() => isWatchlisted ? removeFromWatchlist(currentSymbol) : addToWatchlist(currentSymbol)}
          className="btn-outline-custom"
          style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
        >
          <Eye size={16} style={{ color: isWatchlisted ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
          {isWatchlisted ? 'Remove Watchlist' : 'Add Watchlist'}
        </button>
      </div>

      {/* 2. Main Two-Column Forecast & Live Quote Layout */}
      <div className="responsive-grid-2">
        
        {/* Left Column: Live Stock Market Quote */}
        {stockDetails && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stockDetails.exchange} LIVE QUOTE
                </span>
                <h2 style={{ fontSize: '1.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', color: 'var(--text-primary)' }}>
                  {stockDetails.symbol}
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '500' }}>({stockDetails.name})</span>
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  ₹{stockDetails.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <span 
                  className={stockDetails.change >= 0 ? 'text-bullish' : 'text-bearish'} 
                  style={{ fontSize: '0.95rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {stockDetails.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stockDetails.change >= 0 ? '+' : ''}{stockDetails.change?.toFixed(2)} ({stockDetails.pctChange >= 0 ? '+' : ''}{stockDetails.pctChange}%)
                </span>
              </div>
            </div>

            {/* Grid of Key Technical Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-chip)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Open</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>₹{stockDetails.open?.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-chip)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Day High</span>
                <strong className="text-bullish" style={{ fontFamily: 'var(--font-mono)' }}>₹{stockDetails.high?.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-chip)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Day Low</span>
                <strong className="text-bearish" style={{ fontFamily: 'var(--font-mono)' }}>₹{stockDetails.low?.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-chip)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Prev Close</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>₹{stockDetails.prevClose?.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-chip)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Trading Volume</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{stockDetails.volume?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-chip)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Market Cap</span>
                <strong style={{ color: 'var(--accent-purple)' }}>{stockDetails.marketCap}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-chip)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>52W High</span>
                <strong className="text-bullish" style={{ fontFamily: 'var(--font-mono)' }}>₹{stockDetails.week52High?.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-chip)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>52W Low</span>
                <strong className="text-bearish" style={{ fontFamily: 'var(--font-mono)' }}>₹{stockDetails.week52Low?.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Tomorrow's Complete Forecast Target (High, Low, Range, Direction, Signal) */}
        {prediction && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '3px solid var(--accent-purple)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} style={{ color: 'var(--accent-purple)' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-primary)' }}>
                  TOMORROW&apos;S FORECAST TARGET
                </h4>
              </div>
              <span className="badge" style={{ background: isBullish ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: isBullish ? 'var(--bullish-green)' : 'var(--bearish-red)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                {isBullish ? 'BULLISH MOMENTUM' : 'BEARISH MOMENTUM'}
              </span>
            </div>

            {/* High, Low, Range Highlight Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', background: 'var(--bg-chip)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              
              {/* Predicted High */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <TrendingUp size={14} className="text-bullish" /> PREDICTED HIGH
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--bullish-green)', fontFamily: 'var(--font-mono)' }}>
                  ₹{prediction.tomorrowHigh?.toFixed(2)}
                </div>
              </div>

              {/* Predicted Low */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <TrendingDown size={14} className="text-bearish" /> PREDICTED LOW
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--bearish-red)', fontFamily: 'var(--font-mono)' }}>
                  ₹{prediction.tomorrowLow?.toFixed(2)}
                </div>
              </div>

              {/* Expected Range */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <Layers size={14} style={{ color: 'var(--accent-purple)' }} /> EXPECTED RANGE
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                  ₹{prediction.expectedRange?.toFixed(2)}
                </div>
              </div>

            </div>

            {/* Trading Signal & Confidence Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
              
              {/* Signal Badge & Rule */}
              <div style={{ background: 'var(--bg-chip)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '6px' }}>SUPERVISED TRADING SIGNAL</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span 
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      background: signal === 'BUY' ? 'rgba(16,185,129,0.2)' : signal === 'SELL' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                      color: signal === 'BUY' ? 'var(--bullish-green)' : signal === 'SELL' ? 'var(--bearish-red)' : 'var(--warning-yellow)',
                      border: `1px solid ${signal === 'BUY' ? 'var(--bullish-green)' : signal === 'SELL' ? 'var(--bearish-red)' : 'var(--warning-yellow)'}`
                    }}
                  >
                    {signal}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rule: Return &plusmn;1%</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence: {prediction.signalConfidence}%</div>
              </div>

              {/* Confidence Gauge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ConfidenceGauge 
                  value={prediction.confidence} 
                  label="Prediction Confidence" 
                  statusText={isBullish ? 'Bullish' : 'Bearish'}
                  size={140}
                />
              </div>

            </div>

            {/* Baseline Model Comparison Box */}
            {prediction.baseline && (
              <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px dashed var(--accent-purple)', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <BookOpen size={16} style={{ color: 'var(--accent-purple)' }} />
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Phase 3 Baseline vs. Phase 5 Ensemble</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div>Linear Regression High: <strong style={{ color: 'var(--text-primary)' }}>₹{prediction.baseline.predictedHigh}</strong></div>
                  <div>Linear Regression Low: <strong style={{ color: 'var(--text-primary)' }}>₹{prediction.baseline.predictedLow}</strong></div>
                  <div>Custom Tree Direction: <strong style={{ color: 'var(--text-primary)' }}>{prediction.baseline.direction}</strong></div>
                  <div>Custom Tree Signal: <strong style={{ color: 'var(--text-primary)' }}>{prediction.baseline.signal}</strong></div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* 3. Machine Learning Model Statistics & Explanations */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BarChart3 size={20} style={{ color: 'var(--accent-cyan)' }} />
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
            MACHINE LEARNING MODEL ARCHITECTURE &amp; EVALUATION
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div style={{ background: 'var(--bg-chip)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Regression Model</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-cyan)', marginTop: '2px' }}>Linear Regression + Random Forest</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Target: Tomorrow High &amp; Low Prices</div>
          </div>

          <div style={{ background: 'var(--bg-chip)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase 3 Manual Classifier</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-purple)', marginTop: '2px' }}>Custom Decision Tree</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Split Metric: Gini Impurity (No sklearn)</div>
          </div>

          <div style={{ background: 'var(--bg-chip)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase 5 Ensemble</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--bullish-green)', marginTop: '2px' }}>Random Forest (100 Trees)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Chronological TimeSeries Validation</div>
          </div>

          <div style={{ background: 'var(--bg-chip)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Data Leakage Prevention</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f59e0b', marginTop: '2px' }}>Zero Lookahead Shift(-1)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Scalers fitted strictly on train split</div>
          </div>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          <strong>Academic Note:</strong> Tomorrow&apos;s price targets are forecasted using supervised regression trained on technical indicators available up to the current session (SMAs, rolling volatility, return ratios, momentum). Gini Impurity formula: <code style={{ color: 'var(--accent-purple)' }}>Gini = 1 - &Sigma; (p_i)&sup2;</code>.
        </p>
      </div>

    </div>
  );
};

export default StockPrediction;
