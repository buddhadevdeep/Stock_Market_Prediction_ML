import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  Eye,
  Menu,
  Activity,
  Lock
} from 'lucide-react';

export const MobileBottomNav = () => {
  const { toggleMobileSidebar, notifications, user, openAuthModal } = useApp();
  const location = useLocation();

  const unreadAlerts = notifications.filter((n) => !n.read).length;

  const navTabs = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, requiresAuth: false },
    { name: 'Predict', path: '/prediction', icon: TrendingUp, requiresAuth: false },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase, requiresAuth: true },
    { name: 'Watchlist', path: '/watchlist', icon: Eye, requiresAuth: false },
    { name: 'Bull/Bear', path: '/bullbear', icon: Activity, requiresAuth: false },
  ];

  const handleTabClick = (e, tab) => {
    if (tab.requiresAuth && !user) {
      e.preventDefault();
      openAuthModal({
        mode: 'login',
        featureName: tab.name,
        returnPath: tab.path
      });
    }
  };

  return (
    <nav className="mobile-app-dock" aria-label="Mobile Navigation">
      <div className="mobile-dock-container">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isLocked = tab.requiresAuth && !user;
          const isActive = location.pathname === tab.path && !isLocked;

          return (
            <NavLink
              key={tab.name}
              to={tab.path}
              onClick={(e) => handleTabClick(e, tab)}
              className={`mobile-dock-item ${isActive ? 'active' : ''}`}
            >
              <div className="dock-icon-box" style={{ position: 'relative' }}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {tab.name === 'Dashboard' && unreadAlerts > 0 && (
                  <span className="dock-badge-dot" />
                )}
                {isLocked && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-6px',
                      backgroundColor: 'var(--warning-amber)',
                      color: '#000',
                      borderRadius: '50%',
                      width: '12px',
                      height: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Lock size={7} strokeWidth={3} />
                  </span>
                )}
              </div>
              <span className="dock-label" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {tab.name}
              </span>
            </NavLink>
          );
        })}

        {/* Menu Drawer Opener */}
        <button
          type="button"
          className="mobile-dock-item menu-trigger"
          onClick={toggleMobileSidebar}
          aria-label="Open full menu"
        >
          <div className="dock-icon-box">
            <Menu size={20} strokeWidth={2} />
            {unreadAlerts > 0 && <span className="dock-badge-dot" />}
          </div>
          <span className="dock-label">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
