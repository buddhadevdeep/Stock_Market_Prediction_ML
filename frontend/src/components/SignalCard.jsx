import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, PauseCircle } from 'lucide-react';

export const SignalCard = ({ data }) => {
  if (!data) return null;

  const getSignalBadge = (sig) => {
    switch (sig) {
      case 'BUY':
        return { cls: 'badge-buy', icon: <CheckCircle2 size={18} />, color: 'var(--success-color)' };
      case 'SELL':
        return { cls: 'badge-sell', icon: <ShieldAlert size={18} />, color: 'var(--danger-color)' };
      default:
        return { cls: 'badge-hold', icon: <PauseCircle size={18} />, color: 'var(--warning-color)' };
    }
  };

  const currentBadge = getSignalBadge(data.signal);

  return (
    <div className="card" style={{ borderTop: `3px solid ${currentBadge.color}` }}>
      <div className="card-header">
        <span>Trading Signal (Supervised)</span>
        <Activity size={18} color={currentBadge.color} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span className={`badge ${currentBadge.cls}`} style={{ fontSize: '1.1rem', padding: '0.4rem 1rem' }}>
          {currentBadge.icon}
          {data.signal}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Rule: Return &plusmn;1%
        </span>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
          <span>Classification Confidence:</span>
          <strong>{data.signalConfidence}%</strong>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${data.signalConfidence}%`,
              height: '100%',
              background: currentBadge.color,
              borderRadius: '3px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
};
