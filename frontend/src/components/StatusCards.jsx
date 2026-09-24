import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const Loading = ({ message = 'Processing Machine Learning Pipeline...' }) => (
  <div className="loading-box">
    <div className="spinner" />
    <div style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-primary)' }}>{message}</div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
      Extracting historical OHLCV &bull; Engineering technical indicators &bull; Executing tree inference
    </div>
  </div>
);

export const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;
  return (
    <div className="error-box">
      <AlertCircle size={20} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: '0.9rem' }}>{message}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export const MetricCard = ({ title, value, subtitle, icon, highlight = false }) => (
  <div className="card" style={{ borderTop: highlight ? '3px solid var(--accent-blue)' : undefined }}>
    <div className="card-header">
      <span>{title}</span>
      {icon}
    </div>
    <div className="card-value">{value}</div>
    {subtitle && <div className="card-subtext">{subtitle}</div>}
  </div>
);
