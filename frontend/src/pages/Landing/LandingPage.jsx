import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  BarChart2, 
  Activity, 
  ArrowRight, 
  Layers, 
  CheckCircle,
  Play,
  Mail,
  Lock,
  User,
  X,
  Zap,
  AlertCircle
} from 'lucide-react';

const LandingPage = () => {
  const { login, register, user } = useApp();
  const navigate = useNavigate();

  // Interactive Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthError('');
    setShowAuthModal(true);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        await login(authEmail, authPassword, true);
      } else {
        await register(authName, authEmail, authPassword);
        await login(authEmail, authPassword, true);
      }
      setShowAuthModal(false);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInstantDemo = async () => {
    setAuthLoading(true);
    try {
      await login('arjun@stockai.com', 'demo123', true);
      navigate('/dashboard');
    } catch (e) {
      navigate('/dashboard');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#060a12', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>
      
      {/* Background ambient light orbs */}
      <div style={{ position: 'fixed', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(0,0,0,0) 70%)', top: '-150px', left: '-100px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(0,0,0,0) 70%)', top: '20%', right: '-150px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header / Top Navigation */}
      <header style={{ 
        height: '75px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 6%',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(6, 10, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 100
      }}>
        <div 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Cpu size={22} style={{ color: '#ffffff' }} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.4rem', letterSpacing: '-0.3px', color: '#ffffff' }}>
            Stock<span style={{ color: '#818cf8' }}>AI</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#hero" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', transition: 'color 0.2s' }}>Home</a>
          <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem', transition: 'color 0.2s' }}>Features</a>
          <a href="#how-it-works" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem', transition: 'color 0.2s' }}>How It Works</a>
          <Link to="/about" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>About</Link>
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 20px',
                fontSize: '0.88rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
              }}
            >
              Go to Dashboard <ArrowRight size={15} />
            </button>
          ) : (
            <>
              <button 
                onClick={() => handleOpenAuth('login')}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#ffffff', 
                  cursor: 'pointer', 
                  fontWeight: '600', 
                  fontSize: '0.9rem',
                  padding: '8px 12px'
                }}
              >
                Login
              </button>
              <button 
                onClick={() => handleOpenAuth('register')}
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                  color: '#ffffff', 
                  border: 'none',
                  borderRadius: '8px', 
                  padding: '9px 20px', 
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" style={{ padding: '75px 6% 65px 6%', maxWidth: '1380px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '50px', alignItems: 'center' }}>
          
          {/* Left Hero Details */}
          <div>
            {/* Pill Badge */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              background: 'rgba(99, 102, 241, 0.12)', 
              border: '1px solid rgba(99, 102, 241, 0.3)', 
              marginBottom: '24px' 
            }}>
              <span style={{ color: '#818cf8', fontSize: '0.85rem' }}>∿</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#c7d2fe', letterSpacing: '0.8px' }}>
                NEXT-GEN ML FORECASTING
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 style={{ fontSize: '3.6rem', fontWeight: '900', lineHeight: '1.12', letterSpacing: '-1px', marginBottom: '20px' }}>
              AI-Powered <br />
              <span style={{ 
                background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                Stock Market
              </span> <br />
              Prediction
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.65', marginBottom: '36px', maxWidth: '540px' }}>
              Predict tomorrow's stock prices using machine learning, technical indicators, market sentiment and intelligent analytics.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleOpenAuth('register')} 
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                  color: '#fff', 
                  border: 'none',
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '14px 28px', 
                  fontSize: '0.98rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
                }}
              >
                Get Started <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={handleInstantDemo} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.04)', 
                  color: '#f8fafc', 
                  border: '1px solid rgba(255, 255, 255, 0.12)', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '14px 26px', 
                  fontSize: '0.98rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Play size={16} fill="white" /> View Demo
              </button>
            </div>

            {/* Quick Stats Panel */}
            <div style={{ display: 'flex', gap: '48px', marginTop: '54px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '32px' }}>
              <div>
                <h4 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-mono)' }}>98.92%</h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>Historical Accuracy</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>6+</h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>Key NSE Indexes</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>Ensemble</h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>ML Architectures</p>
              </div>
            </div>
          </div>

          {/* Right Hero Live Interactive Preview Card */}
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                padding: '28px', 
                position: 'relative', 
                zIndex: 2, 
                backgroundColor: 'rgba(15, 23, 42, 0.75)', 
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(16px)'
              }}
            >
              {/* Bull vs Bear Top Split Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
                
                {/* Bullish State */}
                <div style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.06)', 
                  border: '1px solid rgba(16, 185, 129, 0.25)', 
                  borderRadius: '12px', 
                  padding: '18px 14px', 
                  textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🐂</div>
                  <div style={{ fontWeight: '800', color: '#10b981', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                    BULLISH STATE
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                    Confidence index 83%
                  </div>
                </div>

                {/* Bearish Range */}
                <div style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.06)', 
                  border: '1px solid rgba(239, 68, 68, 0.25)', 
                  borderRadius: '12px', 
                  padding: '18px 14px', 
                  textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🐻</div>
                  <div style={{ fontWeight: '800', color: '#ef4444', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                    BEARISH RANGE
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                    Selling Resistance high
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px' }}>TCS / NSE</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      ₹3,682.45
                    </h3>
                  </div>
                  <span style={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                    color: '#10b981', 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem', 
                    fontWeight: '800' 
                  }}>
                    +2.45%
                  </span>
                </div>
              </div>

              {/* Tomorrow Forecast Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>AI Tomorrow Prediction</span>
                <span style={{ color: '#10b981', fontWeight: '800', fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>
                  ₹3,745.80 (Buy Signal)
                </span>
              </div>
            </div>

            {/* Glowing Backdrop behind card */}
            <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.25)', filter: 'blur(90px)', top: '10%', right: '10%', zIndex: 1 }} />
          </div>

        </div>
      </section>

      {/* Feature Cards Grid: Engineered for Intelligent Investors */}
      <section id="features" style={{ padding: '80px 6%', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '54px' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '12px', letterSpacing: '-0.5px' }}>
              Engineered for Intelligent Investors
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '620px', margin: '0 auto', fontSize: '0.98rem' }}>
              Sophisticated metrics, AI analysis, and prediction tools merged into a seamless dashboard.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            
            <div className="glass-card" style={{ padding: '28px', backgroundColor: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Cpu size={24} style={{ color: '#818cf8' }} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px' }}>AI Predictions</h4>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6' }}>
                Tomorrow's High/Low calculations modeled with LSTM and XGBoost regressors based on OHLCV features.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', backgroundColor: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Activity size={24} style={{ color: '#38bdf8' }} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px' }}>Real-Time Market Data</h4>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6' }}>
                Live streaming quotes for blue-chip companies, custom sparklines, and instant stock indicators.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', backgroundColor: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <BarChart2 size={24} style={{ color: '#10b981' }} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px' }}>Technical Analysis</h4>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6' }}>
                On-demand overlays for SMA, EMA, MACD, RSI 14, ATR, and Bollinger bands mapped to candlestick points.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', backgroundColor: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Layers size={24} style={{ color: '#fbbf24' }} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px' }}>Smart Insights</h4>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6' }}>
                Explainable AI predictions summarizing indicator state thresholds and historical trends.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', backgroundColor: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <ShieldCheck size={24} style={{ color: '#818cf8' }} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px' }}>Risk Management</h4>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6' }}>
                Real-time beta tracking, volatility indexes, and risk probability estimates for open positions.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', backgroundColor: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <TrendingUp size={24} style={{ color: '#38bdf8' }} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px' }}>Portfolio Tracking</h4>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6' }}>
                Holdings records consolidated with allocation charts and dynamic health index assessments.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Workflow Section */}
      <section id="how-it-works" style={{ padding: '80px 6%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          
          <h2 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '44px', letterSpacing: '-0.5px' }}>
            How StockAI Works
          </h2>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-around', 
            alignItems: 'center', 
            gap: '16px',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            padding: '38px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {[
              { num: '1', label: 'Market Data', sub: 'OHLCV Feed' },
              { num: '2', label: 'Feature Engineering', sub: 'Technical Overlays' },
              { num: '3', label: 'Machine Learning', sub: 'Ensemble Models' },
              { num: '4', label: 'AI Explanations', sub: 'Signal Reasoning' },
              { num: '5', label: 'Trading Signals', sub: 'Buy / Hold / Sell' }
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div style={{ minWidth: '140px' }}>
                  <div style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '50%', 
                    backgroundColor: '#6366f1', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 12px auto',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    boxShadow: '0 0 14px rgba(99, 102, 241, 0.5)'
                  }}>
                    {step.num}
                  </div>
                  <h5 style={{ fontSize: '0.92rem', fontWeight: '800', marginBottom: '4px', color: '#fff' }}>{step.label}</h5>
                  <p style={{ fontSize: '0.74rem', color: '#64748b' }}>{step.sub}</p>
                </div>
                {idx < arr.length - 1 && (
                  <div style={{ color: '#475569', fontSize: '1.2rem' }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </section>

      {/* Supported Analysis Section & Model Integrity Statement */}
      <section style={{ padding: '70px 6% 90px 6%', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '54px', alignItems: 'center' }}>
            
            <div>
              <h2 style={{ fontSize: '2.1rem', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.5px' }}>
                Supported Technical Analysis Matrix
              </h2>
              <p style={{ color: '#94a3b8', marginBottom: '28px', lineHeight: '1.65', fontSize: '0.92rem' }}>
                StockAI parses millions of market data vectors dynamically to feed our deep learning regression models, checking against multiple key parameters:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Daily Close & Volume Trends',
                  'Relative Strength Index (RSI 14) thresholds',
                  'MACD signal lines & bullish crossover points',
                  'Bollinger Band limits (support/resistance)',
                  'Average True Range (ATR) volatility indexes',
                  'Historical ML projection vs actual output ratios'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={17} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: '500' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Model Integrity Statement Card */}
            <div style={{ 
              padding: '32px', 
              backgroundColor: 'rgba(15, 23, 42, 0.75)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)'
            }}>
              <h4 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '14px', color: '#fff' }}>Model Integrity Statement</h4>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.65', marginBottom: '20px' }}>
                Our systems calculate predictive vectors using mathematical statistical regressions. These values represent mathematical probabilities based on historical indices, and not financial advisory recommendations.
              </p>
              
              <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem' }}>
                  <span style={{ color: '#64748b' }}>Primary Forecasting Target:</span>
                  <span style={{ fontWeight: '700', color: '#f8fafc' }}>Tomorrow's Session High</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem' }}>
                  <span style={{ color: '#64748b' }}>Input Features:</span>
                  <span style={{ fontWeight: '700', color: '#f8fafc' }}>OHLCV + 14 Technical Overlays</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#64748b' }}>Backtest Validation Spec:</span>
                  <span style={{ fontWeight: '700', color: '#f8fafc' }}>10 Years NSE History</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', padding: '36px 6%', textAlign: 'center', fontSize: '0.82rem', color: '#64748b' }}>
        <p>© 2026 StockAI Platform. All rights reserved. Powered by Deep learning regressions.</p>
      </footer>

      {/* Simple Email & Password Auth Modal (No Google Auth) */}
      {showAuthModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuthModal(false);
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Cpu size={26} style={{ color: '#818cf8' }} />
                <span style={{ fontWeight: '800', fontSize: '1.3rem' }}>
                  Stock<span style={{ color: '#818cf8' }}>AI</span>
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                {authMode === 'login' ? 'Sign In to Terminal' : 'Create Free Account'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                Simple Email & Password authentication
              </p>
            </div>

            {authError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 14px', color: '#ef4444', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {authMode === 'register' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text"
                      required
                      placeholder="Arjun Trader"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      style={{ width: '100%', height: '42px', paddingLeft: '38px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                    />
                    <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    style={{ width: '100%', height: '42px', paddingLeft: '38px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                  />
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="password"
                    required
                    placeholder="Enter password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={{ width: '100%', height: '42px', paddingLeft: '38px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                  />
                  <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </div>

              <button 
                type="submit"
                disabled={authLoading}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '6px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                }}
              >
                {authLoading ? 'Authenticating...' : authMode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}
              </button>
            </form>

            {/* Quick 1-Click Instant Demo Access */}
            <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
              <button
                type="button"
                onClick={handleInstantDemo}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  color: '#818cf8',
                  borderRadius: '8px',
                  padding: '9px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Zap size={14} /> Instant Demo Access (1-Click)
              </button>
            </div>

            {/* Mode Switcher */}
            <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.82rem', color: '#94a3b8' }}>
              {authMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => handleOpenAuth('register')}
                    style={{ background: 'transparent', border: 'none', color: '#818cf8', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => handleOpenAuth('login')}
                    style={{ background: 'transparent', border: 'none', color: '#818cf8', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
