import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Cpu, Mail, Globe, Shield, Sun, Moon } from 'lucide-react';

const About = () => {
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
          <Link to="/features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>Features</Link>
          <Link to="/how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>How It Works</Link>
          <Link to="/about" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>About</Link>
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
      <div style={{ padding: '40px 5%', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>
          About StockAI Platform
        </h1>
        
        <div className="glass-card" style={{ padding: '24px 20px', marginBottom: '24px', lineHeight: '1.65' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '12px', color: 'var(--accent-purple)' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '14px', fontSize: '0.92rem' }}>
            StockAI was created to democratize advanced machine-learning capabilities for retail investors. While large hedge funds have dedicated quantitative modeling teams, retail users are often left looking at static lagging indicators.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '14px', fontSize: '0.92rem' }}>
            We merge standard technical analysis calculations with deep learning regressions to output explainable probability vectors. This helps traders look at market metrics through the eyes of mathematical models.
          </p>
        </div>

        <div className="landing-matrix-grid" style={{ marginBottom: '36px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} style={{ color: 'var(--accent-cyan)' }} /> Ethics & Integrity
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              We do not promise guaranteed prices. Every value on StockAI is clearly framed as a statistical prediction derived from historical data inputs, preventing misleading claims.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={20} style={{ color: 'var(--bullish-green)' }} /> Modern Architecture
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Built using a modern React frontend linked to REST-ready API layers. The prediction system uses LSTM networks and gradient-boosted trees for high backtesting integrity.
            </p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <h4 style={{ fontWeight: '700', marginBottom: '10px' }}>Contact our Quant Team</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Have questions about model features, backtesting datasets, or API integrations?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <a href="mailto:deepbuddhadev135@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '600' }}>
              <Mail size={16} /> deepbuddhadev135@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
