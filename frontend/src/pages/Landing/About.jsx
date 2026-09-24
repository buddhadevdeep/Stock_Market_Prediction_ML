import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, Globe, Shield } from 'lucide-react';

const About = () => {
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
          <Link to="/features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Features</Link>
          <Link to="/how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>How It Works</Link>
          <Link to="/pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Pricing</Link>
          <Link to="/about" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>About</Link>
        </nav>
        <div>
          <Link to="/login" style={{ marginRight: '20px', color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
          <Link to="/register" className="btn-primary-custom" style={{ textDecoration: 'none' }}>Get Started</Link>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: '60px 5%', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>
          About StockAI Platform
        </h1>
        
        <div className="glass-card" style={{ padding: '30px', marginBottom: '30px', lineHeight: '1.7' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '14px', color: 'var(--accent-purple)' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            StockAI was created to democratize advanced machine-learning capabilities for retail investors. While large hedge funds have dedicated quantitative modeling teams, retail users are often left looking at static lagging indicators.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            We merge standard technical analysis calculations with deep learning regressions to output explainable probability vectors. This helps traders look at market metrics through the eyes of mathematical models.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
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
            <a href="mailto:support@stockai.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '600' }}>
              <Mail size={16} /> support@stockai.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
