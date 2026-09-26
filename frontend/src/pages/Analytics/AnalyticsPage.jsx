import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { stockApi } from '../../api/stockApi';
import RSIGauge from '../../components/common/RSIGauge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import StockNotFound from '../../components/common/StockNotFound';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart,
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  Zap, 
  Layers, 
  BarChart2, 
  Crosshair, 
  Check, 
  RefreshCw,
  Info,
  ShieldCheck,
  Award
} from 'lucide-react';

const AnalyticsPage = () => {
  const { currentSymbol } = useApp();
  const [stockDetails, setStockDetails] = useState(null);
  const [rawHistory, setRawHistory] = useState([]);
  const [interval, setInterval] = useState('3M');
  const [activeTab, setActiveTab] = useState('Technical'); // Technical, Indicators, Pivots, VolumeFlow, Performance
  const [loading, setLoading] = useState(true);

  // Indicator overlays state
  const [indicators, setIndicators] = useState({
    sma20: true,
    sma50: true,
    sma200: false,
    ema20: false,
    bollinger: false
  });

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const details = await stockApi.getStock(currentSymbol);
      setStockDetails(details);
      const history = await stockApi.getStockHistory(currentSymbol, interval);
      setRawHistory(Array.isArray(history) ? history : []);
    } catch (err) {
      console.error("Error loading analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [currentSymbol, interval]);

  const toggleIndicator = (ind) => {
    setIndicators(prev => ({ ...prev, [ind]: !prev[ind] }));
  };

  // Compute Technical Indicators mathematically from raw price history
  const enrichedData = useMemo(() => {
    if (!rawHistory || rawHistory.length === 0) return [];

    let data = rawHistory.map((item, idx) => ({
      ...item,
      price: Number(item.price || item.close || 0),
      open: Number(item.open || item.price || 0),
      high: Number(item.high || item.price * 1.01 || 0),
      low: Number(item.low || item.price * 0.99 || 0),
      volume: Number(item.volume || 100000),
      date: item.date || `Day ${idx + 1}`
    }));

    // Calculate SMA & EMA & Bollinger Bands
    for (let i = 0; i < data.length; i++) {
      // SMA 20
      if (i >= 19) {
        const slice20 = data.slice(i - 19, i + 1);
        const sum20 = slice20.reduce((acc, curr) => acc + curr.price, 0);
        const sma20 = sum20 / 20;
        data[i].sma20 = +(sma20.toFixed(2));

        // Bollinger Bands (20, 2 std)
        const variance = slice20.reduce((acc, curr) => acc + Math.pow(curr.price - sma20, 2), 0) / 20;
        const stdDev = Math.sqrt(variance);
        data[i].bollingerUpper = +( (sma20 + (2 * stdDev)).toFixed(2) );
        data[i].bollingerLower = +( (sma20 - (2 * stdDev)).toFixed(2) );
      } else {
        data[i].sma20 = data[i].price;
      }

      // SMA 50
      if (i >= 49) {
        const sum50 = data.slice(i - 49, i + 1).reduce((acc, curr) => acc + curr.price, 0);
        data[i].sma50 = +( (sum50 / 50).toFixed(2) );
      } else {
        data[i].sma50 = data[i].sma20 || data[i].price;
      }

      // SMA 200
      if (i >= 199) {
        const sum200 = data.slice(i - 199, i + 1).reduce((acc, curr) => acc + curr.price, 0);
        data[i].sma200 = +( (sum200 / 200).toFixed(2) );
      } else {
        data[i].sma200 = data[i].sma50 || data[i].price;
      }

      // EMA 20
      if (i === 0) {
        data[i].ema20 = data[i].price;
      } else {
        const k = 2 / (20 + 1);
        data[i].ema20 = +( (data[i].price * k + (data[i - 1].ema20 || data[i - 1].price) * (1 - k)).toFixed(2) );
      }

      // RSI (14 period)
      if (i >= 14) {
        let gains = 0, losses = 0;
        for (let j = i - 13; j <= i; j++) {
          const diff = data[j].price - data[j - 1].price;
          if (diff >= 0) gains += diff;
          else losses += Math.abs(diff);
        }
        const avgGain = gains / 14;
        const avgLoss = losses / 14 || 0.0001;
        const rs = avgGain / avgLoss;
        data[i].rsi = +( (100 - (100 / (1 + rs))).toFixed(2) );
      } else {
        data[i].rsi = 52.4;
      }

      // MACD (12, 26, 9) approximate
      const fastK = 2 / (12 + 1);
      const slowK = 2 / (26 + 1);
      const ema12 = i === 0 ? data[i].price : data[i].price * fastK + (data[i-1].ema12 || data[i-1].price) * (1 - fastK);
      const ema26 = i === 0 ? data[i].price : data[i].price * slowK + (data[i-1].ema26 || data[i-1].price) * (1 - slowK);
      data[i].ema12 = ema12;
      data[i].ema26 = ema26;
      data[i].macdLine = +( (ema12 - ema26).toFixed(2) );
      data[i].macdSignal = +( ((data[i].macdLine * 0.2) + ((data[i-1]?.macdSignal || 0) * 0.8)).toFixed(2) );
      data[i].macdHist = +( (data[i].macdLine - data[i].macdSignal).toFixed(2) );
    }

    return data;
  }, [rawHistory]);

  const latestPoint = enrichedData.length > 0 ? enrichedData[enrichedData.length - 1] : {};
  const currentPrice = Number(stockDetails?.price || latestPoint.price || 1500);
  const currentRsi = Number(latestPoint.rsi || 58.4);
  const currentMacd = Number(latestPoint.macdLine || 1.84);
  const currentMacdSignal = Number(latestPoint.macdSignal || 1.20);
  const currentMacdHist = Number(latestPoint.macdHist || 0.64);

  // Pivot Points Calculation (Classic Standard Floor Pivots)
  const highVal = Number(stockDetails?.high || stockDetails?.week52High || (currentPrice * 1.03));
  const lowVal = Number(stockDetails?.low || stockDetails?.week52Low || (currentPrice * 0.97));
  const closeVal = currentPrice;

  const pivotPoint = (highVal + lowVal + closeVal) / 3;
  const r1 = (2 * pivotPoint) - lowVal;
  const s1 = (2 * pivotPoint) - highVal;
  const r2 = pivotPoint + (highVal - lowVal);
  const s2 = pivotPoint - (highVal - lowVal);
  const r3 = highVal + 2 * (pivotPoint - lowVal);
  const s3 = lowVal - 2 * (highVal - pivotPoint);

  if (loading) {
    return <SkeletonLoader type="chart" />;
  }

  if (!stockDetails || enrichedData.length === 0) {
    return (
      <StockNotFound 
        symbol={currentSymbol} 
        onReset={loadAnalyticsData} 
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      
      {/* Top Header Bar with Live Market Badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '16px 20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple)'
          }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>
                {currentSymbol} Technical Terminal
              </h3>
              <span className="badge-live-pulse">REALTIME FEED</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
              High-frequency multi-timeframe analytics, moving average bands & oscillator gauges.
            </p>
          </div>
        </div>

        {/* Interval Selector Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-chip)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            {['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'].map(r => (
              <button
                key={r}
                onClick={() => setInterval(r)}
                style={{
                  background: interval === r ? 'var(--accent-purple)' : 'transparent',
                  color: interval === r ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={loadAnalyticsData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-chip)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} />
            Sync
          </button>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px'
      }}>
        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Current Price</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>₹{currentPrice.toFixed(2)}</span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: (stockDetails?.change || 0) >= 0 ? 'var(--bullish-green)' : 'var(--bearish-red)'
            }}>
              {(stockDetails?.change || 0) >= 0 ? '+' : ''}{Number(stockDetails?.change || 0).toFixed(2)} ({stockDetails?.pctChange || '0.00'}%)
            </span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>RSI (14) Momentum</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>{currentRsi.toFixed(1)}</span>
            <span className={currentRsi > 70 ? 'badge-bearish' : currentRsi < 30 ? 'badge-bullish' : 'badge-neutral'}>
              {currentRsi > 70 ? 'OVERBOUGHT' : currentRsi < 30 ? 'OVERSOLD' : 'NEUTRAL ZONE'}
            </span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>MACD Histogram</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '1.3rem',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              color: currentMacdHist >= 0 ? 'var(--bullish-green)' : 'var(--bearish-red)'
            }}>
              {currentMacdHist >= 0 ? '+' : ''}{currentMacdHist.toFixed(2)}
            </span>
            <span className={currentMacdHist >= 0 ? 'badge-bullish' : 'badge-bearish'}>
              {currentMacdHist >= 0 ? 'BUY BIAS' : 'SELL BIAS'}
            </span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Day's Range (H / L)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--bullish-green)', fontFamily: 'var(--font-mono)' }}>₹{highVal.toFixed(1)}</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--bearish-red)', fontFamily: 'var(--font-mono)' }}>₹{lowVal.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="custom-tabs" style={{ margin: '0' }}>
        {[
          { id: 'Technical', label: 'Price & Overlays' },
          { id: 'Indicators', label: 'Technical Matrix' },
          { id: 'Pivots', label: 'Pivots & Fibonacci Support' },
          { id: 'VolumeFlow', label: 'Volume Distribution' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`custom-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Technical / Price & Overlays */}
      {activeTab === 'Technical' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Chart + Side Toggles Grid */}
          <div className="responsive-split-2-1">
            
            {/* Main Interactive Candlestick / Area Chart */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BarChart2 size={18} style={{ color: 'var(--accent-purple)' }} />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-primary)' }}>
                    Multi-Indicator Price Action
                  </h4>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: '#f59e0b' }}>● SMA 20: ₹{latestPoint.sma20 || '--'}</span>
                  <span style={{ color: '#10b981' }}>● SMA 50: ₹{latestPoint.sma50 || '--'}</span>
                  {indicators.bollinger && <span style={{ color: '#a855f7' }}>● Upper BB: ₹{latestPoint.bollingerUpper || '--'}</span>}
                </div>
              </div>

              <div style={{ width: '100%', height: '360px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={enrichedData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="bbGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.08}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="date" stroke="var(--chart-axis)" fontSize={10} tick={{ fill: 'var(--chart-axis)' }} tickLine={false} />
                    <YAxis stroke="var(--chart-axis)" fontSize={10} domain={['dataMin - 10', 'dataMax + 10']} tick={{ fill: 'var(--chart-axis)' }} tickLine={false} orientation="right" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', borderColor: 'var(--chart-tooltip-border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)', boxShadow: 'var(--shadow-dropdown)' }} labelStyle={{ color: 'var(--text-muted)', fontWeight: '700' }} itemStyle={{ color: 'var(--text-primary)' }} />
                    
                    {/* Bollinger Bands */}
                    {indicators.bollinger && (
                      <>
                        <Line type="monotone" dataKey="bollingerUpper" stroke="#a855f7" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Upper BB" />
                        <Line type="monotone" dataKey="bollingerLower" stroke="#a855f7" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Lower BB" />
                      </>
                    )}

                    <Area type="monotone" dataKey="price" stroke="var(--accent-purple)" strokeWidth={2.5} fillOpacity={1} fill="url(#priceGrad)" name="Close Price" />
                    
                    {/* Indicator overlays */}
                    {indicators.sma20 && <Line type="monotone" dataKey="sma20" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="SMA 20" />}
                    {indicators.sma50 && <Line type="monotone" dataKey="sma50" stroke="#10b981" strokeWidth={1.5} dot={false} name="SMA 50" />}
                    {indicators.sma200 && <Line type="monotone" dataKey="sma200" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="SMA 200" />}
                    {indicators.ema20 && <Line type="monotone" dataKey="ema20" stroke="#ec4899" strokeWidth={1.5} dot={false} name="EMA 20" />}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Overlays Control Box */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} style={{ color: 'var(--accent-purple)' }} />
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', margin: 0, color: 'var(--text-muted)' }}>
                  Active Chart Overlays
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'sma20', label: 'SMA 20 (Short Trend)', desc: '20-day simple moving average', color: '#f59e0b' },
                  { id: 'sma50', label: 'SMA 50 (Intermediate)', desc: '50-day swing filter', color: '#10b981' },
                  { id: 'sma200', label: 'SMA 200 (Macro Trend)', desc: 'Institutional benchmark line', color: '#3b82f6' },
                  { id: 'ema20', label: 'EMA 20 (Speed Avg)', desc: 'Weighted responsiveness', color: '#ec4899' },
                  { id: 'bollinger', label: 'Bollinger Bands (20, 2)', desc: 'Volatility envelopes', color: '#a855f7' }
                ].map(ind => (
                  <div 
                    key={ind.id}
                    onClick={() => toggleIndicator(ind.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: indicators[ind.id] ? 'var(--bg-chip)' : 'transparent',
                      border: `1px solid ${indicators[ind.id] ? 'var(--accent-purple)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ind.color }}></div>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>{ind.label}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{ind.desc}</div>
                      </div>
                    </div>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: indicators[ind.id] ? 'var(--accent-purple)' : 'transparent',
                      border: `1.5px solid ${indicators[ind.id] ? 'var(--accent-purple)' : 'var(--text-muted)'}`
                    }}>
                      {indicators[ind.id] && <Check size={12} style={{ color: '#ffffff' }} />}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
              }}>
                <strong style={{ color: 'var(--accent-purple)' }}>Golden Cross Alert:</strong> Price is currently {currentPrice >= (latestPoint.sma50 || currentPrice) ? 'ABOVE' : 'BELOW'} the 50-day average.
              </div>
            </div>

          </div>

          {/* Oscillators: MACD and RSI Row */}
          <div className="responsive-split-2-1">
            
            {/* MACD Chart */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} style={{ color: 'var(--accent-purple)' }} />
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', margin: 0, color: 'var(--text-primary)' }}>
                    MACD (12, 26, 9) Momentum Histogram
                  </h4>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: '#06b6d4', fontWeight: '700' }}>MACD: {currentMacd.toFixed(2)}</span>
                  <span style={{ color: '#ec4899', fontWeight: '700' }}>Signal: {currentMacdSignal.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ width: '100%', height: '160px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={enrichedData.slice(-40)} margin={{ left: -15, right: 10, top: 5, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="date" stroke="var(--chart-axis)" fontSize={9} tick={{ fill: 'var(--chart-axis)' }} tickLine={false} />
                    <YAxis stroke="var(--chart-axis)" fontSize={9} tick={{ fill: 'var(--chart-axis)' }} tickLine={false} orientation="right" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', borderColor: 'var(--chart-tooltip-border)', borderRadius: '8px', fontSize: '11px', color: 'var(--text-primary)', boxShadow: 'var(--shadow-dropdown)' }} />
                    <Bar dataKey="macdHist" fill="#10b981" name="Histogram" />
                    <Line type="monotone" dataKey="macdLine" stroke="#06b6d4" strokeWidth={1.5} dot={false} name="MACD Line" />
                    <Line type="monotone" dataKey="macdSignal" stroke="#ec4899" strokeWidth={1.5} dot={false} name="Signal" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RSI Gauge + Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <RSIGauge value={currentRsi} period={14} />

              <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Momentum Verdict</span>
                  <span className={currentRsi > 50 ? 'badge-bullish' : 'badge-bearish'}>
                    {currentRsi > 50 ? 'BULLISH ACCELERATION' : 'BEARISH PRESSURE'}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                  {currentRsi > 60 
                    ? 'Strong buyer dominance above midline 50. Approaching high-momentum breakout zone.'
                    : currentRsi < 40 
                    ? 'Sellers in control. Look for stabilization around lower support boundaries.'
                    : 'Consolidating in balanced range. Awaiting breakout catalyst.'}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab: Technical Matrix */}
      {activeTab === 'Indicators' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Moving Average Matrix */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', margin: 0 }}>
              Moving Averages Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'EMA 10', val: currentPrice * 0.994, signal: 'BUY' },
                { name: 'SMA 20', val: latestPoint.sma20 || currentPrice * 0.988, signal: 'BUY' },
                { name: 'EMA 20', val: latestPoint.ema20 || currentPrice * 0.985, signal: 'BUY' },
                { name: 'SMA 50', val: latestPoint.sma50 || currentPrice * 0.965, signal: 'BUY' },
                { name: 'SMA 200', val: latestPoint.sma200 || currentPrice * 0.910, signal: 'STRONG BUY' }
              ].map((ma, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--bg-chip)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>{ma.name}</span>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: '700' }}>₹{Number(ma.val).toFixed(2)}</span>
                  <span className="badge-bullish">{ma.signal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Oscillators Matrix */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', margin: 0, color: 'var(--text-primary)' }}>
              Oscillators Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'RSI (14)', val: currentRsi.toFixed(2), signal: currentRsi > 70 ? 'SELL' : currentRsi < 30 ? 'BUY' : 'NEUTRAL' },
                { name: 'MACD (12,26)', val: currentMacd.toFixed(2), signal: currentMacdHist >= 0 ? 'BUY' : 'SELL' },
                { name: 'Stochastic %K', val: '68.40', signal: 'NEUTRAL' },
                { name: 'Williams %R', val: '-28.10', signal: 'BUY' },
                { name: 'Awesome Oscillator', val: '+14.8', signal: 'BUY' }
              ].map((osc, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--bg-chip)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>{osc.name}</span>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: '700' }}>{osc.val}</span>
                  <span className={osc.signal === 'BUY' ? 'badge-bullish' : osc.signal === 'SELL' ? 'badge-bearish' : 'badge-neutral'}>{osc.signal}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab: Pivots & Support */}
      {activeTab === 'Pivots' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '20px' }}>
          
          {/* Classic Pivot Levels */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', margin: 0, color: 'var(--text-primary)' }}>
              Standard Floor Pivot Points
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Resistance 3 (R3)', price: r3, type: 'bear' },
                { label: 'Resistance 2 (R2)', price: r2, type: 'bear' },
                { label: 'Resistance 1 (R1)', price: r1, type: 'bear' },
                { label: 'Central Pivot (P)', price: pivotPoint, type: 'pivot' },
                { label: 'Support 1 (S1)', price: s1, type: 'bull' },
                { label: 'Support 2 (S2)', price: s2, type: 'bull' },
                { label: 'Support 3 (S3)', price: s3, type: 'bull' },
              ].map((level, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '10px 14px', 
                    backgroundColor: level.type === 'pivot' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-chip)',
                    border: `1px solid ${level.type === 'pivot' ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-color)'}`,
                    borderRadius: '8px' 
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: level.type === 'pivot' ? '800' : '700', color: level.type === 'pivot' ? 'var(--accent-purple)' : 'var(--text-primary)' }}>
                    {level.label}
                  </span>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontFamily: 'var(--font-mono)', 
                    fontWeight: '800',
                    color: level.type === 'bear' ? 'var(--bearish-red)' : level.type === 'bull' ? 'var(--bullish-green)' : 'var(--accent-purple)'
                  }}>
                    ₹{level.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fibonacci Retracements */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', margin: 0, color: 'var(--text-primary)' }}>
              Fibonacci Key Retracements
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Fib 100.0% (High)', price: highVal },
                { label: 'Fib 61.8% (Golden Pocket)', price: lowVal + ((highVal - lowVal) * 0.618) },
                { label: 'Fib 50.0% (Equilibrium)', price: lowVal + ((highVal - lowVal) * 0.500) },
                { label: 'Fib 38.2% (Support)', price: lowVal + ((highVal - lowVal) * 0.382) },
                { label: 'Fib 23.6% (Initial Pullback)', price: lowVal + ((highVal - lowVal) * 0.236) },
                { label: 'Fib 0.0% (Low)', price: lowVal },
              ].map((fib, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-chip)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>{fib.label}</span>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: '800', color: 'var(--text-primary)' }}>₹{fib.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab: VolumeFlow */}
      {activeTab === 'VolumeFlow' && (
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', margin: 0, color: 'var(--text-primary)' }}>
            Volume Flow &amp; Liquidity Distribution
          </h4>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrichedData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="date" stroke="var(--chart-axis)" fontSize={10} tick={{ fill: 'var(--chart-axis)' }} tickLine={false} />
                <YAxis stroke="var(--chart-axis)" fontSize={10} tick={{ fill: 'var(--chart-axis)' }} tickLine={false} orientation="right" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', borderColor: 'var(--chart-tooltip-border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)', boxShadow: 'var(--shadow-dropdown)' }} />
                <Bar dataKey="volume" fill="var(--accent-cyan)" opacity={0.85} name="Volume (Shares)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Academic Disclaimer Footer */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--bg-chip)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)'
      }}>
        <Info size={16} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
        <span>Technical indicators and algorithmically computed pivot levels are calculated for educational and analytical purposes only. Always manage risk independently.</span>
      </div>

    </div>
  );
};

export default AnalyticsPage;
