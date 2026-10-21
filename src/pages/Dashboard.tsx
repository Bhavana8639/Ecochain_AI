import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { KPICard } from '../components/common/KPICard';
import { AlertBanner } from '../components/common/AlertBanner';
import { MonthlyTrendChart } from '../components/charts/MonthlyTrendChart';
import { SupplierEmissionsChart } from '../components/charts/SupplierEmissionsChart';
import { TransportModeChart } from '../components/charts/TransportModeChart';
import { MaterialDistributionChart } from '../components/charts/MaterialDistributionChart';
import { AIInsightsPanel } from '../components/ai/AIInsightsPanel';
import { EmissionTable } from '../components/emissions/EmissionTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Users,
  Factory,
  Calendar,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const {
    suppliers,
    emissions,
    insights,
    loading,
    totalScope3Emissions,
    totalSuppliersCount,
    monthlyEmissionsCurrent,
    monthlyPercentageChange,
    highEmissionSuppliersCount,
    deleteEmissionRecord
  } = useData();

  const { userProfile } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner label="Compiling supply chain emissions analytics..." size="lg" />;
  }

  const topHighRiskSupplier = suppliers.find(s => s.riskLevel === 'High' || s.riskLevel === 'Critical');

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white border border-slate-700/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scope 3 GHG Protocol Standard</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Welcome, {userProfile?.displayName || 'Alex Morgan'}
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Real-time decarbonization analytics dashboard for <span className="font-semibold text-emerald-400">{userProfile?.companyName || 'GreenTech Ltd'}</span>. 
            Targeting <span className="text-teal-300 font-bold">{userProfile?.targetReductionPercent}% emission reduction by {userProfile?.netZeroTargetYear}</span>.
          </p>
        </div>

        <button
          onClick={() => navigate('/ai-insights')}
          className="relative z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-glow hover:scale-105 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>View AI Reduction Roadmap</span>
        </button>
      </div>

      {/* High Carbon Alert Banner if high emission suppliers exist */}
      {highEmissionSuppliersCount > 0 && topHighRiskSupplier && (
        <AlertBanner
          type="critical"
          title={`High Emission Alert: ${highEmissionSuppliersCount} Suppliers Require Decarbonization Review`}
          message={`${topHighRiskSupplier.name} (${topHighRiskSupplier.tier}) is emitting ${topHighRiskSupplier.totalEmissionsTons} tCO₂e. Immediate modal shift or supplier audit recommended.`}
          actionText="Review High Emitters"
          onAction={() => navigate('/suppliers')}
        />
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Scope 3 Footprint"
          value={`${totalScope3Emissions.toLocaleString()} tCO₂e`}
          subtitle="Cumulative supply chain emissions"
          icon={Factory}
          colorScheme="emerald"
        />

        <KPICard
          title="Active Suppliers"
          value={totalSuppliersCount}
          subtitle={`${suppliers.filter(s => s.status === 'Active').length} verified active suppliers`}
          icon={Users}
          colorScheme="teal"
        />

        <KPICard
          title="Current Month Emissions"
          value={`${monthlyEmissionsCurrent} tCO₂e`}
          change={monthlyPercentageChange}
          changeLabel="vs previous month"
          trend={monthlyPercentageChange < 0 ? 'down' : monthlyPercentageChange > 0 ? 'up' : 'neutral'}
          icon={Calendar}
          colorScheme="indigo"
        />

        <KPICard
          title="High Emission Risk Suppliers"
          value={highEmissionSuppliersCount}
          subtitle="Suppliers exceeding threshold"
          icon={AlertTriangle}
          colorScheme="rose"
        />
      </div>

      {/* Charts Row 1: Monthly Trend & Top Supplier Emitters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Scope 3 Monthly Emissions Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Historical monthly carbon footprint vs Net-Zero cap target.
              </p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <span>Detailed Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <MonthlyTrendChart emissions={emissions} />
        </div>

        {/* Top Emitting Suppliers Chart */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Top Carbon Emitting Suppliers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked by total metric tons CO₂e.
            </p>
          </div>
          <SupplierEmissionsChart suppliers={suppliers} />
        </div>
      </div>

      {/* Charts Row 2: Transport Mode & Material Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Emissions by Transport Logistics Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown of Road, Rail, Air, and Sea logistics.
            </p>
          </div>
          <TransportModeChart emissions={emissions} />
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Material Procurement Carbon Intensity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Category 1 Scope 3 breakdown by raw material type.
            </p>
          </div>
          <MaterialDistributionChart emissions={emissions} />
        </div>
      </div>

      {/* AI Insights & Recent Emissions Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Emissions Log Widget */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Recent Scope 3 Emissions Log
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest supply chain transactions and calculated carbon footprints.
              </p>
            </div>
            <button
              onClick={() => navigate('/emissions')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View All Logs →
            </button>
          </div>
          <EmissionTable emissions={emissions.slice(0, 5)} onDelete={deleteEmissionRecord} />
        </div>

        {/* AI Recommendations Sidebar Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>EcoChain AI Insights</span>
            </h3>
            <button
              onClick={() => navigate('/ai-insights')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Explore All
            </button>
          </div>
          <AIInsightsPanel insights={insights} limit={2} />
        </div>

      </div>

    </div>
  );
};
