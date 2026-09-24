import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Zap, Eye, BarChart2, ShieldAlert, BookOpen } from 'lucide-react';

const FeaturesPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ 
        height: '75px', 
        borderBottom: '1px solid var(--border-color)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 5%',
        backgroundColor: 'rgba(7, 11, 19, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={28} style={{ color: 'var(--accent-purple)' }} />
          <span style={{ fontWeight: '800', fontSize: '1.4rem' }}>Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span></span>
        </div>
        <nav style={{ display: 'flex', gap: '30px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
          <Link to="/features" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>Features</Link>
          <Link to="/how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>How It Works</Link>
          <Link to="/pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Pricing</Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>About</Link>
        </nav>
        <div>
          <Link to="/login" style={{ marginRight: '20px', color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
          <Link to="/register" className="btn-primary-custom" style={{ textDecoration: 'none' }}>Get Started</Link>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>
          Technical Indicators & AI Infrastructure
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px auto' }}>
          Advanced quantitative modeling tools built on neural networks and technical algorithms to simplify your market research.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '50px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <Zap size={24} style={{ color: 'var(--accent-purple)', marginTop: '4px' }} />
              <div>
                <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>LSTM Predictive Network</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Utilizes Long Short-Term Memory recurrent networks to read previous close sequences, capture long-term momentum trends, and evaluate tomorrow's possible trading ranges.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <Eye size={24} style={{ color: 'var(--accent-cyan)', marginTop: '4px' }} />
              <div>
                <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Continuous Sentiment Scorer</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Aggregates regulatory articles and financial news headlines, categorizing topics into positive, negative, or neutral sentiment scores utilizing pre-trained NLP models.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <BarChart2 size={24} style={{ color: 'var(--bullish-green)', marginTop: '4px' }} />
              <div>
                <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Dynamic Technical Overlays</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Instantly toggle technical averages (SMA 20/50/200, EMA) and volatility metrics (RSI, Bollinger Bands, ATR) directly layered on our interactive candlestick charts.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <ShieldAlert size={24} style={{ color: 'var(--bearish-red)', marginTop: '4px' }} />
              <div>
                <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Real-time Risk Alerts</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Configure instant notification criteria for high-volatility shifts, target stock predictions, and sudden model confidence drops.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <BookOpen size={48} style={{ color: 'var(--accent-purple)', margin: '0 auto 16px auto' }} />
          <h3 style={{ fontWeight: '700', marginBottom: '12px' }}>Curious to see it in action?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px auto' }}>
            Open our mock terminal panel. Experience real-time predictions, portfolio logs, and comparisons.
          </p>
          <Link to="/register" className="btn-primary-custom" style={{ textDecoration: 'none' }}>
            Launch Live Demo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
