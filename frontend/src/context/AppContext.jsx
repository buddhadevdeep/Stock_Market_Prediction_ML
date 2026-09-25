import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { stockApi } from '../api/stockApi';
import { alertApi } from '../api/alertApi';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('stockai_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to Instant Demo user if not logged in
    return {
      id: 'demo-guest',
      name: 'Demo Explorer',
      email: 'guest@demo.stockai',
      isDemo: true
    };
  });

  // Auth Suggestion Modal State for Locked Demo Features
  const [showAuthPromptModal, setShowAuthPromptModal] = useState(false);
  const [authPromptFeature, setAuthPromptFeature] = useState('');

  const isDemoMode = Boolean(!user || user.isDemo);

  const openAuthPrompt = (featureName = '') => {
    setAuthPromptFeature(featureName);
    setShowAuthPromptModal(true);
  };

  const closeAuthPrompt = () => {
    setShowAuthPromptModal(false);
    setAuthPromptFeature('');
  };

  const enterDemoMode = () => {
    const demoUser = {
      id: 'demo-guest',
      name: 'Demo Explorer',
      email: 'guest@demo.stockai',
      isDemo: true
    };
    setUser(demoUser);
    localStorage.setItem('stockai_user', JSON.stringify(demoUser));
    addNotification('⚡ Switched to Instant Demo Access. Explore stocks and forecasts freely!', 'info');
  };

  const [currentSymbol, setCurrentSymbol] = useState('NIFTY 50');

  const [watchlist, setWatchlist] = useState(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'TATAPOWER']);
  const [alerts, setAlerts] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('stockai_theme') || 'dark';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Real-time yfinance feed active for NIFTY & NSE equities', type: 'info', read: false }
  ]);

  // Live Auto-Refresh State (1-2 Minute / 60-Second Real-Time Engine)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(60);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());
  const [marketIndicesLive, setMarketIndicesLive] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Throttle references to prevent rapid spam clicking
  const syncInProgressRef = React.useRef(false);
  const lastSyncClickRef = React.useRef(0);

  // Function to pull latest live market indices with single-flight protection
  const fetchLiveMarketData = useCallback(async (isForced = false) => {
    if (syncInProgressRef.current) {
      return; // Already in flight, ignore duplicate parallel invocation
    }

    syncInProgressRef.current = true;
    setIsSyncing(true);

    try {
      if (isForced) {
        stockApi.invalidateCache('market_indices');
        stockApi.invalidateCache('top_movers');
      }

      const liveIndices = await stockApi.getMarketIndices();
      if (Array.isArray(liveIndices) && liveIndices.length > 0) {
        setMarketIndicesLive(liveIndices);
      }
      setLastRefreshedAt(new Date());
    } catch (err) {
      console.warn('Auto-refresh live market fetch note:', err.message);
    } finally {
      setIsSyncing(false);
      syncInProgressRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        if (!isDemoMode) {
          const wl = await stockApi.getWatchlist();
          if (Array.isArray(wl) && wl.length > 0) {
            setWatchlist(wl.map((w) => w.symbol));
          }
          const al = await alertApi.getAlerts();
          if (Array.isArray(al)) {
            setAlerts(al);
          }
        }
        await fetchLiveMarketData();
      } catch (err) {
        console.error('Failed to load initial workspace state:', err);
      }
    };
    loadInitialState();
  }, [fetchLiveMarketData, isDemoMode]);

  // 60-Second Countdown & Auto-Refresh Timer
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          // Trigger live auto-refresh without dropping in-flight requests
          fetchLiveMarketData(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshEnabled, fetchLiveMarketData]);

  // Update HTML theme attribute and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stockai_theme', theme);
  }, [theme]);

  const handleLogin = async (email, password, rememberMe = true) => {
    const res = await authApi.login(email, password, rememberMe);
    if (res.success && res.user) {
      const authUser = { ...res.user, isDemo: false };
      setUser(authUser);
      localStorage.setItem('stockai_user', JSON.stringify(authUser));
      addNotification(`Welcome back, ${authUser.name}! Full access unlocked.`, 'success');
    }
    return res;
  };

  const handleLogout = () => {
    localStorage.removeItem('stockai_token');
    localStorage.removeItem('stockai_user');
    // Switch to clean demo guest user
    enterDemoMode();
    addNotification('Signed out to Instant Demo mode', 'info');
  };

  const handleRegister = async (name, email, password) => {
    const res = await authApi.register(name, email, password);
    if (res.success && res.user) {
      const authUser = { ...res.user, isDemo: false };
      setUser(authUser);
      localStorage.setItem('stockai_user', JSON.stringify(authUser));
      addNotification(`Account created! Welcome, ${authUser.name}! Full access unlocked.`, 'success');
    }
    return res;
  };

  const updateUserProfile = (profileUpdates) => {
    if (isDemoMode) {
      openAuthPrompt('Profile & Settings');
      return;
    }
    setUser((prev) => {
      const updated = {
        ...(prev || { name: 'Arjun Trader', email: 'arjun@stockai.com' }),
        ...profileUpdates,
        isDemo: false
      };
      localStorage.setItem('stockai_user', JSON.stringify(updated));
      return updated;
    });
    addNotification('Profile details updated successfully!', 'success');
  };

  const handleAddToWatchlist = async (symbol) => {
    if (isDemoMode) {
      setWatchlist((prev) => (prev.includes(symbol) ? prev : [...prev, symbol]));
      addNotification(`🔒 Added ${symbol} in Demo Mode (Temporary - Sign in to save permanently)`, 'info', symbol);
      return;
    }
    try {
      const res = await stockApi.addToWatchlist(symbol);
      if (res.success) {
        setWatchlist((prev) => (prev.includes(symbol) ? prev : [...prev, symbol]));
        addNotification(`${symbol} added to watchlist`, 'success');
      }
    } catch (e) {
      setWatchlist((prev) => (prev.includes(symbol) ? prev : [...prev, symbol]));
    }
  };

  const handleRemoveFromWatchlist = async (symbol) => {
    if (isDemoMode) {
      setWatchlist((prev) => prev.filter((s) => s !== symbol));
      addNotification(`${symbol} removed from temporary watchlist`, 'info');
      return;
    }
    try {
      const res = await stockApi.removeFromWatchlist(symbol);
      if (res.success) {
        setWatchlist((prev) => prev.filter((s) => s !== symbol));
        addNotification(`${symbol} removed from watchlist`, 'info');
      }
    } catch (e) {
      setWatchlist((prev) => prev.filter((s) => s !== symbol));
    }
  };

  const handleCreateAlert = async (symbol, condition) => {
    if (isDemoMode) {
      openAuthPrompt('Live Price Alerts');
      return;
    }
    const updated = await alertApi.createAlert(symbol, condition);
    setAlerts(updated);
    addNotification(`Alert created for ${symbol}: ${condition}`, 'success', symbol);
  };

  const handleToggleAlert = async (id) => {
    const updated = await alertApi.toggleAlertStatus(id);
    setAlerts(updated);
    addNotification('Alert status updated', 'info');
  };

  const handleDeleteAlert = async (id) => {
    const updated = await alertApi.deleteAlert(id);
    setAlerts(updated);
    addNotification('Alert removed', 'warning');
  };

  const addNotification = (message, type = 'info', symbol = null) => {
    setNotifications((prev) => [
      { 
        id: Date.now() + Math.random(), 
        message, 
        type, 
        symbol,
        read: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      ...prev,
    ]);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const triggerTestAlert = (symbol = 'TCS') => {
    addNotification(`🚨 Real-time Alert Triggered: ${symbol} price crossed target threshold! Supervised Model Signal: BUY`, 'alert', symbol);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('stockai_theme', next);
      return next;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const triggerManualRefresh = () => {
    const now = Date.now();
    // Enforce a minimum 1.5s interval between manual triggers to discard rapid spam clicks
    if (now - lastSyncClickRef.current < 1500 || syncInProgressRef.current) {
      return;
    }
    lastSyncClickRef.current = now;
    setRefreshCountdown(60);
    fetchLiveMarketData(true);
    addNotification('Market data synchronized with live exchange rates', 'info');
  };

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        updateUserProfile,
        currentSymbol,
        setCurrentSymbol,
        watchlist,
        addToWatchlist: handleAddToWatchlist,
        removeFromWatchlist: handleRemoveFromWatchlist,
        alerts,
        createAlert: handleCreateAlert,
        toggleAlert: handleToggleAlert,
        deleteAlert: handleDeleteAlert,
        triggerTestAlert,
        theme,
        toggleTheme,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        notifications,
        addNotification,
        dismissNotification,
        clearAllNotifications,
        markAllNotificationsAsRead,
        // Demo Mode & Auth Suggestion Controls
        isDemoMode,
        enterDemoMode,
        showAuthPromptModal,
        authPromptFeature,
        openAuthPrompt,
        closeAuthPrompt,
        // Real-Time 1-2 Minute Auto-Refresh Engine
        autoRefreshEnabled,
        toggleAutoRefresh,
        refreshCountdown,
        lastRefreshedAt,
        marketIndicesLive,
        isSyncing,
        triggerManualRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
