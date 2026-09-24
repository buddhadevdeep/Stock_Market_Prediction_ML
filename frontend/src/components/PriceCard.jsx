import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

export const PriceCard = ({ data }) => {
  if (!data) return null;

  const isPositive = data.change >= 0;

  return (
    <div className="card">
      <div className="card-header">
        <span>Current Market Price</span>
        <DollarSign size={18} color="#3b82f6" />
      </div>
      <div className="card-value">
        ₹{data.currentPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: isPositive ? 'var(--success-color)' : 'var(--danger-color)',
          }}
        >
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {isPositive ? '+' : ''}{data.change} ({isPositive ? '+' : ''}{data.changePercent}%)
        </span>
        <span className="card-subtext">Today</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', color: 'var(--text-secondary)' }}>
        <div>Day High: <strong style={{ color: 'var(--text-primary)' }}>₹{data.dayHigh}</strong></div>
        <div>Day Low: <strong style={{ color: 'var(--text-primary)' }}>₹{data.dayLow}</strong></div>
        <div>Open: <strong style={{ color: 'var(--text-primary)' }}>₹{data.openPrice}</strong></div>
        <div>Volume: <strong style={{ color: 'var(--text-primary)' }}>{data.volume?.toLocaleString()}</strong></div>
      </div>
    </div>
  );
};
