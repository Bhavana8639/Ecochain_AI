import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SupplierTable } from '../components/suppliers/SupplierTable';
import { SupplierModal } from '../components/suppliers/SupplierModal';
import { Supplier } from '../types';
import { exportSuppliersCSV } from '../services/csvService';
import { Plus, Download, Users, ShieldAlert, Award } from 'lucide-react';
import { KPICard } from '../components/common/KPICard';

export const Suppliers: React.FC = () => {
  const { suppliers, deleteSupplier } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

  const handleOpenAdd = () => {
    setSupplierToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setSupplierToEdit(supplier);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    exportSuppliersCSV(suppliers);
  };

  const highRiskCount = suppliers.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Critical').length;
  const tier1Count = suppliers.filter(s => s.tier === 'Tier 1').length;
  const activeCount = suppliers.filter(s => s.status === 'Active').length;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Supplier Decarbonization Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage Tier 1-3 suppliers, carbon audit risk levels, and emissions tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Total Registered Suppliers"
          value={suppliers.length}
          subtitle={`${activeCount} active & verified`}
          icon={Users}
          colorScheme="emerald"
        />

        <KPICard
          title="Tier 1 Direct Suppliers"
          value={tier1Count}
          subtitle={`${Math.round((tier1Count / (suppliers.length || 1)) * 100)}% of supply chain`}
          icon={Award}
          colorScheme="teal"
        />

        <KPICard
          title="High Carbon Risk Suppliers"
          value={highRiskCount}
          subtitle="Target for ISO 14064 carbon audit"
          icon={ShieldAlert}
          colorScheme="rose"
        />
      </div>

      {/* Table & Filter Component */}
      <SupplierTable
        suppliers={suppliers}
        onEdit={handleOpenEdit}
        onDelete={deleteSupplier}
      />

      {/* Add / Edit Modal */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplierToEdit={supplierToEdit}
      />

    </div>
  );
};
