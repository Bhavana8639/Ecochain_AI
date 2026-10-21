export type TierLevel = 'Tier 1' | 'Tier 2' | 'Tier 3';
export type TransportMode = 'Road Freight (Truck)' | 'Rail Freight' | 'Air Freight' | 'Sea Freight (Container)';
export type MaterialCategory = 'Raw Steel' | 'Aluminum' | 'Plastics (PET/PP)' | 'Paper & Cardboard' | 'Textiles' | 'Electronics' | 'Chemicals' | 'General Freight';
export type EmissionCategory = 'Category 1: Purchased Goods & Services' | 'Category 4: Upstream Transportation & Distribution' | 'Category 9: Downstream Transportation';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Supplier {
  id: string;
  name: string;
  code: string;
  country: string;
  category: MaterialCategory;
  tier: TierLevel;
  contactEmail: string;
  contactPhone?: string;
  status: 'Active' | 'Under Audit' | 'Inactive';
  riskLevel: RiskLevel;
  totalEmissionsTons: number;
  lastAuditDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmissionRecord {
  id: string;
  supplierId: string;
  supplierName: string;
  materialCategory: MaterialCategory;
  category: EmissionCategory;
  quantityKg: number;
  weightTons: number;
  transportMode: TransportMode;
  distanceKm: number;
  date: string; // YYYY-MM-DD
  co2EmissionsTons: number; // calculated CO2e in metric tons
  notes?: string;
  flaggedHighEmission?: boolean;
  createdAt: string;
}

export interface MaterialFactor {
  category: MaterialCategory;
  factorKgCO2PerKg: number; // kg CO2e per kg material
}

export interface TransportFactor {
  mode: TransportMode;
  factorKgCO2PerTonKm: number; // kg CO2e per ton-km
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  companyName: string;
  role: string;
  targetReductionPercent: number; // e.g. 30% by 2030
  netZeroTargetYear: number; // e.g. 2030
  highEmissionThresholdTons: number; // alert trigger e.g. 10 tons
  createdAt: string;
}

export interface AIInsight {
  id: string;
  title: string;
  category: 'Route Optimization' | 'Supplier Switch' | 'Material Substitution' | 'Efficiency Improvement';
  impact: 'High' | 'Medium' | 'Low';
  potentialSavingsTons: number;
  potentialCostSavingsUSD?: number;
  description: string;
  actionableSteps: string[];
}

export interface EmissionFilterState {
  searchQuery: string;
  supplierId: string;
  transportMode: string;
  materialCategory: string;
  startDate: string;
  endDate: string;
}
