import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  colorScheme?: 'emerald' | 'teal' | 'amber' | 'rose' | 'indigo';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  changeLabel,
  trend = 'neutral',
  colorScheme = 'emerald'
}) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
    teal: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800/50',
    amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50'
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl border ${colorClasses[colorScheme]} group-hover:scale-105 transition-transform duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>

        {change !== undefined && (
          <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
            trend === 'down' 
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' 
              : trend === 'up'
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}>
            {trend === 'down' ? (
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
            ) : trend === 'up' ? (
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
            ) : null}
            <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
          </div>
        )}
      </div>

      {(subtitle || changeLabel) && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {subtitle || changeLabel}
        </p>
      )}
    </div>
  );
};
