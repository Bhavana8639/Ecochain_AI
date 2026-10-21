import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { Supplier, TierLevel, MaterialCategory, RiskLevel } from '../../types';
import { useData } from '../../context/DataContext';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierToEdit?: Supplier | null;
}

interface SupplierFormData {
  name: string;
  code: string;
  country: string;
  category: MaterialCategory;
  tier: TierLevel;
  contactEmail: string;
  contactPhone: string;
  status: 'Active' | 'Under Audit' | 'Inactive';
  riskLevel: RiskLevel;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  supplierToEdit
}) => {
  const { addSupplier, updateSupplier } = useData();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SupplierFormData>();

  useEffect(() => {
    if (supplierToEdit) {
      reset({
        name: supplierToEdit.name,
        code: supplierToEdit.code,
        country: supplierToEdit.country,
        category: supplierToEdit.category,
        tier: supplierToEdit.tier,
        contactEmail: supplierToEdit.contactEmail,
        contactPhone: supplierToEdit.contactPhone || '',
        status: supplierToEdit.status,
        riskLevel: supplierToEdit.riskLevel
      });
    } else {
      reset({
        name: '',
        code: `SUP-${Math.floor(100 + Math.random() * 900)}`,
        country: 'United States',
        category: 'Raw Steel',
        tier: 'Tier 1',
        contactEmail: '',
        contactPhone: '',
        status: 'Active',
        riskLevel: 'Medium'
      });
    }
  }, [supplierToEdit, isOpen, reset]);

  const onSubmit = async (data: SupplierFormData) => {
    if (supplierToEdit) {
      await updateSupplier(supplierToEdit.id, data);
    } else {
      await addSupplier({
        ...data,
        totalEmissionsTons: 0,
        lastAuditDate: new Date().toISOString().slice(0, 10)
      });
    }
    onClose();
  };

  const materialCategories: MaterialCategory[] = [
    'Raw Steel',
    'Aluminum',
    'Plastics (PET/PP)',
    'Paper & Cardboard',
    'Textiles',
    'Electronics',
    'Chemicals',
    'General Freight'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplierToEdit ? 'Edit Supplier Details' : 'Register New Supplier'}
      subtitle="Track supply chain tier, category, and carbon audit profile."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Supplier Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Supplier / Enterprise Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Industrial Steel"
              {...register('name', { required: 'Supplier name is required' })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
            {errors.name && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Supplier Code */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Supplier Code / ID *
            </label>
            <input
              type="text"
              {...register('code', { required: 'Code is required' })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
            {errors.code && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.code.message}</p>
            )}
          </div>

          {/* Material Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Material Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            >
              {materialCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Supply Chain Tier */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Supply Chain Tier *
            </label>
            <select
              {...register('tier')}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="Tier 1">Tier 1 (Direct Supplier)</option>
              <option value="Tier 2">Tier 2 (Sub-tier Supplier)</option>
              <option value="Tier 3">Tier 3 (Raw Material Origin)</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Country / Region *
            </label>
            <input
              type="text"
              placeholder="e.g. Germany, Japan, USA"
              {...register('country', { required: 'Country is required' })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
            {errors.country && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.country.message}</p>
            )}
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              placeholder="sustainability@supplier.com"
              {...register('contactEmail', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
              })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
            {errors.contactEmail && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.contactEmail.message}</p>
            )}
          </div>

          {/* Carbon Risk Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Carbon Risk Level
            </label>
            <select
              {...register('riskLevel')}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="Low">Low Risk (Low Carbon Footprint)</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk (High Intensity)</option>
              <option value="Critical">Critical (Action Required)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Audit Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="Active">Active & Verified</option>
              <option value="Under Audit">Under Carbon Audit</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

        </div>

        {/* Buttons */}
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
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {supplierToEdit ? 'Save Changes' : 'Add Supplier'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
