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
    user 
  } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeMobileSidebar();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Prediction', path: '/prediction', icon: TrendingUp },
    { name: 'Bull vs Bear', path: '/bullbear', icon: Activity },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Watchlist', path: '/watchlist', icon: Eye },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Compare', path: '/compare', icon: Columns },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
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
                })}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                  <span style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Profile & Logout */}
        {user && (
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
        )}
      </div>
    </>
  );
};

export default Sidebar;
