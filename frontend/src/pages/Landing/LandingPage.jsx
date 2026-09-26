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
  AlertCircle,
  Menu,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

const LandingPage = () => {
  const { login, register, user, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  // Mobile menu drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
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

  const handleInstantDemo = () => {
    setMobileMenuOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="landing-page-wrapper">
      
      {/* Background ambient glowing light orbs */}
      <div style={{ position: 'fixed', width: 'min(500px, 90vw)', height: 'min(500px, 90vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(0,0,0,0) 70%)', top: '-150px', left: '-100px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 'min(500px, 90vw)', height: 'min(500px, 90vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(0,0,0,0) 70%)', top: '30%', right: '-150px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header / Top Navigation */}
      <header className="landing-header">
        {/* Brand Logo */}
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
            boxShadow: '0 0 14px rgba(99, 102, 241, 0.45)',
            flexShrink: 0
          }}>
            <Cpu size={20} style={{ color: '#ffffff' }} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.3rem', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
            Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span>
          </span>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hide-on-mobile" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <a href="#hero" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', transition: 'color 0.2s' }}>Home</a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem', transition: 'color 0.2s' }}>Features</a>
          <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem', transition: 'color 0.2s' }}>How It Works</a>
          <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>About</Link>
        </nav>

        {/* Right Actions & Mobile Hamburger */}
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

          {/* Desktop Auth Buttons */}
          <div className="hide-on-mobile" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
                }}
              >
                Dashboard <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => handleOpenAuth('login')}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-primary)', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '0.85rem',
                    padding: '6px 12px'
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
                    padding: '8px 16px', 
                    fontSize: '0.84rem',
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

          {/* Mobile Instant Demo / Dashboard CTA */}
          <div className="hide-on-desktop" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Dashboard
              </button>
            ) : (
              <button 
                onClick={() => handleOpenAuth('login')}
                style={{ 
                  background: 'rgba(99, 102, 241, 0.15)', 
                  border: '1px solid rgba(99, 102, 241, 0.35)', 
                  color: 'var(--accent-purple)', 
                  cursor: 'pointer', 
                  fontWeight: '700', 
                  fontSize: '0.78rem',
                  padding: '6px 10px',
                  borderRadius: '6px'
                }}
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              style={{
                background: 'var(--bg-chip)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '7px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="landing-mobile-drawer">
          <a 
            href="#hero" 
            className="landing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Home</span>
            <ChevronRight size={16} color="#64748b" />
          </a>
          <a 
            href="#features" 
            className="landing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Features</span>
            <ChevronRight size={16} color="#64748b" />
          </a>
          <a 
            href="#how-it-works" 
            className="landing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>How It Works</span>
            <ChevronRight size={16} color="#64748b" />
          </a>
          <Link 
            to="/about" 
            className="landing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>About</span>
            <ChevronRight size={16} color="#64748b" />
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <button 
              onClick={() => handleOpenAuth('register')} 
              style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                color: '#fff', 
                border: 'none',
                borderRadius: '10px', 
                padding: '13px', 
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              Get Started Free
            </button>
            <button 
              onClick={handleInstantDemo} 
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                color: '#f8fafc', 
                border: '1px solid rgba(255, 255, 255, 0.12)', 
                borderRadius: '10px', 
                padding: '12px', 
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Zap size={16} color="#818cf8" /> 1-Click Instant Demo
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="landing-hero-section">
        <div className="landing-hero-grid">
          
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
              marginBottom: '20px' 
            }}>
              <span style={{ color: '#818cf8', fontSize: '0.85rem' }}>∿</span>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#c7d2fe', letterSpacing: '0.8px' }}>
                NEXT-GEN ML FORECASTING
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="landing-hero-title">
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
            
            <p className="landing-hero-desc">
              Predict tomorrow's stock prices using machine learning, technical indicators, market sentiment and intelligent analytics.
            </p>

            {/* CTAs */}
            <div className="landing-cta-group">
              <button 
                onClick={() => handleOpenAuth('register')} 
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                  color: '#fff', 
                  border: 'none',
                  borderRadius: '10px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '10px', 
                  padding: '13px 26px', 
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                  transition: 'transform 0.2s ease'
                }}
              >
                Get Started <ArrowRight size={17} />
              </button>
              
              <button 
                onClick={handleInstantDemo} 
                style={{ 
                  background: 'var(--bg-chip)', 
                  color: 'var(--text-primary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '10px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '10px', 
                  padding: '13px 22px', 
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Play size={15} fill="currentColor" /> View Demo
              </button>
            </div>

            {/* Quick Stats Panel */}
            <div className="landing-stats-row">
              <div>
                <h4 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--bullish-green)', fontFamily: 'var(--font-mono)' }}>98.92%</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: '500' }}>Historical Accuracy</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>6+</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: '500' }}>Key NSE Indexes</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>Ensemble</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: '500' }}>ML Models</p>
              </div>
            </div>
          </div>

          {/* Right Hero Live Interactive Preview Card */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div 
              style={{ 
                padding: '24px 20px', 
                position: 'relative', 
                zIndex: 2, 
                backgroundColor: 'var(--card-bg)', 
                borderRadius: '18px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--card-shadow)',
                backdropFilter: 'blur(16px)'
              }}
            >
              {/* Bull vs Bear Top Split Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                
                {/* Bullish State */}
                <div style={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                  border: '1px solid rgba(16, 185, 129, 0.3)', 
                  borderRadius: '12px', 
                  padding: '14px 10px', 
                  textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '3px' }}>🐂</div>
                  <div style={{ fontWeight: '800', color: 'var(--bullish-green)', fontSize: '0.82rem', letterSpacing: '0.5px' }}>
                    BULLISH STATE
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Confidence 83%
                  </div>
                </div>

                {/* Bearish Range */}
                <div style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', 
                  borderRadius: '12px', 
                  padding: '14px 10px', 
                  textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '3px' }}>🐻</div>
                  <div style={{ fontWeight: '800', color: 'var(--bearish-red)', fontSize: '0.82rem', letterSpacing: '0.5px' }}>
                    BEARISH RANGE
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Resistance High
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.5px' }}>TCS / NSE</span>
                    <h3 style={{ fontSize: '1.45rem', fontWeight: '900', fontFamily: 'var(--font-mono)', marginTop: '2px', color: 'var(--text-primary)' }}>
                      ₹3,682.45
                    </h3>
                  </div>
                  <span style={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                    color: 'var(--bullish-green)', 
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI Tomorrow Forecast:</span>
                <span style={{ color: 'var(--bullish-green)', fontWeight: '800', fontSize: '0.92rem', fontFamily: 'var(--font-mono)' }}>
                  ₹3,745.80 (Buy Signal)
                </span>
              </div>
            </div>

            {/* Glowing Backdrop behind card */}
            <div style={{ position: 'absolute', width: 'min(280px, 80%)', height: 'min(280px, 80%)', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.22)', filter: 'blur(80px)', top: '10%', right: '10%', zIndex: 1, pointerEvents: 'none' }} />
          </div>

        </div>
      </section>

      {/* Feature Cards Grid: Engineered for Intelligent Investors */}
      <section id="features" style={{ padding: '60px 6%', backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '44px', paddingTop: '10px' }}>
            <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: '900', marginBottom: '12px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
              Engineered for Intelligent Investors
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', fontSize: '0.94rem', lineHeight: '1.6' }}>
              Sophisticated metrics, AI analysis, and prediction tools merged into a seamless dashboard.
            </p>
          </div>

          <div className="landing-features-grid">
            
            <div className="landing-feature-card" style={{ padding: '24px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '14px', border: '1px solid var(--border-color)', backdropFilter: 'blur(16px)', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Cpu size={22} style={{ color: 'var(--accent-purple)' }} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>AI Predictions</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Tomorrow's High/Low calculations modeled with LSTM and XGBoost regressors based on OHLCV features.
              </p>
            </div>

            <div className="landing-feature-card" style={{ padding: '24px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '14px', border: '1px solid var(--border-color)', backdropFilter: 'blur(16px)', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Activity size={22} style={{ color: 'var(--accent-cyan)' }} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>Real-Time Market Data</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Live streaming quotes for blue-chip companies, custom sparklines, and instant stock indicators.
              </p>
            </div>

            <div className="landing-feature-card" style={{ padding: '24px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '14px', border: '1px solid var(--border-color)', backdropFilter: 'blur(16px)', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <BarChart2 size={22} style={{ color: 'var(--bullish-green)' }} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>Technical Analysis</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                On-demand overlays for SMA, EMA, MACD, RSI 14, ATR, and Bollinger bands mapped to candlestick points.
              </p>
            </div>

            <div className="landing-feature-card" style={{ padding: '24px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '14px', border: '1px solid var(--border-color)', backdropFilter: 'blur(16px)', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Layers size={22} style={{ color: 'var(--warning-yellow)' }} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>Smart Insights</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Explainable AI predictions summarizing indicator state thresholds and historical trends.
              </p>
            </div>

            <div className="landing-feature-card" style={{ padding: '24px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '14px', border: '1px solid var(--border-color)', backdropFilter: 'blur(16px)', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={22} style={{ color: 'var(--accent-purple)' }} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>Risk Management</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Real-time beta tracking, volatility indexes, and risk probability estimates for open positions.
              </p>
            </div>

            <div className="landing-feature-card" style={{ padding: '24px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '14px', border: '1px solid var(--border-color)', backdropFilter: 'blur(16px)', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <TrendingUp size={22} style={{ color: 'var(--accent-cyan)' }} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>Portfolio Tracking</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Holdings records consolidated with allocation charts and dynamic health index assessments.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Workflow Section */}
      <section id="how-it-works" style={{ padding: '60px 6%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          
          <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: '900', marginBottom: '36px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            How StockAI Works
          </h2>

          {/* Desktop Workflow Pipeline */}
          <div className="hide-on-mobile landing-workflow-container">
            {[
              { num: '1', label: 'Market Data', sub: 'OHLCV Feed' },
              { num: '2', label: 'Feature Engineering', sub: 'Technical Overlays' },
              { num: '3', label: 'Machine Learning', sub: 'Ensemble Models' },
              { num: '4', label: 'AI Explanations', sub: 'Signal Reasoning' },
              { num: '5', label: 'Trading Signals', sub: 'Buy / Hold / Sell' }
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div style={{ minWidth: '130px' }}>
                  <div style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent-purple)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 12px auto',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    color: '#ffffff',
                    boxShadow: '0 0 14px rgba(99, 102, 241, 0.5)'
                  }}>
                    {step.num}
                  </div>
                  <h5 style={{ fontSize: '0.92rem', fontWeight: '800', marginBottom: '4px', color: 'var(--text-primary)' }}>{step.label}</h5>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{step.sub}</p>
                </div>
                {idx < arr.length - 1 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile / iPhone Workflow Vertical Timeline */}
          <div className="hide-on-desktop" style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            {[
              { num: '1', label: 'Market Data', sub: 'Live NSE & Global OHLCV Historical Feed' },
              { num: '2', label: 'Feature Engineering', sub: '14+ Technical Overlays & Price Momentum' },
              { num: '3', label: 'Machine Learning', sub: 'LSTM, XGBoost & Random Forest Models' },
              { num: '4', label: 'AI Explanations', sub: 'Confidence Ratings & Signal Reasoning' },
              { num: '5', label: 'Trading Signals', sub: 'Tomorrow Forecast & Target Targets' }
            ].map((step, idx) => (
              <div key={idx} className="landing-workflow-step-mobile">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {step.num}
                </div>
                <div>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>{step.label}</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{step.sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Supported Analysis Section & Model Integrity Statement */}
      <section style={{ padding: '60px 6% 70px 6%', backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div className="landing-matrix-grid">
            
            <div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)', fontWeight: '900', marginBottom: '14px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                Supported Technical Analysis Matrix
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6', fontSize: '0.9rem' }}>
                StockAI parses millions of market data vectors dynamically to feed our deep learning regression models, checking against multiple key parameters:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Daily Close & Volume Trends',
                  'Relative Strength Index (RSI 14) thresholds',
                  'MACD signal lines & bullish crossover points',
                  'Bollinger Band limits (support/resistance)',
                  'Average True Range (ATR) volatility indexes',
                  'Historical ML projection vs actual output ratios'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={16} style={{ color: 'var(--bullish-green)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '500' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Model Integrity Statement Card */}
            <div style={{ 
              padding: '24px 20px', 
              backgroundColor: 'var(--card-bg)', 
              borderRadius: '16px', 
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--card-shadow)',
              backdropFilter: 'blur(12px)'
            }}>
              <h4 style={{ fontWeight: '800', fontSize: '1.05rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Model Integrity Statement</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '18px' }}>
                Our systems calculate predictive vectors using mathematical statistical regressions. These values represent mathematical probabilities based on historical indices, and not financial advisory recommendations.
              </p>
              
              <div style={{ backgroundColor: 'var(--bg-chip)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Tomorrow's Session High</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Input Features:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>OHLCV + 14 Indicators</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Validation Spec:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>10 Years NSE History</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '30px 6%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>© 2026 StockAI Platform. All rights reserved. Powered by Deep learning regressions.</p>
      </footer>

      {/* Simple Email & Password Auth Modal */}
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
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuthModal(false);
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '28px 24px',
              boxShadow: 'var(--card-shadow)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Cpu size={24} style={{ color: 'var(--accent-purple)' }} />
                <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span>
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {authMode === 'login' ? 'Sign In to Terminal' : 'Create Free Account'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Simple Email & Password authentication
              </p>
            </div>

            {authError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 12px', color: 'var(--bearish-red)', fontSize: '0.8rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {authMode === 'register' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text"
                      required
                      placeholder="Arjun Trader"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      style={{ width: '100%', height: '40px', paddingLeft: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none' }}
                    />
                    <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    style={{ width: '100%', height: '40px', paddingLeft: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none' }}
                  />
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="password"
                    required
                    placeholder="Enter password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={{ width: '100%', height: '40px', paddingLeft: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.88rem', outline: 'none' }}
                  />
                  <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
                  padding: '11px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '4px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                }}
              >
                {authLoading ? 'Authenticating...' : authMode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}
              </button>
            </form>

            {/* Quick 1-Click Instant Demo Access */}
            <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={handleInstantDemo}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  color: 'var(--accent-purple)',
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
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {authMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => handleOpenAuth('register')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-purple)', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => handleOpenAuth('login')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-purple)', fontWeight: '700', cursor: 'pointer' }}
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
