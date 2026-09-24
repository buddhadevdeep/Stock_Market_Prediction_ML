import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Loading, ErrorMessage } from '../components/StatusCards';
import api from '../services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Award, GitCommit, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export const ModelEvaluation = () => {
  const [symbol, setSymbol] = useState('TCS');
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvaluation = async (targetSymbol) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getModelResults(targetSymbol);
      setSymbol(targetSymbol);
      setEvalData(res);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load model evaluation metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluation('TCS');
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="sop-tag">Phase 4 &amp; Phase 5 SOP</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>
          Model Evaluation, Diagnostics &amp; Comparison
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Compare baseline models (Linear Regression, Custom Decision Tree) against Phase 5 Ensembles (Random Forest).
        </p>
      </div>

      <SearchBar onSearch={fetchEvaluation} initialSymbol={symbol} loading={loading} />

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      {loading && <Loading message={`Evaluating models for ${symbol}...`} />}

      {!loading && evalData && (
        <>
          {/* Section 1: Regression Models Comparison */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <span style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                Regression Evaluation: Linear Regression vs. Random Forest Regressor
              </span>
              <Award size={20} color="var(--accent-blue)" />
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Target</th>
                    <th>MAE (₹)</th>
                    <th>MSE</th>
                    <th>RMSE (₹)</th>
                    <th>R&sup2; Score (Test)</th>
                    <th>Generalization Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Linear Regression (Baseline)</td>
                    <td>High Price</td>
                    <td>₹{evalData.regression?.linear_regression_high?.test?.MAE}</td>
                    <td>{evalData.regression?.linear_regression_high?.test?.MSE}</td>
                    <td>₹{evalData.regression?.linear_regression_high?.test?.RMSE}</td>
                    <td style={{ color: 'var(--success-color)', fontWeight: '700' }}>
                      {evalData.regression?.linear_regression_high?.test?.R2}
                    </td>
                    <td><span className="badge badge-bullish" style={{ fontSize: '0.75rem' }}>{evalData.regression?.linear_regression_high?.fit_status}</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Random Forest Regressor (Phase 5)</td>
                    <td>High Price</td>
                    <td>₹{evalData.regression?.random_forest_high?.test?.MAE}</td>
                    <td>{evalData.regression?.random_forest_high?.test?.MSE}</td>
                    <td>₹{evalData.regression?.random_forest_high?.test?.RMSE}</td>
                    <td style={{ color: 'var(--success-color)', fontWeight: '700' }}>
                      {evalData.regression?.random_forest_high?.test?.R2}
                    </td>
                    <td><span className="badge badge-bullish" style={{ fontSize: '0.75rem' }}>{evalData.regression?.random_forest_high?.fit_status}</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Linear Regression (Baseline)</td>
                    <td>Low Price</td>
                    <td>₹{evalData.regression?.linear_regression_low?.test?.MAE}</td>
                    <td>{evalData.regression?.linear_regression_low?.test?.MSE}</td>
                    <td>₹{evalData.regression?.linear_regression_low?.test?.RMSE}</td>
                    <td style={{ color: 'var(--success-color)', fontWeight: '700' }}>
                      {evalData.regression?.linear_regression_low?.test?.R2}
                    </td>
                    <td><span className="badge badge-bullish" style={{ fontSize: '0.75rem' }}>{evalData.regression?.linear_regression_low?.fit_status}</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Random Forest Regressor (Phase 5)</td>
                    <td>Low Price</td>
                    <td>₹{evalData.regression?.random_forest_low?.test?.MAE}</td>
                    <td>{evalData.regression?.random_forest_low?.test?.MSE}</td>
                    <td>₹{evalData.regression?.random_forest_low?.test?.RMSE}</td>
                    <td style={{ color: 'var(--success-color)', fontWeight: '700' }}>
                      {evalData.regression?.random_forest_low?.test?.R2}
                    </td>
                    <td><span className="badge badge-bullish" style={{ fontSize: '0.75rem' }}>{evalData.regression?.random_forest_low?.fit_status}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Classification Models Comparison */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <span style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                Classification Evaluation: Custom Decision Tree (Manual Gini) vs. Random Forest Classifier
              </span>
              <GitCommit size={20} color="var(--accent-purple)" />
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Classification Task</th>
                    <th>Accuracy (%)</th>
                    <th>Precision (%)</th>
                    <th>Recall (%)</th>
                    <th>F1 Score (%)</th>
                    <th>Overfitting Check</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: '600', color: 'var(--accent-purple)' }}>
                      Custom Decision Tree (Phase 3 Manual)
                    </td>
                    <td>Direction (Bullish / Bearish)</td>
                    <td style={{ fontWeight: '700' }}>{evalData.classification?.custom_decision_tree_direction?.test?.accuracy}%</td>
                    <td>{evalData.classification?.custom_decision_tree_direction?.test?.precision}%</td>
                    <td>{evalData.classification?.custom_decision_tree_direction?.test?.recall}%</td>
                    <td>{evalData.classification?.custom_decision_tree_direction?.test?.f1}%</td>
                    <td>{evalData.classification?.custom_decision_tree_direction?.fit_status}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Random Forest Classifier (Phase 5)</td>
                    <td>Direction (Bullish / Bearish)</td>
                    <td style={{ fontWeight: '700' }}>{evalData.classification?.random_forest_direction?.test?.accuracy}%</td>
                    <td>{evalData.classification?.random_forest_direction?.test?.precision}%</td>
                    <td>{evalData.classification?.random_forest_direction?.test?.recall}%</td>
                    <td>{evalData.classification?.random_forest_direction?.test?.f1}%</td>
                    <td>{evalData.classification?.random_forest_direction?.fit_status}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '600', color: 'var(--accent-purple)' }}>
                      Custom Decision Tree (Phase 3 Manual)
                    </td>
                    <td>Trading Signal (BUY / HOLD / SELL)</td>
                    <td style={{ fontWeight: '700' }}>{evalData.classification?.custom_decision_tree_signal?.test?.accuracy}%</td>
                    <td>{evalData.classification?.custom_decision_tree_signal?.test?.precision}%</td>
                    <td>{evalData.classification?.custom_decision_tree_signal?.test?.recall}%</td>
                    <td>{evalData.classification?.custom_decision_tree_signal?.test?.f1}%</td>
                    <td>{evalData.classification?.custom_decision_tree_signal?.fit_status}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '600' }}>Random Forest Classifier (Phase 5)</td>
                    <td>Trading Signal (BUY / HOLD / SELL)</td>
                    <td style={{ fontWeight: '700' }}>{evalData.classification?.random_forest_signal?.test?.accuracy}%</td>
                    <td>{evalData.classification?.random_forest_signal?.test?.precision}%</td>
                    <td>{evalData.classification?.random_forest_signal?.test?.recall}%</td>
                    <td>{evalData.classification?.random_forest_signal?.test?.f1}%</td>
                    <td>{evalData.classification?.random_forest_signal?.fit_status}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Feature Importance & Decision Tree Rules */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.25rem' }}>
            {/* Feature Importance Chart */}
            <div className="chart-card">
              <div className="chart-title">
                <span>Top Technical Feature Importances (Random Forest)</span>
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={(evalData.feature_importance || []).slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="#6b7280" fontSize={10} />
                    <YAxis dataKey="feature" type="category" stroke="#6b7280" fontSize={11} width={100} />
                    <Tooltip />
                    <Bar dataKey="importance" fill="#3b82f6" name="Gini Importance" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Manual Decision Tree Rules Preview */}
            <div className="chart-card">
              <div className="chart-title">
                <span>Custom Decision Tree Rules (Phase 3 College Viva Preview)</span>
                <FileText size={18} color="var(--accent-purple)" />
              </div>
              <div
                style={{
                  background: 'var(--bg-primary)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  lineHeight: '1.6',
                  color: '#93c5fd',
                }}
              >
                {evalData.tree_rules_sample?.map((rule, rIdx) => (
                  <div key={rIdx}>{rule}</div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
