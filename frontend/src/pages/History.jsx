import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, RefreshCw } from 'lucide-react';
import { Loading, ErrorMessage } from '../components/StatusCards';
import api from '../services/api';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await api.getHistory(50);
      setHistory(records);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load prediction history.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear all prediction history records?')) {
      try {
        await api.clearHistory();
        setHistory([]);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            Prediction Query History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Historical prediction records stored in MongoDB Atlas database.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchHistory} disabled={loading}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          {history.length > 0 && (
            <button className="btn btn-secondary" style={{ color: 'var(--danger-color)' }} onClick={handleClear}>
              <Trash2 size={16} />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      {loading && <Loading message="Retrieving prediction records from database..." />}

      {!loading && history.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <HistoryIcon size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Prediction History Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
            Search and analyze any NSE stock ticker on the Dashboard to log prediction queries.
          </p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Current Price (₹)</th>
                  <th>Predicted High (₹)</th>
                  <th>Predicted Low (₹)</th>
                  <th>Expected Range (₹)</th>
                  <th>Direction</th>
                  <th>Trading Signal</th>
                  <th>Confidence</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {history.map((rec, i) => (
                  <tr key={rec._id || i}>
                    <td style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{rec.symbol}</td>
                    <td>₹{rec.currentPrice?.toFixed(2)}</td>
                    <td style={{ color: 'var(--success-color)' }}>₹{rec.predictedHigh?.toFixed(2)}</td>
                    <td style={{ color: 'var(--danger-color)' }}>₹{rec.predictedLow?.toFixed(2)}</td>
                    <td>₹{rec.predictedRange?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${rec.direction === 'BULLISH' ? 'badge-bullish' : 'badge-bearish'}`} style={{ fontSize: '0.75rem' }}>
                        {rec.direction}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${rec.signal === 'BUY' ? 'badge-buy' : rec.signal === 'SELL' ? 'badge-sell' : 'badge-hold'}`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {rec.signal}
                      </span>
                    </td>
                    <td>{rec.directionConfidence}%</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(rec.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
