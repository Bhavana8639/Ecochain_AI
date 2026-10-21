import React from 'react';
import { EmissionRecord } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { Trash2, AlertTriangle, Truck, Plane, Train, Ship, Calendar } from 'lucide-react';

interface EmissionTableProps {
  emissions: EmissionRecord[];
  onDelete: (id: string) => void;
}

export const EmissionTable: React.FC<EmissionTableProps> = ({ emissions, onDelete }) => {
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'Road Freight (Truck)': return <Truck className="w-3.5 h-3.5 text-blue-500" />;
      case 'Air Freight': return <Plane className="w-3.5 h-3.5 text-rose-500" />;
      case 'Rail Freight': return <Train className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Sea Freight (Container)': return <Ship className="w-3.5 h-3.5 text-cyan-500" />;
      default: return <Truck className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  if (emissions.length === 0) {
    return (
      <EmptyState
        title="No emission logs found"
        description="No Scope 3 emission logs match your current search and filter criteria."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 backdrop-blur-md shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4">Supplier</th>
            <th className="py-3.5 px-4">Material Category</th>
            <th className="py-3.5 px-4">Weight / Qty</th>
            <th className="py-3.5 px-4">Transport Mode</th>
            <th className="py-3.5 px-4">Distance</th>
            <th className="py-3.5 px-4 text-right">CO₂ Emissions</th>
            <th className="py-3.5 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-xs">
          {emissions.map((record) => (
            <tr
              key={record.id}
              className={`hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors ${
                record.flaggedHighEmission ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''
              }`}
            >
              <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {record.date}
                </span>
              </td>
              <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                {record.supplierName}
              </td>
              <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                {record.materialCategory}
              </td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {record.weightTons} Tons
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ({record.quantityKg.toLocaleString()} kg)
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  {getTransportIcon(record.transportMode)}
                  {record.transportMode}
                </span>
              </td>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                {record.distanceKm.toLocaleString()} km
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {record.flaggedHighEmission && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" role="img" aria-label="High Carbon Record" />
                  )}
                  <span className={`font-extrabold text-sm ${
                    record.flaggedHighEmission ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {record.co2EmissionsTons.toFixed(3)} tCO₂e
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onDelete(record.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
