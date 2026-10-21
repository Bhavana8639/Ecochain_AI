import React from 'react';
import { AIInsight } from '../../types';
import { Badge } from '../common/Badge';
import { Sparkles, ArrowRight, CheckCircle2, TrendingDown, DollarSign } from 'lucide-react';

interface AIInsightsPanelProps {
  insights: AIInsight[];
  limit?: number;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights, limit }) => {
  const displayInsights = limit ? insights.slice(0, limit) : insights;

  const categoryColor = (cat: AIInsight['category']) => {
    switch (cat) {
      case 'Route Optimization': return 'teal';
      case 'Supplier Switch': return 'rose';
      case 'Material Substitution': return 'amber';
      case 'Efficiency Improvement': return 'emerald';
      default: return 'indigo';
    }
  };

  return (
    <div className="space-y-4">
      {displayInsights.map((insight) => (
        <div
          key={insight.id}
          className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                <Sparkles className="w-4 h-4" />
              </div>
              <Badge variant={categoryColor(insight.category)}>
                {insight.category}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Impact:
              </span>
              <Badge variant={insight.impact === 'High' ? 'rose' : 'amber'}>
                {insight.impact}
              </Badge>
            </div>
          </div>

          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
            {insight.title}
          </h4>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
            {insight.description}
          </p>

          {/* Savings Metric Badges */}
          <div className="flex flex-wrap items-center gap-3 my-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Save ~{insight.potentialSavingsTons} tCO₂e</span>
            </div>

            {insight.potentialCostSavingsUSD && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold border border-teal-500/20">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Est. ${insight.potentialCostSavingsUSD.toLocaleString()} Cost Reduction</span>
              </div>
            )}
          </div>

          {/* Actionable Steps */}
          <div className="space-y-1.5 pt-2">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Recommended Action Plan
            </h5>
            {insight.actionableSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
