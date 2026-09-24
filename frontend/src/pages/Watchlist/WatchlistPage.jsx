import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stockApi } from '../../api/stockApi';
import { useApp } from '../../context/AppContext';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Trash2, PlusCircle, Search, EyeOff, Eye } from 'lucide-react';

const WatchlistPage = () => {
  const navigate = useNavigate();
  const { watchlist, addToWatchlist, removeFromWatchlist, setCurrentSymbol } = useApp();
  const [watchlistDetails, setWatchlistDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const loadWatchlistData = async () => {
    try {
      const data = await stockApi.getWatchlist();
      setWatchlistDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlistData();
  }, [watchlist]);

  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const results = await stockApi.searchStocks(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      }
    };
    const delay = setTimeout(search, 150);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleRemove = async (e, sym) => {
    e.stopPropagation();
    setLoading(true);
    await removeFromWatchlist(sym);
  };

  const handleAdd = async (sym) => {
    await addToWatchlist(sym);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleStockClick = (sym) => {
    setCurrentSymbol(sym);
    navigate('/prediction');
  };

  if (loading) {
    return <SkeletonLoader type="table" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Watchlist Console</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Monitor prices, trends and AI predictions for selected stocks.</p>
        </div>

        {/* Watchlist search bar */}
        <div style={{ position: 'relative', width: 'min(320px, 100%)' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text"
              placeholder="Search & Add stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="custom-input"
              style={{ paddingLeft: '36px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          {searchResults.length > 0 && (
            <div 
              style={{
                position: 'absolute',
                top: '44px',
                right: 0,
                width: '100%',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-dropdown)',
                zIndex: 100
              }}
            >
              {searchResults.map((s) => {
                const isAdded = watchlist.includes(s.symbol);
                return (
                  <div 
                    key={s.symbol}
                    style={{
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--border-color)'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{s.symbol}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>{s.name}</span>
                    </div>
                    <button
                      onClick={() => isAdded ? removeFromWatchlist(s.symbol) : handleAdd(s.symbol)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: isAdded ? 'var(--bearish-red)' : 'var(--accent-purple)', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      {isAdded ? <EyeOff size={14} /> : <PlusCircle size={14} />}
                      {isAdded ? 'Remove' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Watchlist Data Table */}
      <div className="glass-card">
        {watchlistDetails.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Eye size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
            <h3>No stocks in your watchlist</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Use the search box above to add your first stock.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 10px' }}>Stock</th>
                  <th style={{ padding: '12px 10px' }}>Price</th>
                  <th style={{ padding: '12px 10px' }}>Change</th>
                  <th style={{ padding: '12px 10px' }}>Change %</th>
                  <th style={{ padding: '12px 10px' }}>AI Target</th>
                  <th style={{ padding: '12px 10px' }}>Expected Trend</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {watchlistDetails.map((w) => {
                  const isPositive = w.change >= 0;
                  return (
                    <tr 
                      key={w.symbol}
                      onClick={() => handleStockClick(w.symbol)}
                      style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}
                    >
                      <td style={{ fontWeight: '700' }}>
                        <div>{w.symbol}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{w.name}</div>
                      </td>
                      <td className="mono-font">₹{w.price.toLocaleString()}</td>
                      <td className={`mono-font ${isPositive ? 'text-bullish' : 'text-bearish'}`}>
                        {isPositive ? '+' : ''}{w.change.toFixed(2)}
                      </td>
                      <td className={`mono-font ${isPositive ? 'text-bullish' : 'text-bearish'}`}>
                        {isPositive ? '+' : ''}{w.pctChange}%
                      </td>
                      <td className="mono-font" style={{ fontWeight: '700' }}>₹{w.prediction.toLocaleString()}</td>
                      <td>
                        <span className={w.trend === 'Bullish' ? 'badge-bullish' : w.trend === 'Bearish' ? 'badge-bearish' : 'badge-neutral'}>
                          {w.trend}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={(e) => handleRemove(e, w.symbol)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--bearish-red)',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default WatchlistPage;
