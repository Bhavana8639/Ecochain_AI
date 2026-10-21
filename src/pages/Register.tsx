import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, Eye, EyeOff, User, Building2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = getStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  if (!password) return null;
  return (
    <div className="auth-password-strength">
      <div className="auth-strength-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="auth-strength-bar"
            style={{ background: i <= strength ? colors[strength] : undefined }}
          />
        ))}
      </div>
      <span className="auth-strength-label" style={{ color: colors[strength] }}>
        {labels[strength]}
      </span>
    </div>
  );
};

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordsMatch = confirmPassword ? password === confirmPassword : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !company || !agreed) return;
    if (password !== confirmPassword) return;
    setIsSubmitting(true);
    try {
      await register(email, password, name, company);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    'Real-time Scope 3 emissions tracking',
    'AI-powered supplier risk analysis',
    'GHG Protocol compliant reporting',
    'Automated net-zero pathway planning',
  ];

  return (
    <div className="auth-page-wrapper">
      {/* Animated background */}
      <div className="auth-bg-mesh" />
      <div className="auth-bg-orb auth-bg-orb-1" style={{ top: '10%', left: '5%' }} />
      <div className="auth-bg-orb auth-bg-orb-2" style={{ bottom: '20%', right: '5%' }} />
      <div className="auth-bg-orb auth-bg-orb-3" style={{ top: '60%', left: '40%' }} />

      {/* Header */}
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
          <span>Enterprise Grade Security</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        {/* Left Panel - Features */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-icon-wrap">
              <Leaf className="auth-brand-icon" />
            </div>
            <h2 className="auth-brand-title">Start Your<br />Net-Zero Journey</h2>
            <p className="auth-brand-desc">
              Join leading enterprises using EcoChain AI to measure, manage, and reduce their Scope 3 carbon footprint.
            </p>
            <div className="auth-features-list">
              {features.map((f, i) => (
                <div key={i} className="auth-feature-item">
                  <CheckCircle2 className="auth-feature-icon" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="auth-trust-badges">
              <span className="auth-trust-badge">ISO 14064</span>
              <span className="auth-trust-badge">GHG Protocol</span>
              <span className="auth-trust-badge">TCFD Ready</span>
              <span className="auth-trust-badge">SOC 2 Type II</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Register Form */}
        <div className="auth-form-panel">
          <div className="auth-card auth-card-register">
            <div className="auth-card-glow" />

            <div className="auth-card-header">
              <h2 className="auth-card-title">Create Enterprise Account</h2>
              <p className="auth-card-subtitle">Start tracking Scope 3 emissions in real-time</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Name & Company Row */}
              <div className="auth-form-row">
                <div className={`auth-field-group ${focusedField === 'name' ? 'focused' : ''}`}>
                  <label className="auth-field-label">Full Name</label>
                  <div className="auth-input-wrap">
                    <User className="auth-input-icon" />
                    <input
                      id="register-name"
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="auth-input"
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className={`auth-field-group ${focusedField === 'company' ? 'focused' : ''}`}>
                  <label className="auth-field-label">Company Name</label>
                  <div className="auth-input-wrap">
                    <Building2 className="auth-input-icon" />
                    <input
                      id="register-company"
                      type="text"
                      required
                      placeholder="GreenTech Ltd"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField(null)}
                      className="auth-input"
                      autoComplete="organization"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className={`auth-field-group ${focusedField === 'email' ? 'focused' : ''}`}>
                <label className="auth-field-label">Work Email</label>
                <div className="auth-input-wrap">
                  <Mail className="auth-input-icon" />
                  <input
                    id="register-email"
                    type="email"
                    required
                    placeholder="alex@greentech.com"
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
                <label className="auth-field-label">Password</label>
                <div className="auth-input-wrap">
                  <Lock className="auth-input-icon" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="auth-input auth-input-with-toggle"
                    autoComplete="new-password"
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
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <div className={`auth-field-group ${focusedField === 'confirm' ? 'focused' : ''} ${!passwordsMatch ? 'error' : ''}`}>
                <label className="auth-field-label">Confirm Password</label>
                <div className="auth-input-wrap">
                  <Lock className="auth-input-icon" />
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    className="auth-input auth-input-with-toggle"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-password-toggle"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!passwordsMatch && (
                  <p className="auth-field-error">Passwords do not match</p>
                )}
              </div>

              {/* Terms Agreement */}
              <label className="auth-checkbox-label">
                <input
                  id="register-agree-terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="auth-checkbox"
                  required
                />
                <span className="auth-checkbox-custom" />
                <span className="auth-checkbox-text">
                  I agree to the{' '}
                  <a href="#" className="auth-link">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="auth-link">Privacy Policy</a>
                </span>
              </label>

              {/* Submit */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={isSubmitting || !agreed || !passwordsMatch}
                className="auth-submit-btn"
              >
                <div className="auth-submit-btn-bg" />
                <span className="relative z-10">
                  {isSubmitting ? 'Creating Account...' : 'Create Enterprise Account'}
                </span>
                {!isSubmitting && <ArrowRight className="w-4 h-4 relative z-10" />}
                {isSubmitting && <div className="auth-spinner relative z-10" />}
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">Sign In</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="auth-footer">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Enterprise-grade security · SOC 2 Type II · GDPR Compliant</span>
      </footer>
    </div>
  );
};
