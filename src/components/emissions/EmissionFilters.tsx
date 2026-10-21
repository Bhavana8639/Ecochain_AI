import React from 'react';
import { useData } from '../../context/DataContext';
import { Search, Filter, RotateCcw, Calendar } from 'lucide-react';
import { MaterialCategory, TransportMode } from '../../types';

export const EmissionFilters: React.FC = () => {
  const { filters, setFilters, resetFilters, suppliers } = useData();

  const materialOptions: MaterialCategory[] = [
    'Raw Steel',
    'Aluminum',
    'Plastics (PET/PP)',
    'Paper & Cardboard',
    'Textiles',
    'Electronics',
    'Chemicals',
    'General Freight'
  ];

  const transportOptions: TransportMode[] = [
    'Road Freight (Truck)',
    'Rail Freight',
    'Air Freight',
    'Sea Freight (Container)'
  ];

  return (
    <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Filter className="w-4 h-4 text-emerald-500" />
          <span>Filter Scope 3 Logs</span>
        </div>

        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes / supplier..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Supplier */}
        <div>
          <select
            value={filters.supplierId}
            onChange={(e) => setFilters(prev => ({ ...prev, supplierId: e.target.value }))}
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="">All Suppliers</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Material Category */}
        <div>
          <select
            value={filters.materialCategory}
            onChange={(e) => setFilters(prev => ({ ...prev, materialCategory: e.target.value }))}
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="">All Materials</option>
            {materialOptions.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Transport Mode */}
        <div>
          <select
            value={filters.transportMode}
            onChange={(e) => setFilters(prev => ({ ...prev, transportMode: e.target.value }))}
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="">All Transport Modes</option>
            {transportOptions.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            title="Start Date"
          />
          <span className="text-slate-400 text-xs">to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            title="End Date"
          />
        </div>

      </div>
    </div>
  );
};
