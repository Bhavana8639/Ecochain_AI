import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Supplier, EmissionRecord, AIInsight, EmissionFilterState } from '../types';
import { supplierService, emissionService } from '../services/firestoreService';
import { generateAIInsights } from '../services/aiAdvisorService';
import toast from 'react-hot-toast';

interface DataContextType {
  suppliers: Supplier[];
  emissions: EmissionRecord[];
  insights: AIInsight[];
  loading: boolean;
  filters: EmissionFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EmissionFilterState>>;
  resetFilters: () => void;
  filteredEmissions: EmissionRecord[];
  
  // KPI Aggregations
  totalScope3Emissions: number;
  totalSuppliersCount: number;
  monthlyEmissionsCurrent: number;
  monthlyEmissionsPrevious: number;
  monthlyPercentageChange: number;
  highEmissionSuppliersCount: number;

  // Actions
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  addEmissionRecord: (record: Omit<EmissionRecord, 'id' | 'createdAt'>) => Promise<void>;
  deleteEmissionRecord: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const initialFilters: EmissionFilterState = {
  searchQuery: '',
  supplierId: '',
  transportMode: '',
  materialCategory: '',
  startDate: '',
  endDate: ''
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [emissions, setEmissions] = useState<EmissionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<EmissionFilterState>(initialFilters);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [fetchedSuppliers, fetchedEmissions] = await Promise.all([
        supplierService.getAll(),
        emissionService.getAll()
      ]);
      setSuppliers(fetchedSuppliers);
      setEmissions(fetchedEmissions);
    } catch (err) {
      console.error('Error fetching Scope 3 data:', err);
      toast.error('Failed to load supply chain records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Compute AI Insights dynamically from suppliers and emissions
  const insights = useMemo(() => {
    return generateAIInsights(emissions, suppliers);
  }, [emissions, suppliers]);

  // Supplier CRUD
  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await supplierService.add(supplier);
      setSuppliers(prev => [created, ...prev]);
      toast.success(`Supplier "${created.name}" added successfully`);
    } catch (err) {
      toast.error('Failed to add supplier');
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      await supplierService.update(id, updates);
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      toast.success('Supplier details updated');
    } catch (err) {
      toast.error('Failed to update supplier');
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await supplierService.delete(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      toast.success('Supplier removed');
    } catch (err) {
      toast.error('Failed to delete supplier');
    }
  };

  // Emission CRUD
  const addEmissionRecord = async (record: Omit<EmissionRecord, 'id' | 'createdAt'>) => {
    try {
      const created = await emissionService.add(record);
      setEmissions(prev => [created, ...prev]);

      // Also refresh suppliers to update their aggregated total emission
      const updatedSuppliers = await supplierService.getAll();
      setSuppliers(updatedSuppliers);

      if (created.flaggedHighEmission) {
        toast.error(`⚠️ High Carbon Emission Alert: ${created.co2EmissionsTons} tCO₂e recorded for ${created.supplierName}`, {
          duration: 6000
        });
      } else {
        toast.success('Scope 3 emission record logged!');
      }
    } catch (err) {
      toast.error('Failed to log emission record');
    }
  };

  const deleteEmissionRecord = async (id: string) => {
    try {
      await emissionService.delete(id);
      setEmissions(prev => prev.filter(e => e.id !== id));
      toast.success('Emission record removed');
    } catch (err) {
      toast.error('Failed to delete emission record');
    }
  };

  const resetFilters = () => setFilters(initialFilters);

  // Filtered emissions calculation
  const filteredEmissions = useMemo(() => {
    return emissions.filter(record => {
      // Search term
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSupplier = record.supplierName.toLowerCase().includes(query);
        const matchesMaterial = record.materialCategory.toLowerCase().includes(query);
        const matchesMode = record.transportMode.toLowerCase().includes(query);
        const matchesNotes = (record.notes || '').toLowerCase().includes(query);
        if (!matchesSupplier && !matchesMaterial && !matchesMode && !matchesNotes) {
          return false;
        }
      }

      if (filters.supplierId && record.supplierId !== filters.supplierId) return false;
      if (filters.transportMode && record.transportMode !== filters.transportMode) return false;
      if (filters.materialCategory && record.materialCategory !== filters.materialCategory) return false;
      if (filters.startDate && record.date < filters.startDate) return false;
      if (filters.endDate && record.date > filters.endDate) return false;

      return true;
    });
  }, [emissions, filters]);

  // Aggregate KPI metrics
  const totalScope3Emissions = useMemo(() => {
    return Math.round(emissions.reduce((acc, curr) => acc + curr.co2EmissionsTons, 0) * 100) / 100;
  }, [emissions]);

  const totalSuppliersCount = suppliers.length;

  const highEmissionSuppliersCount = useMemo(() => {
    return suppliers.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Critical').length;
  }, [suppliers]);

  // Current month vs previous month comparison
  const { monthlyEmissionsCurrent, monthlyEmissionsPrevious, monthlyPercentageChange } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    let currentMonthTotal = 0;
    let prevMonthTotal = 0;

    emissions.forEach(record => {
      const d = new Date(record.date);
      if (isNaN(d.getTime())) return;

      const recordYear = d.getFullYear();
      const recordMonth = d.getMonth();

      if (recordYear === currentYear && recordMonth === currentMonth) {
        currentMonthTotal += record.co2EmissionsTons;
      } else if (
        (currentMonth === 0 && recordYear === currentYear - 1 && recordMonth === 11) ||
        (recordYear === currentYear && recordMonth === currentMonth - 1)
      ) {
        prevMonthTotal += record.co2EmissionsTons;
      }
    });

    const currRounded = Math.round(currentMonthTotal * 100) / 100;
    const prevRounded = Math.round(prevMonthTotal * 100) / 100;

    let percentChange = 0;
    if (prevRounded > 0) {
      percentChange = Math.round(((currRounded - prevRounded) / prevRounded) * 100);
    } else if (currRounded > 0) {
      percentChange = 100;
    }

    return {
      monthlyEmissionsCurrent: currRounded,
      monthlyEmissionsPrevious: prevRounded,
      monthlyPercentageChange: percentChange
    };
  }, [emissions]);

  return (
    <DataContext.Provider
      value={{
        suppliers,
        emissions,
        insights,
        loading,
        filters,
        setFilters,
        resetFilters,
        filteredEmissions,
        totalScope3Emissions,
        totalSuppliersCount,
        monthlyEmissionsCurrent,
        monthlyEmissionsPrevious,
        monthlyPercentageChange,
        highEmissionSuppliersCount,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addEmissionRecord,
        deleteEmissionRecord,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
