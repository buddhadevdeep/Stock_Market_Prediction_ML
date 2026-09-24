import React, { useState } from 'react';
import { PlayCircle, CheckCircle, Database, Cpu, Terminal, Check } from 'lucide-react';
import { ErrorMessage } from '../components/StatusCards';
import api from '../services/api';

const SAMPLE_TICKERS = ['TCS', 'INFY', 'RELIANCE', 'HDFCBANK', 'ICICIBANK', 'ITC', 'TATAMOTORS', 'SBIN'];

export const Training = () => {
  const [symbol, setSymbol] = useState('TCS');
  const [period, setPeriod] = useState('5y');
  const [training, setTraining] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleTrain = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setTraining(true);
    setError(null);
    setResult(null);
    setLogs([]);

    addLog(`Initiating training pipeline for ${symbol.toUpperCase()} (${period})...`);

    // Simulated log stream while backend trains
    const t1 = setTimeout(() => addLog('Downloading historical OHLCV data via Yahoo Finance...'), 400);
    const t2 = setTimeout(() => addLog('Engineering technical features (SMAs, Returns, Volatility, Momentum)...'), 1000);
    const t3 = setTimeout(() => addLog('Constructing zero-leakage targets (shift -1) and chronological 80/20 split...'), 1600);
    const t4 = setTimeout(() => addLog('Fitting baseline Linear Regression (High & Low)...'), 2200);
    const t5 = setTimeout(() => addLog('Fitting Custom Decision Tree Classifier (Gini Impurity from scratch)...'), 2800);
    const t6 = setTimeout(() => addLog('Fitting Phase 5 Random Forest Regressor and Classifier...'), 3500);

    try {
      const res = await api.trainModel(symbol.toUpperCase(), period);
      addLog('Evaluating metrics (MAE, RMSE, R2, Accuracy, F1 Score)...');
      addLog('Serializing model binaries to models/ directory via joblib...');
      addLog('Training completed successfully!');
      setResult(res);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Model training failed.';
      setError(msg);
      addLog(`ERROR: ${msg}`);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      setTraining(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="sop-tag">Phase 3 &amp; Phase 5 SOP</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>
          Interactive Model Training Engine
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Retrain the complete machine learning pipeline on fresh NSE historical stock data.
        </p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Training Control Form */}
        <div className="card">
          <div className="card-header">
            <span>Training Configuration</span>
            <Cpu size={18} color="var(--accent-blue)" />
          </div>

          <form onSubmit={handleTrain}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Stock Symbol (NSE)
              </label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '1rem' }}
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. TCS, RELIANCE, INFY"
                disabled={training}
              />
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {SAMPLE_TICKERS.slice(0, 5).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="ticker-chip"
                    onClick={() => setSymbol(t)}
                    disabled={training}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Historical Period Window
              </label>
              <select
                className="search-input"
                style={{ paddingLeft: '1rem' }}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                disabled={training}
              >
                <option value="1y">1 Year (~250 Trading Days)</option>
                <option value="2y">2 Years (~500 Trading Days)</option>
                <option value="5y">5 Years (~1250 Trading Days) - Recommended</option>
                <option value="10y">10 Years (~2500 Trading Days)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={training || !symbol.trim()}>
              <PlayCircle size={18} />
              <span>{training ? 'Training Pipeline Running...' : 'Train Models'}</span>
            </button>
          </form>
        </div>

        {/* Live Terminal / Execution Log */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <span>Pipeline Execution Console</span>
            <Terminal size={18} color="var(--accent-purple)" />
          </div>

          <div
            style={{
              flex: 1,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#34d399',
              minHeight: '220px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>
                Click &quot;Train Models&quot; to begin pipeline execution...
              </div>
            ) : (
              logs.map((log, index) => <div key={index} style={{ marginBottom: '4px' }}>{log}</div>)
            )}
          </div>
        </div>
      </div>

      {/* Result Metrics Summary */}
      {result && result.metrics && (
        <div className="card">
          <div className="card-header">
            <span>Training Completed: {result.metrics.symbol}</span>
            <CheckCircle size={18} color="var(--success-color)" />
          </div>

          <div className="cards-grid" style={{ marginBottom: '1rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dataset Size</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{result.metrics.dataset_info?.total_records} Records</div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Linear Regression R&sup2; (High)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--success-color)' }}>
                {result.metrics.regression?.linear_regression_high?.test?.R2}
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Custom Decision Tree Accuracy</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-purple)' }}>
                {result.metrics.classification?.custom_decision_tree_direction?.test?.accuracy}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Random Forest Accuracy</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-blue)' }}>
                {result.metrics.classification?.random_forest_direction?.test?.accuracy}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
