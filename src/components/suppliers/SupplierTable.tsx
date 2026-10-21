import React, { useState, useMemo } from 'react';
import { Supplier, RiskLevel, TierLevel } from '../../types';
import { Badge } from '../common/Badge';
import { Edit2, Trash2, Globe, Mail, Search, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  onEdit,
  onDelete
}) => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        s.country.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());

      const matchRisk = riskFilter === 'ALL' || s.riskLevel === riskFilter;
      const matchTier = tierFilter === 'ALL' || s.tier === tierFilter;

      return matchSearch && matchRisk && matchTier;
    });
  }, [suppliers, search, riskFilter, tierFilter]);

  const riskBadgeVariant = (risk: RiskLevel) => {
    switch (risk) {
      case 'Low': return 'emerald';
      case 'Medium': return 'amber';
      case 'High': return 'rose';
      case 'Critical': return 'rose';
      default: return 'slate';
    }
  };

  const statusIcon = (status: Supplier['status']) => {
    switch (status) {
      case 'Active': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Under Audit': return <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />;
      case 'Inactive': return <AlertCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search suppliers by name, code, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Tiers</option>
            <option value="Tier 1">Tier 1</option>
            <option value="Tier 2">Tier 2</option>
            <option value="Tier 3">Tier 3</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      {filteredSuppliers.length === 0 ? (
        <EmptyState
          title="No suppliers found"
          description="Try broadening your search term or reset risk and tier filters."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 backdrop-blur-md shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Supplier Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Tier</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Audit Status</th>
                <th className="py-3.5 px-4">Carbon Risk</th>
                <th className="py-3.5 px-4 text-right">Scope 3 CO₂e</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-xs">
              {filteredSuppliers.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-slate-600 dark:text-slate-300">
                    {s.code}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {s.name}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {s.contactEmail}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {s.category}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="teal">{s.tier}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {s.country}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      {statusIcon(s.status)}
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={riskBadgeVariant(s.riskLevel)}>
                      {s.riskLevel} Risk
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                    {s.totalEmissionsTons.toFixed(2)} tCO₂e
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(s)}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit Supplier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(s.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Delete Supplier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
