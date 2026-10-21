import { MaterialCategory, TransportMode, MaterialFactor, TransportFactor } from '../types';

// Default GHG Protocol DEFRA/IPCC Emission Factors
export const DEFAULT_MATERIAL_FACTORS: Record<MaterialCategory, number> = {
  'Raw Steel': 1.85,          // 1.85 kg CO2e / kg
  'Aluminum': 8.90,           // 8.90 kg CO2e / kg (primary aluminum)
  'Plastics (PET/PP)': 2.50,  // 2.50 kg CO2e / kg
  'Paper & Cardboard': 0.95,  // 0.95 kg CO2e / kg
  'Textiles': 5.40,           // 5.40 kg CO2e / kg
  'Electronics': 12.80,       // 12.80 kg CO2e / kg
  'Chemicals': 3.10,          // 3.10 kg CO2e / kg
  'General Freight': 1.20,    // 1.20 kg CO2e / kg
};

export const DEFAULT_TRANSPORT_FACTORS: Record<TransportMode, number> = {
  'Road Freight (Truck)': 0.105,      // 0.105 kg CO2e per ton-km
  'Rail Freight': 0.028,              // 0.028 kg CO2e per ton-km
  'Air Freight': 1.130,               // 1.130 kg CO2e per ton-km (high carbon density!)
  'Sea Freight (Container)': 0.016,   // 0.016 kg CO2e per ton-km
};

/**
 * Calculates Scope 3 emissions in metric tons (tCO2e)
 */
export function calculateEmissionsTons(
  quantityKg: number,
  weightTons: number,
  material: MaterialCategory,
  transportMode: TransportMode,
  distanceKm: number,
  customMaterialFactors: Record<MaterialCategory, number> = DEFAULT_MATERIAL_FACTORS,
  customTransportFactors: Record<TransportMode, number> = DEFAULT_TRANSPORT_FACTORS
): number {
  const matFactor = customMaterialFactors[material] ?? DEFAULT_MATERIAL_FACTORS[material] ?? 1.5;
  const transFactor = customTransportFactors[transportMode] ?? DEFAULT_TRANSPORT_FACTORS[transportMode] ?? 0.1;

  // Material carbon footprint (kg CO2e)
  const materialEmissionsKg = quantityKg * matFactor;

  // Transport carbon footprint (kg CO2e) = weight (tons) * distance (km) * transport factor (kg CO2e / ton-km)
  const transportEmissionsKg = weightTons * distanceKm * transFactor;

  // Total kg CO2e converted to metric tons (tCO2e)
  const totalTons = (materialEmissionsKg + transportEmissionsKg) / 1000;

  return Math.round(totalTons * 1000) / 1000; // Round to 3 decimal places
}

/**
 * Helper to breakdown material vs transport emissions
 */
export function calculateEmissionBreakdown(
  quantityKg: number,
  weightTons: number,
  material: MaterialCategory,
  transportMode: TransportMode,
  distanceKm: number
) {
  const matFactor = DEFAULT_MATERIAL_FACTORS[material] || 1.5;
  const transFactor = DEFAULT_TRANSPORT_FACTORS[transportMode] || 0.1;

  const matKg = quantityKg * matFactor;
  const transKg = weightTons * distanceKm * transFactor;
  const totalKg = matKg + transKg;

  return {
    materialEmissionsTons: Math.round((matKg / 1000) * 1000) / 1000,
    transportEmissionsTons: Math.round((transKg / 1000) * 1000) / 1000,
    totalEmissionsTons: Math.round((totalKg / 1000) * 1000) / 1000,
    materialPercent: totalKg > 0 ? Math.round((matKg / totalKg) * 100) : 50,
    transportPercent: totalKg > 0 ? Math.round((transKg / totalKg) * 100) : 50,
  };
}
