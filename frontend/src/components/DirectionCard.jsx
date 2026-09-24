import React from 'react';
import { Compass, TrendingUp, TrendingDown } from 'lucide-react';

export const DirectionCard = ({ data }) => {
  if (!data) return null;

  const isBullish = data.direction === 'BULLISH';

  return (
    <div className="card" style={{ borderTop: `3px solid ${isBullish ? 'var(--success-color)' : 'var(--danger-color)'}` }}>
      <div className="card-header">
        <span>Market Direction</span>
        <Compass size={18} color={isBullish ? 'var(--success-color)' : 'var(--danger-color)'} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span className={`badge ${isBullish ? 'badge-bullish' : 'badge-bearish'}`} style={{ fontSize: '1.1rem', padding: '0.4rem 1rem' }}>
          {isBullish ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          {data.direction}
        </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Next-Day Trend
        </span>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
          <span>Model Confidence:</span>
          <strong>{data.directionConfidence}%</strong>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${data.directionConfidence}%`,
              height: '100%',
              background: isBullish ? 'var(--success-color)' : 'var(--danger-color)',
              borderRadius: '3px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
};
