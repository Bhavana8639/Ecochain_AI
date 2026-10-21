import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'teal' | 'amber' | 'rose' | 'slate' | 'indigo' | 'cyan';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'sm'
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400 border-teal-200 dark:border-teal-800/60',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60',
    cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/60'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium rounded-full border',
    md: 'text-xs px-3 py-1 font-semibold rounded-md border',
  };

  return (
    <span className={`inline-flex items-center gap-1 ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
};
