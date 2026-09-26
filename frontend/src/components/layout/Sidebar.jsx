import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  Briefcase,
  Eye,
  BarChart2,
  Columns,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cpu,
  X,
  Lock,
  Zap
} from 'lucide-react';

import UserAvatar from '../common/UserAvatar';

const Sidebar = () => {
  const { 
    isSidebarCollapsed, 
    toggleSidebar, 
    isMobileSidebarOpen, 
    closeMobileSidebar, 
    logout, 
    user,
    openAuthModal
  } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeMobileSidebar();
    navigate('/');
  };

  // Protected routes require authentication in Demo Mode
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, requiresAuth: false },
    { name: 'Prediction', path: '/prediction', icon: TrendingUp, requiresAuth: false },
    { name: 'Bull vs Bear', path: '/bullbear', icon: Activity, requiresAuth: false },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase, requiresAuth: true },
    { name: 'Watchlist', path: '/watchlist', icon: Eye, requiresAuth: false },
    { name: 'Analytics', path: '/analytics', icon: BarChart2, requiresAuth: false },
    { name: 'Compare', path: '/compare', icon: Columns, requiresAuth: false },
    { name: 'Alerts', path: '/alerts', icon: Bell, requiresAuth: true },
    { name: 'Settings', path: '/settings', icon: Settings, requiresAuth: true },
  ];

  const handleItemClick = (e, item) => {
    closeMobileSidebar();
    if (item.requiresAuth && !user) {
      e.preventDefault();
      openAuthModal({
        mode: 'login',
        featureName: `${item.name} Console`,
        returnPath: item.path
      });
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="mobile-sidebar-backdrop" 
          onClick={closeMobileSidebar}
          aria-label="Close menu backdrop"
        />
      )}

      <div 
        className={`sidebar-wrapper ${isMobileSidebarOpen ? 'mobile-open' : ''}`}
        style={{
          width: isSidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 160,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1), transform 0.28s ease',
          boxShadow: isMobileSidebarOpen ? '0 10px 40px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        {/* Brand Header */}
        <div 
          style={{
            height: 'var(--navbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            padding: isSidebarCollapsed ? '0' : '0 20px',
            borderBottom: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}
        >
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <div 
              onClick={() => { closeMobileSidebar(); navigate('/dashboard'); }} 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <Cpu size={24} style={{ color: 'var(--accent-purple)' }} />
              <span style={{ fontWeight: '800', fontSize: '1.25rem', letterSpacing: '0.5px', color: 'var(--text-primary)' }}>
                Stock<span style={{ color: 'var(--accent-purple)' }}>AI</span>
              </span>
            </div>
          )}
          {isSidebarCollapsed && !isMobileSidebarOpen && (
            <Cpu size={24} style={{ color: 'var(--accent-purple)' }} />
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Desktop collapse toggle */}
            <button 
              onClick={toggleSidebar}
              className="hide-on-mobile"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Mobile close X button */}
            {isMobileSidebarOpen && (
              <button
                onClick={closeMobileSidebar}
                aria-label="Close sidebar"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '16px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isLocked = item.requiresAuth && !user;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={(e) => handleItemClick(e, item)}
                className={({ isActive }) => `sidebar-link ${isActive && !isLocked ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  color: (isActive && !isLocked)
                    ? 'var(--accent-purple)' 
                    : isLocked 
                      ? 'var(--text-secondary)' 
                      : 'var(--text-secondary)',
                  backgroundColor: (isActive && !isLocked) ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: (isActive && !isLocked) ? '700' : '500',
                  transition: 'all 0.2s ease',
                  justifyContent: (isSidebarCollapsed && !isMobileSidebarOpen) ? 'center' : 'flex-start',
                  borderLeft: (isActive && !isLocked) ? '3px solid var(--accent-purple)' : '3px solid transparent',
                  position: 'relative',
                  opacity: isLocked ? 0.9 : 1
                })}
              >
                <Icon size={19} style={{ flexShrink: 0 }} />
                
                {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{item.name}</span>
                    {isLocked && (
                      <span 
                        title="Sign in required to access this feature"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          backgroundColor: 'rgba(245, 158, 11, 0.12)',
                          color: 'var(--warning-amber)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '800'
                        }}
                      >
                        <Lock size={10} />
                      </span>
                    )}
                  </div>
                )}

                {isSidebarCollapsed && !isMobileSidebarOpen && isLocked && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '6px', 
                      right: '6px', 
                      width: '7px', 
                      height: '7px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--warning-amber)' 
                    }} 
                  />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer: User Profile OR Instant Demo Mode Card */}
        {user ? (
          <div 
            style={{
              padding: '16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserAvatar user={user} size={36} />
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--bullish-green)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--bullish-green)' }}></span>
                    Premium
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: (isSidebarCollapsed && !isMobileSidebarOpen) ? 'center' : 'flex-start',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: 'var(--bearish-red)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.88rem',
                transition: 'background 0.2s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={18} style={{ flexShrink: 0 }} />
              {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>Logout</span>}
            </button>
          </div>
        ) : (
          /* Instant Demo Mode Sidebar Card */
          <div
            style={{
              padding: isSidebarCollapsed && !isMobileSidebarOpen ? '12px 6px' : '14px',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-chip)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {(!isSidebarCollapsed || isMobileSidebarOpen) ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={13} style={{ color: 'var(--warning-amber)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--warning-amber)', letterSpacing: '0.5px' }}>
                      INSTANT DEMO
                    </span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--warning-amber)', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                    🔒 Locked
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.3' }}>
                  Guest preview active. Sign in to unlock ML models &amp; cloud sync.
                </p>
                <button
                  onClick={() => openAuthModal({ mode: 'login' })}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)'
                  }}
                >
                  <Lock size={12} /> Sign In / Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => openAuthModal({ mode: 'login' })}
                title="Instant Demo Mode • Click to Sign In"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--warning-amber)',
                  borderRadius: '8px',
                  padding: '10px 0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                <Lock size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
