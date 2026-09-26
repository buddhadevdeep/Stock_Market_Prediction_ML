import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { stockApi, STOCK_CATALOG } from '../../api/stockApi';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  Sun, 
  Moon, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  TrendingUp, 
  Sparkles, 
  X, 
  ArrowRight,
  Flame,
  Clock,
  Activity,
  RefreshCw,
  Menu,
  SearchX
} from 'lucide-react';

const QUICK_TRENDING = ['HAL', 'TATAPOWER', 'RELIANCE', 'TCS', 'SBIN', 'ZOMATO', 'IREDA', 'AAPL'];

export const TopNavbar = () => {
  const navigate = useNavigate();
  const { 
    currentSymbol, 
    setCurrentSymbol, 
    notifications, 
    markAllNotificationsAsRead, 
    dismissNotification,
    clearAllNotifications,
    theme, 
    toggleTheme,
    toggleMobileSidebar,
    user,
    openAuthModal,
    autoRefreshEnabled,
    toggleAutoRefresh,
    refreshCountdown,
    isSyncing,
    triggerManualRefresh,
    marketIndicesLive
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState('ALL'); // ALL, NSE, GLOBAL
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const notificationsRef = useRef(null);

  // Global hotkey: "/" or "Ctrl+K" to focus search bar
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSuggestions(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions on query change or category filter
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        let results = await stockApi.searchStocks(searchQuery);
        if (filterCategory === 'NSE') {
          results = results.filter(r => r.exchange === 'NSE');
        } else if (filterCategory === 'GLOBAL') {
          results = results.filter(r => r.exchange === 'NASDAQ' || r.exchange === 'NYSE');
        }
        setSuggestions(results);
        setSelectedIndex(0);
      } catch (err) {
        console.error(err);
      }
    };
    const delayDebounce = setTimeout(fetchSuggestions, 120);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, filterCategory]);

  const handleSelectStock = (symbol) => {
    if (!symbol) return;
    const cleanSym = symbol.toUpperCase().trim();
    setCurrentSymbol(cleanSym);
    setSearchQuery('');
    setShowSuggestions(false);
    navigate('/prediction');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, suggestions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + suggestions.length) % Math.max(1, suggestions.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && suggestions[selectedIndex]) {
        handleSelectStock(suggestions[selectedIndex].symbol);
      } else if (searchQuery.trim()) {
        handleSelectStock(searchQuery.trim());
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} className="text-bearish" />;
      case 'success': return <CheckCircle size={16} className="text-bullish" />;
      default: return <Info size={16} style={{ color: 'var(--accent-cyan)' }} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Extract NIFTY 50 and SENSEX from live indices state or defaults
  const nifty = marketIndicesLive.find(idx => idx.name.includes('NIFTY 50') || idx.symbol === '^NSEI') || {
    name: 'NIFTY 50',
    value: 24541.15,
    pctChange: 0.58
  };

  const sensex = marketIndicesLive.find(idx => idx.name.includes('SENSEX') || idx.symbol === '^BSESN') || {
    name: 'SENSEX',
    value: 80604.65,
    pctChange: 0.52
  };

  return (
    <div className="top-navbar-container">
      {/* Left Area: Mobile Hamburger + Omnisearch Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '420px', minWidth: 0 }}>
        
        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileSidebar}
          aria-label="Open Navigation Menu"
          style={{
            background: 'var(--bg-chip)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '7px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          className="hide-on-desktop"
        >
          <Menu size={20} />
        </button>

        {/* Omnisearch Bar */}
        <div ref={searchRef} style={{ position: 'relative', width: '100%', minWidth: 0 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search 
              size={15} 
              style={{
                position: 'absolute',
                left: '12px',
                color: showSuggestions ? 'var(--accent-purple)' : 'var(--text-muted)',
                pointerEvents: 'none',
                transition: 'color 0.2s ease'
              }}
            />
            <input 
              ref={inputRef}
              type="text"
              placeholder="Search stock..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-input)',
                border: showSuggestions ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '8px 56px 8px 34px',
                fontSize: '0.84rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-sans)',
                boxShadow: showSuggestions ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none'
              }}
            />
            
            {/* Right Action within search input */}
            <div style={{ position: 'absolute', right: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    inputRef.current?.focus();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={14} />
                </button>
              ) : (
                <span 
                  style={{ 
                    fontSize: '0.68rem', 
                    color: 'var(--text-muted)', 
                    background: 'var(--bg-chip)', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  /
                </span>
              )}
            </div>
          </div>

          {/* Broker Interactive Auto-complete Modal / Dropdown */}
          {showSuggestions && (
            <div 
              style={{
                position: 'absolute',
                top: '44px',
                left: 0,
                width: 'min(400px, calc(100vw - 20px))',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-dropdown)',
                maxHeight: 'min(380px, 65vh)',
                overflowY: 'auto',
                zIndex: 1100,
                backdropFilter: 'blur(16px)',
                padding: '6px 0'
              }}
            >
              {/* Filter Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px 8px', borderBottom: '1px solid var(--border-color)' }}>
                {['ALL', 'NSE', 'GLOBAL'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    style={{
                      background: filterCategory === cat ? 'var(--accent-purple)' : 'transparent',
                      color: filterCategory === cat ? '#fff' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  ↑↓ Enter
                </span>
              </div>

              {/* Quick Trending Chips if no text typed */}
              {!searchQuery && (
                <div style={{ padding: '8px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '6px' }}>
                    <Flame size={12} style={{ color: 'var(--warning-amber)' }} />
                    TRENDING STOCKS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {QUICK_TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleSelectStock(t)}
                        style={{
                          background: 'var(--bg-chip)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Results List */}
              <div>
                {suggestions.map((stock, idx) => {
                  const isSelected = idx === selectedIndex;
                  const isNse = stock.exchange === 'NSE';
                  return (
                    <div 
                      key={stock.symbol}
                      onClick={() => handleSelectStock(stock.symbol)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      style={{
                        padding: '8px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                        borderLeft: isSelected ? '3px solid var(--accent-purple)' : '3px solid transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span 
                          style={{ 
                            fontWeight: '800', 
                            color: 'var(--text-primary)', 
                            fontSize: '0.86rem', 
                            fontFamily: 'var(--font-mono)',
                            minWidth: '70px'
                          }}
                        >
                          {stock.symbol}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                            {stock.name}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {stock.sector || 'Equities'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span 
                          style={{ 
                            fontSize: '0.68rem', 
                            background: isNse ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)', 
                            color: isNse ? 'var(--bullish-green)' : 'var(--accent-cyan)', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            fontWeight: '700' 
                          }}
                        >
                          {stock.exchange || 'NSE'}
                        </span>
                        {isSelected && (
                          <ArrowRight size={14} style={{ color: 'var(--accent-purple)' }} />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* No matching stocks state */}
                {searchQuery.trim() && suggestions.length === 0 && (
                  <div style={{ padding: '18px 14px', textAlign: 'center' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px auto',
                      color: 'var(--bearish-red)'
                    }}>
                      <SearchX size={20} />
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      Stock Not Found: "{searchQuery}"
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
                      Ticker is unlisted or unavailable. Try these active tickers:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                      {QUICK_TRENDING.slice(0, 6).map((t) => (
                        <button
                          key={t}
                          onClick={() => handleSelectStock(t)}
                          style={{
                            background: 'var(--bg-chip)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            color: 'var(--accent-purple)',
                            cursor: 'pointer',
                            fontWeight: '700'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle Live Indices Ticker with Real-time Quotes (Desktop & Tablet) */}
      <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* NIFTY 50 Live Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-chip)', padding: '5px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <span className="badge-live-pulse" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>NIFTY 50</span>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
            ₹{Number(nifty.value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={nifty.pctChange >= 0 ? 'text-bullish' : 'text-bearish'} style={{ fontSize: '0.74rem', fontWeight: '700' }}>
            {nifty.pctChange >= 0 ? '+' : ''}{Number(nifty.pctChange).toFixed(2)}%
          </span>
        </div>

        {/* SENSEX Live Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-chip)', padding: '5px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--text-muted)' }}>SENSEX</span>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
            ₹{Number(sensex.value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={sensex.pctChange >= 0 ? 'text-bullish' : 'text-bearish'} style={{ fontSize: '0.74rem', fontWeight: '700' }}>
            {sensex.pctChange >= 0 ? '+' : ''}{Number(sensex.pctChange).toFixed(2)}%
          </span>
        </div>

      </div>

      {/* Right: Auto-Refresh + Focus Tag + Theme Toggle + Notification Bell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        
        {/* Auto-Refresh Live Button */}
        <button
          onClick={triggerManualRefresh}
          title="Click to sync live market data immediately"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: isSyncing ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.1)',
            border: isSyncing ? '1px solid var(--accent-purple)' : '1px solid rgba(16, 185, 129, 0.3)',
            padding: '5px 8px',
            borderRadius: '16px',
            color: isSyncing ? 'var(--accent-purple)' : 'var(--bullish-green)',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <RefreshCw size={12} className={isSyncing ? 'spin-anim' : ''} />
          <span className="hide-on-mobile">{isSyncing ? 'SYNCING...' : `AUTO-SYNC (${refreshCountdown}s)`}</span>
          <span className="hide-on-desktop">{refreshCountdown}s</span>
        </button>

        {/* Active Radar Stock Tag (Desktop) */}
        <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.12)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Focus:</span>
          <span style={{ fontWeight: '800', color: 'var(--accent-purple)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            {currentSymbol === '^NSEI' ? 'NIFTY 50' : currentSymbol === '^BSESN' ? 'SENSEX' : currentSymbol}
          </span>
        </div>

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
            width: '32px',
            height: '32px',
            flexShrink: 0
          }}
        >
          {theme === 'dark' ? <Sun size={15} style={{ color: '#fbbf24' }} /> : <Moon size={15} style={{ color: '#6366f1' }} />}
        </button>

        {/* Notification Bell */}
        <div ref={notificationsRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications & Alerts"
            style={{
              background: 'var(--bg-chip)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              flexShrink: 0
            }}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '13px',
                  height: '13px',
                  backgroundColor: 'var(--bearish-red)',
                  borderRadius: '50%',
                  fontSize: '0.6rem',
                  fontWeight: '800',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div 
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: 'min(340px, calc(100vw - 20px))',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-dropdown)',
                zIndex: 1100,
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>Terminal Alerts</span>
                  {unreadCount > 0 && (
                    <span style={{ fontSize: '0.68rem', backgroundColor: 'var(--accent-purple)', color: '#fff', padding: '1px 6px', borderRadius: '10px', fontWeight: '700' }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-purple)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Mark read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearAllNotifications}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No recent notifications or alerts.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      style={{ 
                        padding: '12px 14px', 
                        borderBottom: '1px solid var(--border-color)', 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'flex-start',
                        backgroundColor: n.read ? 'transparent' : 'rgba(99, 102, 241, 0.06)',
                        cursor: n.symbol ? 'pointer' : 'default',
                        transition: 'background 0.15s ease'
                      }}
                      onClick={() => {
                        if (n.symbol) {
                          setCurrentSymbol(n.symbol);
                          setShowNotifications(false);
                          navigate('/prediction');
                        }
                      }}
                    >
                      <div style={{ marginTop: '2px' }}>
                        {n.type === 'alert' ? <AlertTriangle size={16} style={{ color: 'var(--warning-yellow)' }} /> : getNotificationIcon(n.type)}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '0.8rem', color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: n.read ? '400' : '600', lineHeight: '1.4' }}>
                          {n.message}
                        </span>
                        {n.time && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.time}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(n.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px',
                          borderRadius: '4px'
                        }}
                        title="Dismiss"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Trader Pro Badge OR Instant Demo Mode Badge (Desktop only) */}
        {user ? (
          <div 
            className="hide-on-mobile"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))',
              border: '1px solid rgba(129, 140, 248, 0.4)',
              padding: '4px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--accent-purple)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--accent-purple)', letterSpacing: '0.5px' }}>
              TERMINAL PRO
            </span>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal({ mode: 'login' })}
            className="hide-on-mobile"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(99, 102, 241, 0.2))',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '5px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              color: 'var(--warning-amber)',
              fontWeight: '800',
              fontSize: '0.72rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span>⚡ DEMO MODE</span>
            <span style={{ color: 'var(--accent-purple)', fontSize: '0.68rem' }}>• SIGN IN 🔒</span>
          </button>
        )}

      </div>
    </div>
  );
};

export default TopNavbar;
