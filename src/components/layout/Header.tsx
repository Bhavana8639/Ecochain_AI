import React from 'react';
import { Menu, Search, Bell, Plus, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenEmissionModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenEmissionModal }) => {
  const { filters, setFilters, highEmissionSuppliersCount, insights } = useData();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-colors">
      
      {/* Left: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search suppliers, materials, freight modes..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Quick Actions & Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Log Emission Button */}
        <button
          onClick={onOpenEmissionModal}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm shadow-emerald-600/20 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Log Emission</span>
        </button>

        {/* Notification Bell with High Emission Badge */}
        <div className="relative">
          <button
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="High Carbon Alerts"
          >
            <Bell className="w-4 h-4" />
            {highEmissionSuppliersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {highEmissionSuppliersCount}
              </span>
            )}
          </button>
        </div>

        {/* AI Insight Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{insights.length} AI Opportunities</span>
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />
      </div>
    </header>
  );
};
