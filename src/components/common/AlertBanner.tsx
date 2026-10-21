import React from 'react';
import { AlertTriangle, ShieldAlert, Sparkles, X } from 'lucide-react';

interface AlertBannerProps {
  title: string;
  message: string;
  type?: 'warning' | 'critical' | 'ai' | 'info';
  onDismiss?: () => void;
  actionText?: string;
  onAction?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  title,
  message,
  type = 'warning',
  onDismiss,
  actionText,
  onAction
}) => {
  const styles = {
    warning: {
      container: 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
      badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
    },
    critical: {
      container: 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
      badge: 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300'
    },
    ai: {
      container: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
      icon: <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
      badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
    },
    info: {
      container: 'bg-sky-500/10 border-sky-500/30 text-sky-900 dark:text-sky-200',
      icon: <AlertTriangle className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />,
      badge: 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300'
    }
  };

  const active = styles[type];

  return (
    <div className={`rounded-xl border p-4 backdrop-blur-md transition-all flex items-start justify-between gap-3 ${active.container}`}>
      <div className="flex items-start gap-3">
        {active.icon}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold tracking-tight">{title}</h4>
          </div>
          <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
            {message}
          </p>
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="mt-2 text-xs font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {actionText} →
            </button>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
