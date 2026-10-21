import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, ArrowLeft, Send, ShieldCheck, CheckCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-bg-mesh" />
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />
      <div className="auth-bg-orb auth-bg-orb-3" />

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
          <span>Secure Password Recovery</span>
        </div>
      </header>

      <main className="auth-main auth-main-centered">
        <div className="auth-card auth-card-compact">
          <div className="auth-card-glow" />

          {sent ? (
            /* Success State */
            <div className="auth-success-state">
              <div className="auth-success-icon-wrap">
                <CheckCircle className="auth-success-icon" />
              </div>
              <h2 className="auth-card-title">Check Your Inbox</h2>
              <p className="auth-success-desc">
                We've sent a password reset link to<br />
                <strong className="text-emerald-400">{email}</strong>
              </p>
              <p className="auth-success-hint">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  className="auth-switch-link"
                  onClick={() => { setSent(false); setEmail(''); }}
                >
                  try again
                </button>.
              </p>
              <Link to="/login" className="auth-submit-btn auth-submit-btn-inline">
                <div className="auth-submit-btn-bg" />
                <ArrowLeft className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Back to Sign In</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="auth-card-header">
                <div className="auth-reset-icon-wrap">
                  <Mail className="w-7 h-7 text-emerald-400" />
                </div>
                <h2 className="auth-card-title">Reset Password</h2>
                <p className="auth-card-subtitle">
                  Enter your work email and we'll send you a secure reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className={`auth-field-group ${focusedField === 'email' ? 'focused' : ''}`}>
                  <label className="auth-field-label">Work Email Address</label>
                  <div className="auth-input-wrap">
                    <Mail className="auth-input-icon" />
                    <input
                      id="forgot-email"
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

                <button
                  id="forgot-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-submit-btn"
                >
                  <div className="auth-submit-btn-bg" />
                  {!isSubmitting && <Send className="w-4 h-4 relative z-10" />}
                  {isSubmitting && <div className="auth-spinner relative z-10" />}
                  <span className="relative z-10">
                    {isSubmitting ? 'Sending Reset Link...' : 'Send Password Reset Email'}
                  </span>
                </button>
              </form>

              <div className="auth-back-link-wrap">
                <Link to="/login" className="auth-back-link">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="auth-footer">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>© {new Date().getFullYear()} EcoChain AI Inc. · All rights reserved</span>
      </footer>
    </div>
  );
};
