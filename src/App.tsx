import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Suppliers } from './pages/Suppliers';
import { Emissions } from './pages/Emissions';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { AIAdvisorPage } from './pages/AIAdvisorPage';
import { ProfileSettings } from './pages/ProfileSettings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { LoadingSpinner } from './components/common/LoadingSpinner';

/**
 * Protected route wrapper - redirects unauthenticated users to /login
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner label="Initializing EcoChain AI Platform..." size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Public auth route - redirects logged-in users to dashboard
 */
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner label="Loading..." size="lg" />
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

        {/* Protected Application Routes (wrapped in AppLayout sidebar) */}
        <Route
          element={
            <ProtectedRoute>
              <DataProvider>
                <AppLayout />
              </DataProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/emissions" element={<Emissions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/ai-insights" element={<AIAdvisorPage />} />
          <Route path="/settings" element={<ProfileSettings />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 4000,
            className: '',
            style: {
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '14px',
              padding: '12px 16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
            },
            success: {
              style: {
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0'
              },
              iconTheme: { primary: '#22c55e', secondary: '#ffffff' }
            },
            error: {
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca'
              },
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' }
            }
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
