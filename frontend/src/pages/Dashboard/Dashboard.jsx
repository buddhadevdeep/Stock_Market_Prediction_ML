import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { stockApi } from '../../api/stockApi';
import { portfolioApi } from '../../api/portfolioApi';
import MetricCard from '../../components/common/MetricCard';
import ConfidenceGauge from '../../components/common/ConfidenceGauge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Layers, 
  ExternalLink,
  Target,
  RefreshCw,
  Compass,
  PieChart,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_GAINERS = [
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', price: 239.00, change: 6.20, pctChange: 2.66 },
  { symbol: 'ITC', name: 'ITC Limited', price: 268.00, change: 5.70, pctChange: 2.17 },
  { symbol: 'NTPC', name: 'NTPC Limited', price: 326.60, change: 2.95, pctChange: 0.91 },
  { symbol: 'TITAN', name: 'Titan Company Limited', price: 4832.50, change: 34.00, pctChange: 0.71 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Ind.', price: 1849.90, change: 12.60, pctChange: 0.69 }
];

const DEFAULT_LOSERS = [
  { symbol: 'AXISBANK', name: 'Axis Bank Limited', price: 1186.50, change: -70.50, pctChange: -5.61 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', price: 982.00, change: -58.30, pctChange: -5.60 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', price: 1795.80, change: -97.50, pctChange: -5.15 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 2900.00, change: -120.00, pctChange: -3.97 },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1014.50, change: -36.90, pctChange: -3.51 }
];

