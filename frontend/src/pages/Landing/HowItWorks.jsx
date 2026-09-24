import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowDown, Database, Cpu as ModelIcon, TrendingUp, AlertCircle, HelpCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Market Data Ingestion',
      desc: 'Retrieves historical daily OHLCV (Open, High, Low, Close, Volume) data from reliable financial indices.',
      icon: Database,
      color: 'var(--accent-cyan)'
    },
    {
      title: 'Feature Engineering',
      desc: 'Transforms raw price structures into technical inputs including 14-day RSI indicators, moving averages, and lag parameters.',
      icon: HelpCircle,
      color: 'var(--warning-yellow)'
    },
    {
      title: 'Machine Learning Model Processing',
      desc: 'Feeds engineered tensors into advanced algorithms (LSTM, XGBoost Regressors, Random Forests) to process complex temporal parameters.',
      icon: ModelIcon,
      color: 'var(--accent-purple)'
    },
    {
      title: 'Prediction Calculation',
      desc: 'Outputs concrete forecast ranges, predicted highs, and estimated directional trend categories (Bullish, Bearish, Neutral).',
      icon: TrendingUp,
      color: 'var(--bullish-green)'
    },
    {
      title: 'Explainable AI Integration',
      desc: 'Identifies which underlying indicators (e.g. RSI crossing 50, MACD crossover) most heavily influenced the model outcome.',
      icon: AlertCircle,
      color: 'var(--bearish-red)'
    }
  ];

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
          <Link to="/how-it-works" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>How It Works</Link>
          <Link to="/pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Pricing</Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>About</Link>
        </nav>
        <div>
          <Link to="/login" style={{ marginRight: '20px', color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
          <Link to="/register" className="btn-primary-custom" style={{ textDecoration: 'none' }}>Get Started</Link>
        </div>
      </header>

      {/* Main timeline */}
      <div style={{ padding: '60px 5%', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>
          The Forecasting Pipeline
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '60px' }}>
          An transparent pipeline explaining how StockAI transforms market indicators into high-accuracy prediction bands.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={idx}>
                <div className="glass-card" style={{ width: '100%', padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: `1.5px solid ${step.color}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={24} style={{ color: step.color }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: step.color, textTransform: 'uppercase' }}>
                      Step 0{idx + 1}
                    </span>
                    <h4 style={{ fontWeight: '700', margin: '4px 0 6px 0' }}>{step.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{step.desc}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowDown size={24} style={{ color: 'var(--text-muted)', margin: '8px 0' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
