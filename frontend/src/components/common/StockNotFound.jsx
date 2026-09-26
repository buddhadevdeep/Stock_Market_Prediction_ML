import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchX, ArrowRight, RefreshCw, Sparkles, TrendingUp, Search, AlertCircle, Compass } from 'lucide-react';
import { STOCK_CATALOG } from '../../api/stockApi';

const BENCHMARKS = [
  { sym: 'NIFTY 50', name: 'NIFTY Benchmark' },
  { sym: 'SENSEX', name: 'BSE SENSEX' },
  { sym: 'NIFTY BANK', name: 'Banking Sector' }
];

const TOP_INDIAN = [
  { sym: 'TATAPOWER', name: 'Tata Power' },
  { sym: 'HAL', name: 'Hindustan Aero' },
  { sym: 'CUPID', name: 'Cupid Ltd' },
  { sym: 'TCS', name: 'Tata Consultancy' },
  { sym: 'RELIANCE', name: 'Reliance Ind.' },
  { sym: 'INFY', name: 'Infosys' },
  { sym: 'SBIN', name: 'State Bank of India' },
  { sym: 'TITAN', name: 'Titan Company' }
];

const GLOBAL_TECH = [
  { sym: 'AAPL', name: 'Apple Inc.' },
  { sym: 'NVDA', name: 'NVIDIA AI' },
  { sym: 'MSFT', name: 'Microsoft' },
  { sym: 'TSLA', name: 'Tesla Clean EV' }
];

export const StockNotFound = ({ symbol, onReset, customMessage }) => {
  const { setCurrentSymbol } = useApp();
  const [localSearch, setLocalSearch] = useState('');

  const handleSelect = (sym) => {
    if (!sym) return;
    setCurrentSymbol(sym.toUpperCase().trim());
    if (onReset) onReset();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      handleSelect(localSearch.trim());
    }
  };

  return (
    <div 
      className="glass-card" 
      style={{ 
        textAlign: 'center', 
        padding: '44px 28px', 
        maxWidth: '780px', 
        margin: '24px auto',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        background: 'var(--card-bg)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
        borderRadius: '16px'
      }}
    >
      {/* Icon Badge */}
      <div 
        style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1.5px solid rgba(239, 68, 68, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px auto',
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.25)'
        }}
      >
        <SearchX size={38} style={{ color: 'var(--bearish-red)' }} />
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
        <span 
          style={{ 
            fontSize: '0.74rem', 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            color: 'var(--bearish-red)',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            padding: '4px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          STOCK NOT AVAILABLE / UNLISTED
        </span>
      </div>

      <h3 style={{ fontSize: '1.65rem', fontWeight: '800', margin: '6px 0 10px 0', color: 'var(--text-primary)' }}>
        No Market Feed Available for <span className="mono-font" style={{ color: 'var(--accent-purple)' }}>"{symbol || 'UNKNOWN'}"</span>
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
        {customMessage || `Stock ticker "${symbol || 'UNKNOWN'}" was not found on NSE, BSE, or Global exchange feeds. It may be unlisted, delisted, or mistyped.`}
      </p>

      {/* Direct Search Bar inside Not Found Card */}
      <form onSubmit={handleSearchSubmit} style={{ maxWidth: '440px', margin: '0 auto 28px auto', position: 'relative' }}>
        <input 
          type="text"
          placeholder="Search another stock (e.g. TATAPOWER, HAL, SBIN)..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="custom-input"
          style={{
            width: '100%',
            padding: '10px 42px 10px 38px',
            borderRadius: '10px',
            border: '1px solid var(--accent-purple)',
            fontSize: '0.88rem',
            background: 'var(--bg-input)'
          }}
        />
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-purple)' }} />
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--accent-purple)',
            border: 'none',
            color: '#fff',
            borderRadius: '6px',
            padding: '5px 10px',
            fontSize: '0.75rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </form>

      {/* Active Verified Tick suggestions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px', textAlign: 'left', background: 'var(--bg-secondary)', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        
        {/* Benchmarks */}
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Major Benchmarks & Indices:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {BENCHMARKS.map((t) => (
              <button
                key={t.sym}
                onClick={() => handleSelect(t.sym)}
                className="chip-btn"
                style={{
                  background: 'var(--bg-chip)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-primary)'
                }}
              >
                <span className="mono-font" style={{ fontWeight: '800', color: 'var(--accent-purple)' }}>{t.sym}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({t.name})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top NSE Equities */}
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active NSE Equities:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {TOP_INDIAN.map((t) => (
              <button
                key={t.sym}
                onClick={() => handleSelect(t.sym)}
                className="chip-btn"
                style={{
                  background: 'var(--bg-chip)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-primary)'
                }}
              >
                <span className="mono-font" style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>{t.sym}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({t.name})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Global Tech */}
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Global Equities:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {GLOBAL_TECH.map((t) => (
              <button
                key={t.sym}
                onClick={() => handleSelect(t.sym)}
                className="chip-btn"
                style={{
                  background: 'var(--bg-chip)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-primary)'
                }}
              >
                <span className="mono-font" style={{ fontWeight: '800', color: 'var(--bullish-green)' }}>{t.sym}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({t.name})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => handleSelect('NIFTY 50')}
          className="btn-primary-custom"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={15} /> Reset to NIFTY 50 Benchmark
        </button>
      </div>
    </div>
  );
};

export default StockNotFound;
