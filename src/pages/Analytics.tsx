import React from 'react';
import { useData } from '../context/DataContext';
import { MonthlyTrendChart } from '../components/charts/MonthlyTrendChart';
import { SupplierEmissionsChart } from '../components/charts/SupplierEmissionsChart';
import { TransportModeChart } from '../components/charts/TransportModeChart';
import { MaterialDistributionChart } from '../components/charts/MaterialDistributionChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BarChart3, TrendingDown } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { emissions, suppliers, loading, totalScope3Emissions } = useData();

  if (loading) return <LoadingSpinner label="Building analytics charts..." size="lg" />;

  const airFreightTotal = emissions
    .filter(e => e.transportMode === 'Air Freight')
    .reduce((sum, e) => sum + e.co2EmissionsTons, 0);

  const airFreightPercent = totalScope3Emissions > 0
    ? Math.round((airFreightTotal / totalScope3Emissions) * 100)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-500" />
            Analytics & Carbon Trends
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep-dive visualizations of Scope 3 supply chain emissions across suppliers, materials, and freight modes.
          </p>
        </div>
      </div>

      {/* Insight Banner */}
      {airFreightPercent > 0 && (
        <div className="bg-gradient-to-r from-rose-900/30 to-amber-900/20 border border-rose-500/30 p-5 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Modal Shift Opportunity Detected
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Air freight accounts for <span className="font-bold text-rose-400">{airFreightPercent}%</span> ({airFreightTotal.toFixed(2)} tCO₂e) of your Scope 3 emissions. 
              Switching to sea or rail logistics for non-urgent shipments can reduce transport emissions by up to <span className="font-bold text-emerald-400">80%</span>.
            </p>
          </div>
        </div>
      )}

      {/* Charts Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Trend - spans full width */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Monthly Scope 3 Emission Trend Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Month-over-month carbon footprint vs reduction target benchmark.
            </p>
          </div>
          <MonthlyTrendChart emissions={emissions} targetMonthlyThreshold={100} />
        </div>

        {/* Top Emitting Suppliers */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Top Emitting Suppliers (Risk-Colored)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bar color represents carbon risk rating: Green = Low, Red = Critical.
            </p>
          </div>
          <SupplierEmissionsChart suppliers={suppliers} />
        </div>

        {/* Logistics Mode Distribution */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Scope 3 by Logistics Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Relative carbon intensity across transport categories.
            </p>
          </div>
          <TransportModeChart emissions={emissions} />
        </div>

        {/* Material Category Distribution */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Category 1 Carbon Intensity by Procured Material
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Which raw materials drive the most Scope 3 Category 1 emissions in your supply chain.
            </p>
          </div>
          <MaterialDistributionChart emissions={emissions} />
        </div>

      </div>

      {/* Data Summary Card */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Emissions Summary Statistics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Records Logged', value: emissions.length.toString() },
            { label: 'Total Scope 3 CO₂e', value: `${totalScope3Emissions} tCO₂e` },
            { label: 'Unique Suppliers Tracked', value: [...new Set(emissions.map(e => e.supplierId))].length.toString() },
            { label: 'Active Material Types', value: [...new Set(emissions.map(e => e.materialCategory))].length.toString() }
          ].map(stat => (
            <div key={stat.label} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/40 text-center">
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{stat.value}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
