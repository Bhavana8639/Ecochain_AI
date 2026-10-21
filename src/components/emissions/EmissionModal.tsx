import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import {
  MaterialCategory,
  TransportMode,
  EmissionCategory,
  Supplier
} from '../../types';
import { calculateEmissionsTons, calculateEmissionBreakdown } from '../../services/emissionCalculator';
import { useData } from '../../context/DataContext';
import { Calculator, AlertTriangle } from 'lucide-react';

interface EmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EmissionFormData {
  supplierId: string;
  materialCategory: MaterialCategory;
  category: EmissionCategory;
  quantityKg: number;
  weightTons: number;
  transportMode: TransportMode;
  distanceKm: number;
  date: string;
  notes: string;
}

export const EmissionModal: React.FC<EmissionModalProps> = ({ isOpen, onClose }) => {
  const { suppliers, addEmissionRecord } = useData();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EmissionFormData>({
    defaultValues: {
      supplierId: '',
      materialCategory: 'Raw Steel',
      category: 'Category 1: Purchased Goods & Services',
      quantityKg: 10000,
      weightTons: 10,
      transportMode: 'Road Freight (Truck)',
      distanceKm: 500,
      date: new Date().toISOString().slice(0, 10),
      notes: ''
    }
  });

  // Watch fields for real-time CO2 calculations
  const watchQuantityKg = watch('quantityKg') || 0;
  const watchWeightTons = watch('weightTons') || 0;
  const watchMaterial = watch('materialCategory');
  const watchTransport = watch('transportMode');
  const watchDistanceKm = watch('distanceKm') || 0;
  const watchSupplierId = watch('supplierId');

  // Auto update weight in tons when quantity in kg changes
  useEffect(() => {
    if (watchQuantityKg > 0) {
      setValue('weightTons', Math.round((watchQuantityKg / 1000) * 100) / 100);
    }
  }, [watchQuantityKg, setValue]);

  // Set default supplier if available
  useEffect(() => {
    if (suppliers.length > 0 && !watchSupplierId) {
      setValue('supplierId', suppliers[0].id);
    }
  }, [suppliers, watchSupplierId, setValue]);

  // Compute live breakdown
  const calculatedEmissions = calculateEmissionsTons(
    Number(watchQuantityKg),
    Number(watchWeightTons),
    watchMaterial,
    watchTransport,
    Number(watchDistanceKm)
  );

  const breakdown = calculateEmissionBreakdown(
    Number(watchQuantityKg),
    Number(watchWeightTons),
    watchMaterial,
    watchTransport,
    Number(watchDistanceKm)
  );

  const isHighEmission = calculatedEmissions >= 10.0;

  const onSubmit = async (data: EmissionFormData) => {
    const selectedSupplier = suppliers.find(s => s.id === data.supplierId);
    if (!selectedSupplier) return;

    await addEmissionRecord({
      supplierId: data.supplierId,
      supplierName: selectedSupplier.name,
      materialCategory: data.materialCategory,
      category: data.category,
      quantityKg: Number(data.quantityKg),
      weightTons: Number(data.weightTons),
      transportMode: data.transportMode,
      distanceKm: Number(data.distanceKm),
      date: data.date,
      co2EmissionsTons: calculatedEmissions,
      notes: data.notes,
      flaggedHighEmission: isHighEmission
    });

    reset();
    onClose();
  };

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Scope 3 Emission Record"
      subtitle="GHG Protocol Category 1 & Category 4 Automated Calculation Engine"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Real-Time Live Calculation Display Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Automated Scope 3 Calculation Preview
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              GHG Protocol Engine
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold text-emerald-400">
                {calculatedEmissions.toFixed(3)}
              </span>
              <span className="text-sm font-semibold text-slate-300 ml-1.5">tCO₂e</span>
            </div>

            <div className="text-right text-[11px] text-slate-400 space-y-0.5">
              <p>Material: {breakdown.materialEmissionsTons} tCO₂e ({breakdown.materialPercent}%)</p>
              <p>Transport: {breakdown.transportEmissionsTons} tCO₂e ({breakdown.transportPercent}%)</p>
            </div>
          </div>

          {isHighEmission && (
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>High Carbon Threshold Alert (≥ 10 tCO₂e). Triggering AI reduction review.</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Supplier Selection */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Supplier *
            </label>
            <select
              {...register('supplierId', { required: 'Please select a supplier' })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) - {s.category} [{s.tier}]
                </option>
              ))}
            </select>
            {errors.supplierId && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.supplierId.message}</p>
            )}
          </div>

          {/* Material Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Material Category *
            </label>
            <select
              {...register('materialCategory')}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            >
              {materialOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Transport Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Logistics / Transport Mode *
            </label>
            <select
              {...register('transportMode')}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            >
              {transportOptions.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>

          {/* Quantity in kg */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Procured Quantity (kg) *
            </label>
            <input
              type="number"
              step="any"
              {...register('quantityKg', { required: 'Quantity is required', min: 0.1 })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Weight in Tons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Shipment Weight (Metric Tons)
            </label>
            <input
              type="number"
              step="any"
              {...register('weightTons', { required: true, min: 0.001 })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Distance in km */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Shipping Distance (km) *
            </label>
            <input
              type="number"
              step="any"
              {...register('distanceKm', { required: 'Distance is required', min: 1 })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Transaction Date *
            </label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Audit Notes & Batch Code (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. PO-84920 Batch steel delivery for automotive chassis line."
              {...register('notes')}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || suppliers.length === 0}
            className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            Log Emission Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
