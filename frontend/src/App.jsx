import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import TopNavbar from './components/layout/TopNavbar';
import MobileBottomNav from './components/layout/MobileBottomNav';
import { DisclaimerBanner } from './components/DisclaimerBanner';

// Public Landing & Marketing Pages
import LandingPage from './pages/Landing/LandingPage';
import FeaturesPage from './pages/Landing/FeaturesPage';
import HowItWorks from './pages/Landing/HowItWorks';
import About from './pages/Landing/About';

// Simple Email & Password Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// StockAI Suite Application Pages
import Dashboard from './pages/Dashboard/Dashboard';
import StockPrediction from './pages/Prediction/StockPrediction';
import BullBearAnalysis from './pages/BullBear/BullBearAnalysis';
import PortfolioPage from './pages/Portfolio/PortfolioPage';
import WatchlistPage from './pages/Watchlist/WatchlistPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import ComparePage from './pages/Compare/ComparePage';
import AlertsPage from './pages/Alerts/AlertsPage';
import SettingsPage from './pages/Settings/SettingsPage';

// Academic SOP Pages
import { ModelEvaluation } from './pages/ModelEvaluation';
import { Training } from './pages/Training';

const AppLayout = ({ children }) => {
  const { isSidebarCollapsed } = useApp();

  return (
    <div className={`app-layout-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <Sidebar />
      <div className="app-main-content">
        <TopNavbar />
        <DisclaimerBanner />
        <main className="app-page-body">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Marketing Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />

          {/* Simple Email & Password Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* StockAI Terminal Workspace Pages */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/prediction" element={<AppLayout><StockPrediction /></AppLayout>} />
          <Route path="/bullbear" element={<AppLayout><BullBearAnalysis /></AppLayout>} />
          <Route path="/portfolio" element={<AppLayout><PortfolioPage /></AppLayout>} />
          <Route path="/watchlist" element={<AppLayout><WatchlistPage /></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><AnalyticsPage /></AppLayout>} />
          <Route path="/compare" element={<AppLayout><ComparePage /></AppLayout>} />
          <Route path="/alerts" element={<AppLayout><AlertsPage /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
          
          {/* Academic Model SOP Routes */}
          <Route path="/evaluation" element={<AppLayout><ModelEvaluation /></AppLayout>} />
          <Route path="/training" element={<AppLayout><Training /></AppLayout>} />

          {/* Fallback to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
