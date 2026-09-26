import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Cpu, Zap, Eye, BarChart2, ShieldAlert, BookOpen, Sun, Moon } from 'lucide-react';

const FeaturesPage = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <header className="landing-header">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <Cpu size={26} style={{ color: 'var(--accent-purple)' }} />
          <span style={{ fontWeight: '800', fontSize: '1.3rem' }}>Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span></span>
        </Link>
        <nav className="hide-on-mobile" style={{ display: 'flex', gap: '24px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>Home</Link>
          <Link to="/features" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Features</Link>
          <Link to="/how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>How It Works</Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>About</Link>
        </nav>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              background: 'var(--bg-chip)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              width: '34px',
              height: '34px',
              flexShrink: 0
            }}
          >
            {theme === 'dark' ? <Sun size={16} style={{ color: '#fbbf24' }} /> : <Moon size={16} style={{ color: '#6366f1' }} />}
          </button>
          <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem', padding: '6px 10px' }}>Login</Link>
          <Link to="/register" className="btn-primary-custom" style={{ textDecoration: 'none', padding: '7px 14px', fontSize: '0.82rem' }}>Get Started</Link>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>
          Technical Indicators & AI Infrastructure
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px auto', fontSize: '0.94rem' }}>
          Advanced quantitative modeling tools built on neural networks and technical algorithms to simplify your market research.
        </p>

        <div className="landing-features-grid" style={{ marginBottom: '40px' }}>
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
