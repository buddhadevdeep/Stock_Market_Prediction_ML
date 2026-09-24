import React, { useState } from 'react';
import { Search, ArrowRight, Globe } from 'lucide-react';

const SUGGESTED_TICKERS = [
  'TCS', 'INFY', 'RELIANCE', 'HDFCBANK', 'ICICIBANK',
  'TATAPOWER', 'SBIN', 'WIPRO', 'TITAN', 'TATASTEEL',
  'ADANIENT', 'MARUTI', 'AAPL', 'MSFT', 'TSLA', 'NVDA'
];

export const SearchBar = ({ onSearch, initialSymbol = 'TCS', loading = false }) => {
  const [symbol, setSymbol] = useState(initialSymbol);

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = symbol.trim().toUpperCase();
    if (clean) {
      onSearch(clean);
    }
  };

  const handleChipClick = (ticker) => {
    setSymbol(ticker);
    onSearch(ticker);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Enter ANY Stock Symbol (e.g. TATAPOWER, SBIN, WIPRO, AAPL, MSFT, RELIANCE)..."
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || !symbol.trim()}>
          <span>{loading ? 'Downloading & Analyzing...' : 'Predict & Analyze'}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="quick-tickers">
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Globe size={13} color="var(--accent-blue)" /> Dynamic Live Tickers:
        </span>
        {SUGGESTED_TICKERS.map((t) => (
          <button
            key={t}
            type="button"
            className="ticker-chip"
            onClick={() => handleChipClick(t)}
            disabled={loading}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
};
