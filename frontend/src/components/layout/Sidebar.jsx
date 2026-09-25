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
  X
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
    isDemoMode,
    openAuthPrompt 
  } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeMobileSidebar();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, lockedInDemo: false },
    { name: 'Prediction', path: '/prediction', icon: TrendingUp, lockedInDemo: false },
    { name: 'Bull vs Bear', path: '/bullbear', icon: Activity, lockedInDemo: false },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase, lockedInDemo: true },
    { name: 'Watchlist', path: '/watchlist', icon: Eye, lockedInDemo: false },
    { name: 'Analytics', path: '/analytics', icon: BarChart2, lockedInDemo: false },
    { name: 'Compare', path: '/compare', icon: Columns, lockedInDemo: true },
    { name: 'Alerts', path: '/alerts', icon: Bell, lockedInDemo: true },
    { name: 'Settings', path: '/settings', icon: Settings, lockedInDemo: true },
  ];

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
            const isLocked = isDemoMode && item.lockedInDemo;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  color: isActive ? 'var(--accent-purple)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? '700' : '500',
                  transition: 'all 0.2s ease',
                  justifyContent: (isSidebarCollapsed && !isMobileSidebarOpen) ? 'center' : 'flex-start',
                  borderLeft: isActive ? '3px solid var(--accent-purple)' : '3px solid transparent',
                  position: 'relative'
                })}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                  <span style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{item.name}</span>
                )}
                {isLocked && (!isSidebarCollapsed || isMobileSidebarOpen) && (
                  <span 
                    title="Sign in to unlock full features & save data"
                    style={{
                      marginLeft: 'auto',
                      fontSize: '0.7rem',
                      color: 'var(--warning-amber)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      background: 'rgba(245, 158, 11, 0.12)',
                      padding: '2px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    🔒 Lock
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Profile / Demo Mode Status */}
        <div 
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          {isDemoMode ? (
            <>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-purple)',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    flexShrink: 0
                  }}>
                    ⚡
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)' }}>Instant Demo</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Guest mode active</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => openAuthPrompt('Full Account Access')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  width: '100%'
                }}
              >
                {(!isSidebarCollapsed || isMobileSidebarOpen) ? 'Sign In / Register' : '🔑'}
              </button>
            </>
          ) : (
            <>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <UserAvatar user={user} size={34} />
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--bullish-green)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--bullish-green)' }}></span>
                      Full Access
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
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--bearish-red)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  width: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={16} style={{ flexShrink: 0 }} />
                {(!isSidebarCollapsed || isMobileSidebarOpen) && <span>Logout</span>}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