const Dashboard = () => {
  const { currentSymbol, setCurrentSymbol, setSelectedStock, marketIndicesLive, user } = useApp();
  const navigate = useNavigate();
  const [indices, setIndices] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [topGainers, setTopGainers] = useState(DEFAULT_GAINERS);
  const [dayLosers, setDayLosers] = useState(DEFAULT_LOSERS);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const results = await Promise.allSettled([
        stockApi.getMarketIndices(),
        portfolioApi.getPortfolioSummary(),
        stockApi.getStockHistory(currentSymbol, '1M'),
        stockApi.getTopMovers()
      ]);

      if (results[0].status === 'fulfilled' && Array.isArray(results[0].value) && results[0].value.length > 0) {
        setIndices(results[0].value);
      }
      if (results[1].status === 'fulfilled' && results[1].value) {
        setPortfolio(results[1].value);
      }
      if (results[2].status === 'fulfilled' && Array.isArray(results[2].value)) {
        setHistoryData(results[2].value);
      }
      if (results[3].status === 'fulfilled' && results[3].value) {
        const movers = results[3].value;
        if (Array.isArray(movers.gainers) && movers.gainers.length > 0) {
          setTopGainers(movers.gainers.slice(0, 5));
        }
        if (Array.isArray(movers.losers) && movers.losers.length > 0) {
          setDayLosers(movers.losers.slice(0, 5));
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard parameters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentSymbol, user?.email]);

  if (loading && (!indices || indices.length === 0)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="responsive-grid-4">
          <SkeletonLoader type="card" count={4} />
        </div>
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="table" />
      </div>
    );
  }

  const handleStockClick = (sym) => {
    if (setCurrentSymbol) {
      setCurrentSymbol(sym.toUpperCase().trim());
    }
    if (setSelectedStock) {
      setSelectedStock(sym.toUpperCase().trim());
    }
    navigate('/prediction');
  };

  const portTotalVal = Number(portfolio?.summary?.totalValue || 0);
  const portTotalGain = Number(portfolio?.summary?.totalGain || 0);
  const portReturnPct = Number(portfolio?.summary?.returnPct || 0);
  const portTodayGain = Number(portfolio?.summary?.todayGain || 0);
  const portTodayPct = Number(portfolio?.summary?.todayPct || 0);

  // Dynamic Portfolio Stability Score & Rank based on real user holdings
  const portHealthScore = portfolio?.summary?.stabilityScore ?? 0;
  const portHealthText = portfolio?.summary?.stabilityRank || 'EMPTY PORTFOLIO';
  const portHealthDesc = portfolio?.summary?.stabilityDesc || '0 holdings registered. Add stocks to start computing diversification & risk rating.';

  const displayIndices = indices.length > 0 ? indices : (marketIndicesLive.length > 0 ? marketIndicesLive : [
    { name: 'NIFTY 50', symbol: '^NSEI', value: 23063.10, change: -383.70, pctChange: -1.64, status: 'bearish' },
    { name: 'SENSEX', symbol: '^BSESN', value: 73580.54, change: -1247.71, pctChange: -1.67, status: 'bearish' },
    { name: 'NIFTY BANK', symbol: '^NSEBANK', value: 55438.50, change: -1110.40, pctChange: -1.96, status: 'bearish' },
    { name: 'USD / INR', symbol: 'INR=X', value: 95.94, change: 0.26, pctChange: 0.27, status: 'bullish' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Market Terminal Header Banner */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple)'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Institutional Market Terminal
              </h3>
              <span className="badge-live-pulse">LIVE FEED</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
              Real-time multi-exchange NSE / BSE radar, portfolio P&L tracking and ML signals.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/prediction')}
            className="glow-btn"
            style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Zap size={14} />
            Run ML Forecast
          </button>
          <button
            onClick={loadDashboardData}
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--bg-chip)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem'
            }}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/* 2. Major Indices Ticker Grid */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {displayIndices.map((idx, index) => (
            <MetricCard
              key={index}
              title={idx.name}
              value={`₹${Number(idx.value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              pctChange={idx.pctChange}
              change={idx.change}
              sparklineData={idx.sparkline}
              status={idx.pctChange >= 0 ? 'bullish' : 'bearish'}
            />
          ))}
        </div>
      </div>

      {/* 3. Portfolio Summaries Row & Dynamic Stability Gauge */}
      <div className="responsive-split-2-1">
        
        {/* Portfolio Value & Area Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                YOUR PORTFOLIO VALUE
              </span>
              <h3 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '4px 0', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                ₹{portTotalVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span className={portTotalGain >= 0 ? 'text-bullish' : 'text-bearish'} style={{ fontSize: '0.85rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {portTotalGain >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {portTotalGain >= 0 ? '+' : ''}₹{portTotalGain.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({portReturnPct >= 0 ? '+' : ''}{portReturnPct.toFixed(2)}% Overall)
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                TODAY'S P&amp;L
              </span>
              <h4 className={portTodayGain >= 0 ? 'text-bullish' : 'text-bearish'} style={{ fontSize: '1.25rem', fontWeight: '800', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                {portTodayGain >= 0 ? '+' : ''}₹{portTodayGain.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {portTodayPct >= 0 ? '+' : ''}{portTodayPct.toFixed(2)}% session
              </span>
            </div>
          </div>

          {/* Active Symbol Trend Chart Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Active Radar Symbol: <strong style={{ color: 'var(--accent-purple)' }}>{currentSymbol}</strong> (1-Month Trend)
            </span>
            <button
              onClick={() => navigate('/analytics')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-purple)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Open Technical Console <ExternalLink size={12} />
            </button>
          </div>

          {/* Performance line chart */}
          <div style={{ width: '100%', height: '190px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)' }}
                  labelStyle={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}
                  itemStyle={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}
                />
                <Area type="monotone" dataKey="price" stroke="var(--accent-purple)" strokeWidth={2.2} fillOpacity={1} fill="url(#dashChartGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Portfolio Stability Rank & Score */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <Award size={16} style={{ color: 'var(--accent-purple)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PORTFOLIO STABILITY RANK
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <ConfidenceGauge 
              value={portHealthScore} 
              label="Risk Rating" 
              statusText={portHealthText}
              size={155}
            />
          </div>

          <div style={{
            marginTop: '14px',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-chip)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontSize: '0.74rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4'
          }}>
            {portHealthDesc}
          </div>
        </div>
      </div>

      {/* 4. Top 5 Gainers & Top 5 Losers Grid */}
      <div className="responsive-grid-2">
        
        {/* Top 5 Gainers */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bullish-green)' }}>
                <TrendingUp size={16} />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', margin: 0 }}>Top 5 Gainers</h4>
            </div>
            <span className="badge-bullish">BULL DOMINANCE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topGainers.map((stock) => (
              <div 
                key={stock.symbol}
                onClick={() => handleStockClick(stock.symbol)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-chip)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{stock.symbol}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stock.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                    ₹{Number(stock.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <span className="text-bullish" style={{ fontSize: '0.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <ArrowUpRight size={13} />{Number(stock.pctChange) >= 0 ? '+' : ''}{Number(stock.pctChange || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Day Losers */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bearish-red)' }}>
                <TrendingUp size={16} style={{ transform: 'rotate(90deg)' }} />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', margin: 0 }}>Top 5 Day Losers</h4>
            </div>
            <span className="badge-bearish">CORRECTION</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dayLosers.map((stock) => (
              <div 
                key={stock.symbol}
                onClick={() => handleStockClick(stock.symbol)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-chip)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{stock.symbol}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stock.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                    ₹{Number(stock.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <span className="text-bearish" style={{ fontSize: '0.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <ArrowDownRight size={13} />{Number(stock.pctChange || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
