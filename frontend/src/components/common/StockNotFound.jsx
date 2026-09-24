import React from 'react';
import { useApp } from '../../context/AppContext';
import { SearchX, ArrowRight, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';

const SUGGESTED_TICKERS = [
  { sym: 'TCS', name: 'Tata Consultancy' },
  { sym: 'INFY', name: 'Infosys' },
  { sym: 'RELIANCE', name: 'Reliance Ind.' },
  { sym: 'CUPID', name: 'Cupid Ltd' },
  { sym: 'TATAPOWER', name: 'Tata Power' },
  { sym: 'HAL', name: 'Hindustan Aero' },
  { sym: 'SBIN', name: 'State Bank of India' },
  { sym: 'TITAN', name: 'Titan Company' }
];

export const StockNotFound = ({ symbol, onReset, customMessage }) => {
  const { setCurrentSymbol } = useApp();

  const handleSelect = (sym) => {
    setCurrentSymbol(sym);
    if (onReset) onReset();
  };

  return (
    <div 
      className="glass-card" 
      style={{ 
        textAlign: 'center', 
        padding: '50px 30px', 
        maxWidth: '720px', 
        margin: '20px auto',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        background: 'radial-gradient(ellipse at top, rgba(239, 68, 68, 0.08) 0%, rgba(13, 20, 36, 0.95) 70%)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}
    >
      <div 
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 0 25px rgba(239, 68, 68, 0.2)'
        }}
      >
        <SearchX size={36} style={{ color: 'var(--bearish-red)' }} />
      </div>

      <span 
        style={{ 
          fontSize: '0.75rem', 
          fontWeight: '800', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          color: 'var(--bearish-red)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          padding: '4px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(239, 68, 68, 0.25)'
        }}
      >
        Ticker Not Found
      </span>

      <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '14px', marginBottom: '8px' }}>
        No Market Data Found for <span className="mono-font" style={{ color: 'var(--accent-purple)' }}>"{symbol || 'UNKNOWN'}"</span>
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
        {customMessage || "We could not locate this symbol on the NSE, BSE, or Global feeds. Please check the spelling or select an active ticker from the verified list below."}
      </p>

      {/* Suggested Quick Tickers */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>
          Suggested Active NSE Tickers:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {SUGGESTED_TICKERS.map((t) => (
            <button
              key={t.sym}
              onClick={() => handleSelect(t.sym)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-purple)';
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
            >
              <span className="mono-font" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{t.sym}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({t.name})</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => handleSelect('TCS')}
          className="btn-primary-custom"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={15} /> Reset to TCS Benchmark
        </button>
      </div>
    </div>
  );
};

export default StockNotFound;
