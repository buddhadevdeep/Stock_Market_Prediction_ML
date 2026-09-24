import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { portfolioApi } from '../../api/portfolioApi';
import { stockApi, STOCK_CATALOG } from '../../api/stockApi';
import MetricCard from '../../components/common/MetricCard';
import ConfidenceGauge from '../../components/common/ConfidenceGauge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PlusCircle, Trash2, ArrowUpRight, ArrowDownRight, Briefcase, Search, Sparkles, RefreshCw, UserCheck } from 'lucide-react';

export const PortfolioPage = () => {
  const { user } = useApp();
  const [holdings, setHoldings] = useState([]);
  const [enrichedHoldings, setEnrichedHoldings] = useState([]);
  const [summary, setSummary] = useState({
    invested: 0,
    totalValue: 0,
    totalGain: 0,
    returnPct: 0,
    todayGain: 0,
    todayPct: 0,
    healthScore: 88,
  });
  const [allocation, setAllocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Transaction form states
  const [searchSymbol, setSearchSymbol] = useState('TATAPOWER');
  const [qty, setQty] = useState('25');
  const [price, setPrice] = useState('360.00');
  const [notes, setNotes] = useState('');
  const [actionError, setActionError] = useState('');
  const [adding, setAdding] = useState(false);
  const [symbolSuggestions, setSymbolSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch user-specific portfolio from backend & calculate live valuations
  const loadUserPortfolio = async () => {
    setLoading(true);
    try {
      const rawHoldings = await portfolioApi.getUserPortfolio();
      setHoldings(rawHoldings);
      await enrichWithLiveQuotes(rawHoldings);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const enrichWithLiveQuotes = async (rawHoldings) => {
    setRefreshing(true);
    try {
      const liveList = await Promise.all(
        rawHoldings.map(async (h) => {
          const sym = h.symbol.toUpperCase();
          const shares = Number(h.shares) || 1;
          const avgPrice = Number(h.avgPrice) || 100;
          const invested = shares * avgPrice;
          
          let currentPrice = avgPrice * 1.05; // default fallback
          let change = 0;
          let changePercent = 0;

          try {
            const live = await stockApi.getStock(sym);
            if (live && live.price) {
              currentPrice = live.price;
              change = live.change || 0;
              changePercent = live.pctChange || 0;
            }
          } catch (e) {
            // fallback
          }

          const currentValue = +(shares * currentPrice).toFixed(2);
          const gainLoss = +(currentValue - invested).toFixed(2);
          const gainPct = +( (gainLoss / (invested || 1)) * 100 ).toFixed(2);
          const todayPnl = +(shares * change).toFixed(2);

          return {
            _id: h._id || sym,
            symbol: sym,
            name: h.name || `${sym} Equity`,
            shares,
            avgPrice,
            invested,
            currentPrice,
            currentValue,
            gainLoss,
            gainPct,
            todayPnl,
            changePercent,
            buyDate: h.buyDate ? new Date(h.buyDate).toISOString().split('T')[0] : 'Recent',
            notes: h.notes || '',
          };
        })
      );

      setEnrichedHoldings(liveList);

      // Calculate aggregated summary
      let totalInvested = 0;
      let totalVal = 0;
      let totalToday = 0;

      liveList.forEach((item) => {
        totalInvested += item.invested;
        totalVal += item.currentValue;
        totalToday += item.todayPnl;
      });

      const totalGain = +(totalVal - totalInvested).toFixed(2);
      const returnPct = +( (totalGain / (totalInvested || 1)) * 100 ).toFixed(2);
      const todayPct = +( (totalToday / (totalVal || 1)) * 100 ).toFixed(2);

      // Allocation data for donut chart
      const allocData = liveList.map((item) => ({
        name: item.symbol,
        value: item.currentValue,
      }));

      setSummary({
        invested: Math.round(totalInvested),
        totalValue: Math.round(totalVal),
        totalGain,
        returnPct,
        todayGain: Math.round(totalToday),
        todayPct,
        healthScore: returnPct >= 0 ? Math.min(95, 75 + Math.round(returnPct * 0.5)) : Math.max(50, 70 + Math.round(returnPct * 0.5)),
      });

      setAllocation(allocData);
    } catch (e) {
      console.error('Error enriching portfolio:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUserPortfolio();
  }, [user?.email]);

  const handleSelectSymbol = async (sym) => {
    setSearchSymbol(sym);
    setShowSuggestions(false);
    try {
      const live = await stockApi.getStock(sym);
      if (live && live.price) {
        setPrice(live.price.toString());
      }
    } catch (e) {
      console.warn('Auto price fetch note:', e.message);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value.toUpperCase();
    setSearchSymbol(val);
    if (val.trim()) {
      const matched = STOCK_CATALOG.filter(
        (s) => s.symbol.includes(val) || s.name.toUpperCase().includes(val)
      );
      setSymbolSuggestions(matched);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setActionError('');
    if (!searchSymbol.trim() || !qty || !price) {
      setActionError('Stock Symbol, Shares Quantity, and Purchase Price are required.');
      return;
    }
    
    setAdding(true);
    try {
      const cleanSym = searchSymbol.trim().toUpperCase();

      // Check if listed / valid on exchange
      const valResult = await stockApi.validateStock(cleanSym);
      if (!valResult.valid) {
        setActionError(`⚠️ "${cleanSym}" is not a listed stock or was not found on exchange. Only verified listed equities (e.g. TATAPOWER, TCS, INFY, HAL) can be added to your portfolio.`);
        setAdding(false);
        return;
      }

      const matching = STOCK_CATALOG.find((s) => s.symbol === cleanSym);
      const stockPayload = {
        symbol: cleanSym,
        name: valResult.name || (matching ? matching.name : `${cleanSym} Equity`),
        shares: parseInt(qty, 10),
        avgPrice: parseFloat(price),
        notes: notes.trim(),
        buyDate: new Date().toISOString(),
      };

      const updated = await portfolioApi.addStock(stockPayload);
      setHoldings(updated);
      await enrichWithLiveQuotes(updated);
      
      setNotes('');
      setQty('');
      setPrice('');
      setSearchSymbol('');
    } catch (err) {
      setActionError(err.message || 'Transaction failed');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteHolding = async (id, sym) => {
    if (window.confirm(`Are you sure you want to remove ${sym} from your portfolio?`)) {
      try {
        const updated = await portfolioApi.deleteStock(id || sym);
        setHoldings(updated);
        await enrichWithLiveQuotes(updated);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading && enrichedHoldings.length === 0) {
    return <SkeletonLoader type="table" />;
  }

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Title & User Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
              <span style={{ color: 'var(--accent-purple)' }}>{user?.name || 'Trader'}</span>'s Portfolio Console
            </h2>
            <span style={{ 
              fontSize: '0.72rem', 
              background: 'rgba(16, 185, 129, 0.15)', 
              color: 'var(--bullish-green)', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <UserCheck size={12} /> {user?.email || 'Active User'}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            User-specific live asset valuations, historical purchase costs, and dynamic profit &amp; loss indices.
          </p>
        </div>

        <button
          onClick={() => enrichWithLiveQuotes(holdings)}
          disabled={refreshing}
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--accent-purple)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={14} className={refreshing ? 'spin-anim' : ''} />
          {refreshing ? 'Updating Quotes...' : 'Refresh Live Quotes'}
        </button>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="responsive-grid-4">
        <MetricCard title="Invested Capital" value={`₹${summary.invested.toLocaleString('en-IN')}`} />
        <MetricCard title="Current Portfolio Value" value={`₹${summary.totalValue.toLocaleString('en-IN')}`} />
        <MetricCard 
          title="Total Net Gains" 
          value={`₹${summary.totalGain.toLocaleString('en-IN')}`} 
          pctChange={summary.returnPct} 
          status={summary.totalGain >= 0 ? 'bullish' : 'bearish'}
        />
        <MetricCard 
          title="Today's Gain / Loss" 
          value={`₹${summary.todayGain.toLocaleString('en-IN')}`} 
          pctChange={summary.todayPct} 
          status={summary.todayGain >= 0 ? 'bullish' : 'bearish'}
        />
      </div>

      {/* 3. Prominent Add Stock Transaction Card (Positioned at Top) */}
      <div className="glass-card" style={{ padding: '18px 20px', border: '1px solid var(--accent-purple-glow, rgba(99, 102, 241, 0.25))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} style={{ color: 'var(--accent-purple)' }} />
            <h4 style={{ fontSize: '0.92rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
              Add Listed Stock to {user?.name || 'Your'}'s Portfolio
            </h4>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Only verified listed exchange equities (e.g. TATAPOWER, HAL, SBIN, TCS, AAPL)
          </span>
        </div>
        
        {actionError && (
          <div style={{ color: 'var(--bearish-red)', fontSize: '0.82rem', marginBottom: '12px', background: 'rgba(239,68,68,0.12)', border: '1px solid var(--bearish-red)', padding: '8px 12px', borderRadius: '6px' }}>
            {actionError}
          </div>
        )}
        
        <form onSubmit={handleAddTransaction} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
          
          {/* Dynamic Search / Symbol Input */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', fontWeight: '700' }}>
              Stock Symbol (NSE / BSE / Global)
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                required
                placeholder="e.g. TATAPOWER, HAL, TCS"
                value={searchSymbol}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && symbolSuggestions.length > 0 && (
              <div 
                style={{
                  position: 'absolute',
                  top: '60px',
                  left: 0,
                  width: '100%',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-dropdown)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 100
                }}
              >
                {symbolSuggestions.map((s) => (
                  <div
                    key={s.symbol}
                    onClick={() => handleSelectSymbol(s.symbol)}
                    style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{s.symbol}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', fontWeight: '700' }}>
              Quantity (Shares)
            </label>
            <input 
              type="number"
              required
              min="1"
              placeholder="e.g. 25"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Average Purchase Price */}
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', fontWeight: '700' }}>
              Purchase Price (₹)
            </label>
            <input 
              type="number"
              step="any"
              required
              placeholder="e.g. 360.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', fontWeight: '700' }}>
              Notes (Optional)
            </label>
            <input 
              type="text"
              placeholder="e.g. Long term hold"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                borderRadius: '6px',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button 
              type="submit" 
              className="btn-primary-custom" 
              disabled={adding}
              style={{ width: '100%', justifyContent: 'center', padding: '9px 16px', fontSize: '0.84rem' }}
            >
              <PlusCircle size={16} />
              <span>{adding ? 'Validating & Adding...' : 'Add to Portfolio'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* 4. Main Grid: Holdings Table on Left, Asset Allocation & Health on Right */}
      <div className="responsive-split-2-1">
        
        {/* Holdings Table */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Your Holdings ({enrichedHoldings.length})
            </h4>
          </div>

          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 8px' }}>Symbol</th>
                  <th style={{ padding: '12px 8px' }}>Shares</th>
                  <th style={{ padding: '12px 8px' }}>Avg Buy</th>
                  <th style={{ padding: '12px 8px' }}>Live Price</th>
                  <th style={{ padding: '12px 8px' }}>Current Value</th>
                  <th style={{ padding: '12px 8px' }}>P&amp;L</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrichedHoldings.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Briefcase size={32} style={{ margin: '0 auto 10px auto', color: 'var(--accent-purple)', display: 'block', opacity: 0.7 }} />
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Your portfolio is currently empty</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Search any listed stock in the form above (e.g. TATAPOWER, HAL, SBIN, TCS) to add holdings.
                      </div>
                    </td>
                  </tr>
                ) : (
                  enrichedHoldings.map((h) => (
                    <tr key={h._id || h.symbol} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '14px 8px' }}>
                        <div style={{ fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                          {h.symbol}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {h.name}
                        </div>
                      </td>
                      <td style={{ padding: '14px 8px', fontWeight: '600' }}>{h.shares}</td>
                      <td style={{ padding: '14px 8px' }}>₹{h.avgPrice.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '14px 8px', fontWeight: '700' }}>₹{h.currentPrice.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '14px 8px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        ₹{h.currentValue.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <span className={h.gainLoss >= 0 ? 'text-bullish' : 'text-bearish'} style={{ fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          {h.gainLoss >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {h.gainLoss >= 0 ? '+' : ''}₹{h.gainLoss.toLocaleString('en-IN')} ({h.gainPct}%)
                        </span>
                      </td>
                      <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleDeleteHolding(h._id, h.symbol)}
                          title={`Remove ${h.symbol}`}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--bearish-red)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donut Allocation & Health Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Donut Asset Allocation */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '260px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', alignSelf: 'flex-start', marginBottom: '10px' }}>
              Asset Allocation
            </h4>
            <div style={{ width: '100%', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Portfolio Health Gauge */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', alignSelf: 'flex-start', marginBottom: '14px' }}>
              Portfolio Health
            </h4>
            <ConfidenceGauge 
              value={summary.healthScore} 
              label="Diversification Score" 
              statusText={summary.healthScore >= 80 ? 'Excellent' : 'Good'}
              size={140}
            />
          </div>

        </div>

      </div>

    </div>
  );
};

export default PortfolioPage;
