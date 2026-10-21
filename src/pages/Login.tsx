import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login, loginDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    navigate('/');
  };

  return (
    <div className="auth-page-wrapper">
      {/* Animated background mesh */}
      <div className="auth-bg-mesh" />
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />
      <div className="auth-bg-orb auth-bg-orb-3" />

      {/* Floating particles */}
      <div className="auth-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`auth-particle auth-particle-${i + 1}`} />
        ))}
      </div>

      {/* Top Navbar */}
      <header className="auth-header">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Leaf className="auth-logo-leaf" />
          </div>
          <div>
            <h1 className="auth-logo-title">EcoChain <span className="auth-logo-accent">AI</span></h1>
            <p className="auth-logo-subtitle">Scope 3 Emissions Platform</p>
          </div>
        </div>
        <div className="auth-header-badge">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>GHG Protocol Compliant</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        {/* Left Panel - Branding */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-icon-wrap">
              <Leaf className="auth-brand-icon" />
            </div>
            <h2 className="auth-brand-title">Track. Reduce.<br />Comply.</h2>
            <p className="auth-brand-desc">
              The enterprise platform for real-time supply chain carbon accounting and Scope 3 emissions management.
            </p>
            <div className="auth-stats-grid">
              <div className="auth-stat-card">
                <span className="auth-stat-number">2,400+</span>
                <span className="auth-stat-label">Suppliers Tracked</span>
              </div>
              <div className="auth-stat-card">
                <span className="auth-stat-number">98.5%</span>
                <span className="auth-stat-label">Data Accuracy</span>
              </div>
              <div className="auth-stat-card">
                <span className="auth-stat-number">35%</span>
                <span className="auth-stat-label">Avg. Reduction</span>
              </div>
              <div className="auth-stat-card">
                <span className="auth-stat-number">ISO</span>
                <span className="auth-stat-label">14064 Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-card-glow" />

            <div className="auth-card-header">
              <h2 className="auth-card-title">Welcome Back</h2>
              <p className="auth-card-subtitle">Sign in to your EcoChain AI account</p>
            </div>

            {/* Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="auth-demo-btn"
            >
              <div className="auth-demo-btn-bg" />
              <Sparkles className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Try Instant Demo — No Account Needed</span>
              <Zap className="w-3.5 h-3.5 relative z-10 opacity-70" />
            </button>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or sign in with email</span>
              <div className="auth-divider-line" />
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email Field */}
              <div className={`auth-field-group ${focusedField === 'email' ? 'focused' : ''}`}>
                <label className="auth-field-label">Email Address</label>
                <div className="auth-input-wrap">
                  <Mail className="auth-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="manager@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className={`auth-field-group ${focusedField === 'password' ? 'focused' : ''}`}>
                <div className="auth-field-label-row">
                  <label className="auth-field-label">Password</label>
                  <Link to="/forgot-password" className="auth-forgot-link">
                    Forgot Password?
                  </Link>
                </div>
                <div className="auth-input-wrap">
                  <Lock className="auth-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="auth-input auth-input-with-toggle"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-password-toggle"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="auth-submit-btn"
              >
                <div className="auth-submit-btn-bg" />
                <span className="relative z-10">
                  {isSubmitting ? 'Authenticating...' : 'Sign In to Platform'}
                </span>
                {!isSubmitting && <ArrowRight className="w-4 h-4 relative z-10" />}
                {isSubmitting && (
                  <div className="auth-spinner relative z-10" />
                )}
              </button>
            </form>

            <p className="auth-switch-text">
              Don't have an account?{' '}
              <Link to="/register" className="auth-switch-link">
                Register Organization
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>GHG Protocol Scope 3 Standard Compliant · ISO 14064 · TCFD Ready</span>
      </footer>
    </div>
  );
};
