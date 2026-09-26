import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Cpu, CheckCircle, Sun, Moon } from 'lucide-react';

const Pricing = () => {
  const { theme, toggleTheme } = useApp();

  const plans = [
    {
      name: 'Starter',
      price: '₹0',
      period: 'forever',
      desc: 'Essential tools for retail learners investigating predictions.',
      features: [
        'Daily updates for 2 stocks (TCS, INFY)',
        'Basic price chart access',
        'Simple SMA moving indicators',
        'Public documentation access'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Trader Pro',
      price: '₹1,499',
      period: 'month',
      desc: 'Complete quantitative prediction toolbox for regular retail traders.',
      features: [
        'Full support for all NSE blue-chip stocks',
        'Tomorrow predicted high/low ranges',
        'LSTM model confidence indexes',
        'RSI & MACD zones indicators',
        'Custom SMS & email alerts (up to 20)',
        'Explainable AI metrics reasons'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      desc: 'Raw prediction array feeds for algo traders and funds.',
      features: [
        'Raw backend JSON REST API streams',
        'Custom model training targets',
        'No rate limits on suggestions',
        'Dedicated server hosting resources',
        '99.9% prediction uptime guarantee'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <header className="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={28} style={{ color: 'var(--accent-purple)' }} />
          <span style={{ fontWeight: '800', fontSize: '1.4rem' }}>Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span></span>
        </div>
        <nav style={{ display: 'flex', gap: '30px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
          <Link to="/features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Features</Link>
          <Link to="/how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>How It Works</Link>
          <Link to="/pricing" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '600' }}>Pricing</Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>About</Link>
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

      {/* Main pricing structure */}
      <div style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>
          Predictive Access Plans
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '50px' }}>
          Choose the right access level for your trading frequency. No credit card required for Starter access.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`glass-card ${plan.popular ? 'card-active' : ''}`}
              style={{ 
                padding: '36px 30px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'relative' 
              }}
            >
              {plan.popular && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-12px', 
                  right: '24px', 
                  backgroundColor: 'var(--accent-purple)', 
                  color: 'white', 
                  fontSize: '0.7rem', 
                  fontWeight: '700', 
                  padding: '4px 10px', 
                  borderRadius: '12px',
                  textTransform: 'uppercase'
                }}>
                  Most Popular
                </span>
              )}
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {plan.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '14px 0' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {plan.period}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
                  {plan.desc}
                </p>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={16} style={{ color: 'var(--bullish-green)' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Link 
                to="/register" 
                className={plan.popular ? 'btn-primary-custom' : 'btn-outline-custom'}
                style={{ textDecoration: 'none', textAlign: 'center', display: 'block', width: '100%' }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
