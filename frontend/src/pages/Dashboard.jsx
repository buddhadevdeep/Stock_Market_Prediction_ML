import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { PriceCard } from '../components/PriceCard';
import { PredictionCard } from '../components/PredictionCard';
import { DirectionCard } from '../components/DirectionCard';
import { SignalCard } from '../components/SignalCard';
import { ChartCard } from '../components/ChartCard';
import { Loading, ErrorMessage } from '../components/StatusCards';
import api from '../services/api';
import { BookOpen, HelpCircle } from 'lucide-react';

export const Dashboard = () => {
  const [symbol, setSymbol] = useState('TCS');
  const [prediction, setPrediction] = useState(null);
  const [exploreData, setExploreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStockAnalysis = async (searchSymbol) => {
    setLoading(true);
    setError(null);
    try {
      // Parallel requests for prediction and chart data
      const [predRes, dataRes] = await Promise.all([
        api.getPrediction(searchSymbol),
        api.getExploreData(searchSymbol, '2y'),
      ]);
      setSymbol(searchSymbol);
      setPrediction(predRes);
      setExploreData(dataRes);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch stock prediction.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockAnalysis('TCS');
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>
          Stock Market Prediction System
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Machine learning forecasts for NSE equities using Supervised Regression &amp; Custom Gini Decision Trees.
        </p>
      </div>

      <SearchBar onSearch={fetchStockAnalysis} initialSymbol={symbol} loading={loading} />

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {loading && <Loading message={`Running machine learning models for ${symbol}...`} />}

      {!loading && prediction && (
        <>
          {/* Main Key Metrics Grid */}
          <div className="cards-grid">
            <PriceCard data={prediction} />
            <PredictionCard data={prediction} />
            <DirectionCard data={prediction} />
            <SignalCard data={prediction} />
          </div>

          {/* Model Comparison / Baseline Callout */}
          {prediction.baseline && (
            <div
              className="card"
              style={{
                marginBottom: '1.75rem',
                background: 'var(--bg-chip)',
                border: '1px dashed var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <BookOpen size={18} color="var(--accent-purple)" />
                <strong style={{ fontSize: '0.95rem' }}>Phase 3 Baseline vs. Phase 5 Ensemble Comparison</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Baseline Linear Regression High:</span>{' '}
                  <strong>₹{prediction.baseline.predictedHigh}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Baseline Linear Regression Low:</span>{' '}
                  <strong>₹{prediction.baseline.predictedLow}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Custom Decision Tree Direction:</span>{' '}
                  <strong>{prediction.baseline.direction} ({prediction.baseline.directionConfidence}%)</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Custom Decision Tree Signal:</span>{' '}
                  <strong>{prediction.baseline.signal} ({prediction.baseline.signalConfidence}%)</strong>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Recharts */}
          {exploreData?.chart_data && (
            <ChartCard chartData={exploreData.chart_data} symbol={prediction.symbol} />
          )}

          {/* Recent Records Table */}
          {exploreData?.recent_records && (
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <div className="card-header">
                <span>Recent 15 Trading Sessions (Input Feature Sample)</span>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Open (₹)</th>
                      <th>High (₹)</th>
                      <th>Low (₹)</th>
                      <th>Close (₹)</th>
                      <th>SMA 20 (₹)</th>
                      <th>Daily Return</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exploreData.recent_records.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{r.date}</td>
                        <td>{r.open}</td>
                        <td style={{ color: 'var(--success-color)' }}>{r.high}</td>
                        <td style={{ color: 'var(--danger-color)' }}>{r.low}</td>
                        <td style={{ fontWeight: '600' }}>{r.close}</td>
                        <td>{r.sma20}</td>
                        <td style={{ color: r.dailyReturn.startsWith('-') ? 'var(--danger-color)' : 'var(--success-color)' }}>
                          {r.dailyReturn}
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{r.volume.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
