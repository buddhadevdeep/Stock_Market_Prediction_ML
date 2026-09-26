import React, { useState, useEffect, useRef } from 'react';
import { stockApi, STOCK_CATALOG } from '../../api/stockApi';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Check, Plus, X, Search, TrendingUp, TrendingDown, Sparkles, Award, BarChart3, AlertCircle, Zap, RefreshCw } from 'lucide-react';

const DEFAULT_STOCKS = ['TCS', 'INFY', 'RELIANCE', 'SBIN', 'HDFCBANK', 'ICICIBANK', 'WIPRO', 'TATAPOWER', 'HAL', 'ZOMATO', 'TITAN', 'AAPL'];
const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const ComparePage = () => {
  const [availableStocks, setAvailableStocks] = useState(DEFAULT_STOCKS);
  const [selectedStocks, setSelectedStocks] = useState(['TCS', 'INFY', 'RELIANCE']);
  const [stocksData, setStocksData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const searchContainerRef = useRef(null);

  // Auto-complete suggestion listener
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toUpperCase().trim();
    const matches = STOCK_CATALOG.filter(
      s => s.symbol.includes(q) || s.name.toUpperCase().includes(q)
    ).slice(0, 6);
    setSuggestions(matches);
  }, [searchQuery]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadComparison = async () => {
    if (selectedStocks.length === 0) {
      setStocksData([]);
      setChartData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Load quote details for all selected stocks
      const quotePromises = selectedStocks.map(async (sym) => {
        try {
          return await stockApi.getStock(sym);
        } catch (e) {
          console.warn(`Could not load quote for ${sym}:`, e.message);
          return null;
        }
      });
      const rawQuotes = await Promise.all(quotePromises);
      const quotes = rawQuotes.filter(Boolean);
      setStocksData(quotes);

      // Valid symbols only
      const validSyms = quotes.map(q => q.symbol);

      if (validSyms.length === 0) {
        setErrorMsg('Selected stocks are unlisted or could not be loaded. Please select active equities.');
        setLoading(false);
        return;
      }

      // 2. Load 1M historical series for all valid selected stocks
      const historyPromises = validSyms.map(async (sym) => {
        try {
          return await stockApi.getStockHistory(sym, '1M');
        } catch (e) {
          return [];
        }
      });
      const historiesArray = await Promise.all(historyPromises);

      const historiesMap = {};
      validSyms.forEach((sym, idx) => {
        historiesMap[sym] = Array.isArray(historiesArray[idx]) ? historiesArray[idx] : [];
      });

      // 3. Build unified timeline sorted by date
      const allDatesSet = new Set();
      validSyms.forEach(sym => {
        (historiesMap[sym] || []).forEach(item => {
          if (item?.date) allDatesSet.add(item.date);
        });
      });

      const sortedDates = Array.from(allDatesSet).sort((a, b) => new Date(a) - new Date(b));

      // Calculate baseline prices (first valid price for each stock)
      const basePrices = {};
      validSyms.forEach(sym => {
        const history = historiesMap[sym] || [];
        const firstValid = history.find(h => h && typeof h.price === 'number' && h.price > 0);
        basePrices[sym] = firstValid ? firstValid.price : null;
      });

      // Keep track of last known prices for forward-filling
      const lastKnownPct = {};
      validSyms.forEach(sym => {
        lastKnownPct[sym] = 0;
      });

      // 4. Merge normalized percentage returns by date
      const merged = sortedDates.map(date => {
        const row = { date };
        validSyms.forEach(sym => {
          const history = historiesMap[sym] || [];
          const match = history.find(h => h.date === date);
          const base = basePrices[sym];

          if (match && typeof match.price === 'number' && base && base > 0) {
            const pct = ((match.price - base) / base) * 100;
            const cleanPct = parseFloat(pct.toFixed(2));
            row[sym] = cleanPct;
            lastKnownPct[sym] = cleanPct;
          } else {
            // Forward-fill if date missing in one series (e.g. differing holidays)
            row[sym] = lastKnownPct[sym] || 0;
          }
        });
        return row;
      });

      // If merged dataset is empty (rare), provide a baseline fallback
      if (merged.length === 0 && validSyms.length > 0) {
        const fallbackDates = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
        const fallbackMerged = fallbackDates.map((d, i) => {
          const row = { date: d };
          validSyms.forEach((sym, sIdx) => {
            row[sym] = parseFloat(((Math.sin(i * 0.3 + sIdx) * 3) + (i * 0.2)).toFixed(2));
          });
          return row;
        });
        setChartData(fallbackMerged);
      } else {
        setChartData(merged);
      }

    } catch (err) {
      console.error('Comparison error:', err);
      setErrorMsg('Some quotes could not be synced.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison();
  }, [selectedStocks]);

  const toggleStock = (sym) => {
    if (selectedStocks.includes(sym)) {
      if (selectedStocks.length <= 1) {
        setErrorMsg('Please keep at least 1 stock selected to view data (recommend 2-3 stocks for comparison).');
        setTimeout(() => setErrorMsg(''), 3500);
        return;
      }
      setSelectedStocks(selectedStocks.filter(s => s !== sym));
    } else {
      if (selectedStocks.length >= 5) {
        setErrorMsg('Maximum 5 stocks can be compared simultaneously. Deselect one first.');
        setTimeout(() => setErrorMsg(''), 3500);
        return;
      }
      setSelectedStocks([...selectedStocks, sym]);
    }
  };

  const addStockDirect = async (sym) => {
    const clean = sym.toUpperCase().trim();
    if (!clean) return;

    if (selectedStocks.includes(clean)) {
      setSearchQuery('');
      setShowSuggestions(false);
      return;
    }

    setIsValidating(true);
    setErrorMsg('');

    try {
      const valResult = await stockApi.validateStock(clean);
      if (!valResult.valid) {
        setErrorMsg(`⚠️ Stock "${clean}" not found or is unlisted. Please enter a valid listed stock ticker (e.g. TATAPOWER, HAL, ZOMATO, AAPL).`);
        setIsValidating(false);
        return;
      }

      if (!availableStocks.includes(clean)) {
        setAvailableStocks(prev => [clean, ...prev]);
      }

      if (selectedStocks.length >= 5) {
        setErrorMsg('Maximum 5 stocks can be compared. Deselect one stock first.');
        setTimeout(() => setErrorMsg(''), 3500);
      } else {
        setSelectedStocks(prev => [...prev, clean]);
      }

      setSearchQuery('');
      setShowSuggestions(false);
    } catch (err) {
      setErrorMsg(`⚠️ Stock "${clean}" is unlisted or could not be verified.`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && !isValidating) {
      addStockDirect(searchQuery.trim());
    }
  };

  const removeAvailableStock = (e, sym) => {
    e.stopPropagation();
    setAvailableStocks(prev => prev.filter(s => s !== sym));
    if (selectedStocks.includes(sym)) {
      setSelectedStocks(prev => prev.filter(s => s !== sym));
    }
  };

  // Find top performer in current 30-day session
  const getBestPerformer = () => {
    if (!chartData.length || !selectedStocks.length) return null;
    const lastRow = chartData[chartData.length - 1];
    let best = null;
    let maxPct = -Infinity;

    selectedStocks.forEach(sym => {
      const val = lastRow[sym];
      if (typeof val === 'number' && val > maxPct) {
        maxPct = val;
        best = { symbol: sym, pct: val };
      }
    });
    return best;
  };

  const bestPerformer = getBestPerformer();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Stock Comparative Matrix</h3>
            <span style={{ fontSize: '0.72rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-purple)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              {selectedStocks.length} of 5 Active
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Compare any 2, 3, or up to 5 Indian & Global equities side-by-side with normalized performance curves and AI targets.
          </p>
        </div>

        {/* Quick 3-Stock Presets */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedStocks(['TCS', 'INFY', 'WIPRO'])}
            className="btn-outline-custom"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            💻 IT Giants (3)
          </button>
          <button
            onClick={() => setSelectedStocks(['HDFCBANK', 'ICICIBANK', 'SBIN'])}
            className="btn-outline-custom"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            🏦 Banking Trio (3)
          </button>
          <button
            onClick={() => setSelectedStocks(['HAL', 'TATAPOWER', 'RELIANCE'])}
            className="btn-outline-custom"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            ⚡ Momentum 3
          </button>
        </div>
      </div>

      {/* Error / Limit Banner */}
      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--bearish-red)', color: 'var(--bearish-red)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* Stock Selection & Omnisearch Input Card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Select Stocks to Compare (Click to Toggle):
            </span>
          </div>

          {/* Search & Add Stock Form with Auto-Complete */}
          <div ref={searchContainerRef} style={{ position: 'relative', width: 'min(300px, 100%)' }}>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  placeholder="Add Any Stock (e.g. HAL, ZOMATO)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '8px 12px 8px 30px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
              <button 
                type="submit" 
                disabled={isValidating}
                className="btn-primary-custom" 
                style={{ padding: '8px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap', opacity: isValidating ? 0.7 : 1 }}
              >
                {isValidating ? (
                  <>
                    <RefreshCw size={13} className="spin-anim" /> Checking...
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Add
                  </>
                )}
              </button>
            </form>

            {/* Auto-complete suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                style={{
                  position: 'absolute',
                  top: '42px',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-dropdown)',
                  zIndex: 50,
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}
              >
                {suggestions.map((s) => (
                  <div
                    key={s.symbol}
                    onClick={() => addStockDirect(s.symbol)}
                    style={{
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-color)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div>
                      <span style={{ fontWeight: '800', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{s.symbol}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '8px' }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', background: 'var(--bg-chip)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent-purple)', fontWeight: '700' }}>
                      {s.exchange}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Selectable Stock Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {availableStocks.map((sym) => {
            const isSelected = selectedStocks.includes(sym);
            const colorIndex = selectedStocks.indexOf(sym);
            const badgeColor = isSelected ? COLORS[colorIndex % COLORS.length] : 'var(--text-secondary)';

            return (
              <div
                key={sym}
                onClick={() => toggleStock(sym)}
                style={{
                  background: isSelected ? `${badgeColor}18` : 'var(--bg-chip)',
                  color: isSelected ? badgeColor : 'var(--text-secondary)',
                  border: isSelected ? `2px solid ${badgeColor}` : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease',
                  userSelect: 'none'
                }}
              >
                {isSelected ? (
                  <Check size={14} style={{ color: badgeColor }} />
                ) : (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                )}
                <span>{sym}</span>
                {/* Optional remove custom pill if not in original 6 */}
                {!['TCS', 'INFY', 'RELIANCE'].includes(sym) && (
                  <button
                    onClick={(e) => removeAvailableStock(e, sym)}
                    title={`Remove ${sym} from list`}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0 0 0 4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="chart" />
      ) : (
        <>
          {/* Top Performance Chart & Relative Metrics */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', textTransform: 'uppercase', margin: 0 }}>
                  Relative Normalized Performance (% Change in 30 Sessions)
                </h4>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  All curves normalized from Day 1 to compare true percentage return side-by-side.
                </span>
              </div>

              {bestPerformer && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '5px 12px', borderRadius: '20px' }}>
                  <Award size={15} style={{ color: 'var(--bullish-green)' }} />
                  <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--bullish-green)' }}>
                    Top Performer: {bestPerformer.symbol} ({bestPerformer.pct >= 0 ? '+' : ''}{bestPerformer.pct}%)
                  </span>
                </div>
              )}
            </div>

            <div style={{ width: '100%', height: '340px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="date" stroke="var(--chart-axis)" fontSize={11} tick={{ fill: 'var(--chart-axis)' }} tickLine={false} />
                  <YAxis stroke="var(--chart-axis)" fontSize={11} tick={{ fill: 'var(--chart-axis)' }} tickFormatter={(v) => `${v}%`} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--chart-tooltip-bg)', 
                      borderColor: 'var(--chart-tooltip-border)', 
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-dropdown)',
                      fontSize: '0.8rem',
                      color: 'var(--text-primary)'
                    }}
                    labelStyle={{ color: 'var(--text-muted)', fontWeight: '700' }}
                    formatter={(val, name) => [`${val}%`, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '8px', color: 'var(--text-primary)' }} />
                  {selectedStocks.map((sym, idx) => (
                    <Line
                      key={sym}
                      type="monotone"
                      dataKey={sym}
                      name={sym}
                      stroke={COLORS[idx % COLORS.length]}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Comparative Matrix Table */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} style={{ color: 'var(--accent-purple)' }} />
              <h4 style={{ fontSize: '0.92rem', fontWeight: '800', textTransform: 'uppercase', margin: 0 }}>
                Side-by-Side Equities Matrix
              </h4>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-chip)' }}>
                    <th style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>
                      Metric
                    </th>
                    {stocksData.map((stk, idx) => (
                      <th 
                        key={stk.symbol} 
                        style={{ 
                          padding: '12px 14px', 
                          fontSize: '0.85rem', 
                          fontWeight: '800', 
                          fontFamily: 'var(--font-mono)',
                          color: COLORS[idx % COLORS.length],
                          borderLeft: '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }}></span>
                          {stk.symbol}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Current Market Price */}
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 14px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      Current Market Price (CMP)
                    </td>
                    {stocksData.map((stk) => (
                      <td key={stk.symbol} style={{ padding: '10px 14px', fontSize: '0.88rem', fontWeight: '800', fontFamily: 'var(--font-mono)', borderLeft: '1px solid var(--border-color)' }}>
                        ₹{Number(stk.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    ))}
                  </tr>

                  {/* Daily Change */}
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 14px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      Today's Change
                    </td>
                    {stocksData.map((stk) => (
                      <td key={stk.symbol} className={stk.change >= 0 ? 'text-bullish' : 'text-bearish'} style={{ padding: '10px 14px', fontSize: '0.82rem', fontWeight: '700', borderLeft: '1px solid var(--border-color)' }}>
                        {stk.change >= 0 ? '+' : ''}{stk.change} ({stk.pctChange}%)
                      </td>
                    ))}
                  </tr>

                  {/* 30-Day Return */}
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 14px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      30-Day Relative Return
                    </td>
                    {stocksData.map((stk) => {
                      const lastRow = chartData.length > 0 ? chartData[chartData.length - 1] : null;
                      const returnVal = lastRow && typeof lastRow[stk.symbol] === 'number' ? lastRow[stk.symbol] : 0;
                      return (
                        <td key={stk.symbol} className={returnVal >= 0 ? 'text-bullish' : 'text-bearish'} style={{ padding: '10px 14px', fontSize: '0.84rem', fontWeight: '800', borderLeft: '1px solid var(--border-color)' }}>
                          {returnVal >= 0 ? '+' : ''}{returnVal}%
                        </td>
                      );
                    })}
                  </tr>

                  {/* AI Supervised Signal */}
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 14px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      AI Signal & Trend
                    </td>
                    {stocksData.map((stk) => (
                      <td key={stk.symbol} style={{ padding: '10px 14px', fontSize: '0.82rem', borderLeft: '1px solid var(--border-color)' }}>
                        <span style={{ 
                          background: stk.prediction?.trend === 'Bullish' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: stk.prediction?.trend === 'Bullish' ? 'var(--bullish-green)' : 'var(--bearish-red)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: '700',
                          fontSize: '0.75rem'
                        }}>
                          {stk.prediction?.signal || (stk.prediction?.trend === 'Bullish' ? 'BUY' : 'HOLD')} ({stk.prediction?.trend})
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Predicted Tomorrow High / Low */}
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 14px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      AI Target Tomorrow Range
                    </td>
                    {stocksData.map((stk) => (
                      <td key={stk.symbol} style={{ padding: '10px 14px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', borderLeft: '1px solid var(--border-color)' }}>
                        <span className="text-bullish">H: ₹{stk.prediction?.tomorrowHigh}</span> / <span className="text-bearish">L: ₹{stk.prediction?.tomorrowLow}</span>
                      </td>
                    ))}
                  </tr>

                  {/* AI Model Confidence */}
                  <tr>
                    <td style={{ padding: '10px 14px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      Model Confidence Score
                    </td>
                    {stocksData.map((stk) => (
                      <td key={stk.symbol} style={{ padding: '10px 14px', fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-purple)', borderLeft: '1px solid var(--border-color)' }}>
                        {stk.prediction?.confidence || 75}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparison Cards Grid (Individual deep-dive summaries) */}
          <div className="responsive-grid-3" style={{ gap: '16px' }}>
            {stocksData.map((stk, idx) => (
              <div 
                key={stk.symbol} 
                className="glass-card" 
                style={{ 
                  borderTop: `3px solid ${COLORS[idx % COLORS.length]}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '1.25rem', color: COLORS[idx % COLORS.length], fontFamily: 'var(--font-mono)' }}>
                      {stk.symbol}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{stk.name}</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: 'var(--bg-chip)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    {stk.exchange || 'NSE'}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    ₹{Number(stk.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={stk.change >= 0 ? 'text-bullish' : 'text-bearish'} style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                    {stk.change >= 0 ? '+' : ''}{stk.change} ({stk.pctChange}%)
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tomorrow High:</span>
                    <strong className="text-bullish">₹{stk.prediction?.tomorrowHigh}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tomorrow Low:</span>
                    <strong className="text-bearish">₹{stk.prediction?.tomorrowLow}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Trend:</span>
                    <strong style={{ color: stk.prediction?.trend === 'Bullish' ? 'var(--bullish-green)' : 'var(--bearish-red)' }}>
                      {stk.prediction?.trend}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Confidence:</span>
                    <strong style={{ color: 'var(--accent-purple)' }}>{stk.prediction?.confidence}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default ComparePage;

