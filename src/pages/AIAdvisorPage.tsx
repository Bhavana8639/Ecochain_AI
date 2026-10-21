import React from 'react';
import { useData } from '../context/DataContext';
import { AIInsightsPanel } from '../components/ai/AIInsightsPanel';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Sparkles, Brain, TrendingDown, Zap } from 'lucide-react';

export const AIAdvisorPage: React.FC = () => {
  const { insights, totalScope3Emissions, loading } = useData();

  if (loading) return <LoadingSpinner label="Running AI decarbonization analysis..." size="lg" />;

  const totalPotentialSavings = insights.reduce((sum, i) => sum + i.potentialSavingsTons, 0);
  const totalCostSavings = insights.reduce((sum, i) => sum + (i.potentialCostSavingsUSD || 0), 0);
  const highImpactCount = insights.filter(i => i.impact === 'High').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl text-white">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            EcoChain AI Decarbonization Advisor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AI-generated supply chain decarbonization strategies for SME net-zero transition.
          </p>
        </div>
      </div>

      {/* AI Summary Panel */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 p-6 rounded-3xl border border-slate-700/80 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400">
            AI Carbon Intelligence Engine
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          EcoChain AI has analyzed your supply chain data, identifying {insights.length} actionable decarbonization 
          opportunities derived from real-time GHG Protocol Scope 3 emission factors, logistics mode analysis, 
          and supplier risk benchmarking.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-700/60">
          <div className="text-center">
            <TrendingDown className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-white">{totalPotentialSavings.toFixed(1)}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">tCO₂e Potential Reduction</p>
          </div>
          <div className="text-center">
            <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-white">${totalCostSavings.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Est. Cost Savings USD</p>
          </div>
          <div className="text-center">
            <Sparkles className="w-5 h-5 text-teal-400 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-white">{highImpactCount}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">High-Impact Actions</p>
          </div>
          <div className="text-center">
            <Brain className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-white">
              {totalScope3Emissions > 0 ? `${Math.round((totalPotentialSavings / totalScope3Emissions) * 100)}%` : 'N/A'}
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Reduction Potential</p>
          </div>
        </div>
      </div>

      {/* AI Insights Panel - All */}
      <AIInsightsPanel insights={insights} />

      {/* Methodology Note */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
          Calculation Methodology
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          AI recommendations are derived from live Scope 3 emission records using{' '}
          <strong className="text-slate-700 dark:text-slate-300">GHG Protocol Category 1 (Purchased Goods & Services)</strong> and{' '}
          <strong className="text-slate-700 dark:text-slate-300">Category 4 (Upstream Transportation)</strong> standards.
          Emission factors follow DEFRA UK Government Greenhouse Gas Reporting Conversion Factors and IPCC AR6 benchmarks.
          Cost savings are indicative estimates based on global freight benchmarks. All recommendations require 
          organization-specific validation.
        </p>
      </div>

    </div>
  );
};
