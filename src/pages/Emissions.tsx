import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { EmissionModal } from '../components/emissions/EmissionModal';
import { EmissionTable } from '../components/emissions/EmissionTable';
import { EmissionFilters } from '../components/emissions/EmissionFilters';
import { AlertBanner } from '../components/common/AlertBanner';
import { exportEmissionsCSV } from '../services/csvService';
import { Plus, Download, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { KPICard } from '../components/common/KPICard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Emissions: React.FC = () => {
  const navigate = useNavigate();
  const {
    emissions,
    filteredEmissions,
    totalScope3Emissions,
    loading,
    deleteEmissionRecord
  } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner label="Loading Scope 3 emission records..." size="lg" />;
  }

  const flaggedCount = emissions.filter(e => e.flaggedHighEmission).length;
  const avgEmissionsPerRecord = emissions.length > 0
    ? Math.round((totalScope3Emissions / emissions.length) * 100) / 100
    : 0;
  const airFreightRecords = emissions.filter(e => e.transportMode === 'Air Freight').length;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Scope 3 Emissions Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Log, filter, and audit supply chain carbon footprint records aligned to GHG Protocol.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportEmissionsCSV(filteredEmissions)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Log Emission</span>
          </button>
        </div>
      </div>

      {/* High Emission Flags Alert */}
      {flaggedCount > 0 && (
        <AlertBanner
          type="warning"
          title={`${flaggedCount} High Emission Records Flagged (≥10 tCO₂e threshold)`}
          message="These shipments exceed your configured carbon intensity threshold. Review transport modal shift opportunities to reduce emissions."
          actionText="View AI Reduction Insights"
          onAction={() => navigate('/ai-insights')}
        />
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Total Emission Records"
          value={emissions.length}
          subtitle={`Showing ${filteredEmissions.length} filtered records`}
          icon={Activity}
          colorScheme="emerald"
        />
        <KPICard
          title="Flagged High Emission"
          value={flaggedCount}
          subtitle="Records exceeding 10 tCO₂e threshold"
          icon={AlertTriangle}
          colorScheme="rose"
        />
        <KPICard
          title="Avg. Emissions per Shipment"
          value={`${avgEmissionsPerRecord} tCO₂e`}
          subtitle={`${airFreightRecords} high-carbon air freight records`}
          icon={TrendingUp}
          colorScheme="amber"
        />
      </div>

      {/* Multi-field Filters */}
      <EmissionFilters />

      {/* Emission Records Table */}
      <EmissionTable
        emissions={filteredEmissions}
        onDelete={deleteEmissionRecord}
      />

      {/* Log Emission Modal */}
      <EmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
