import { EmissionRecord, Supplier, AIInsight } from '../types';

export function generateAIInsights(emissions: EmissionRecord[], suppliers: Supplier[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // Check air freight usage
  const airFreightEmissions = emissions.filter(e => e.transportMode === 'Air Freight');
  if (airFreightEmissions.length > 0) {
    const totalAirTons = airFreightEmissions.reduce((acc, curr) => acc + curr.co2EmissionsTons, 0);
    insights.push({
      id: 'ai-air-freight-opt',
      title: 'Modal Shift: Transition Air Freight to Sea/Rail Logistics',
      category: 'Route Optimization',
      impact: 'High',
      potentialSavingsTons: Math.round(totalAirTons * 0.72 * 10) / 10,
      potentialCostSavingsUSD: Math.round(airFreightEmissions.length * 4200),
      description: `Air freight accounts for ${totalAirTons.toFixed(2)} tCO₂e across ${airFreightEmissions.length} shipments. Switching urgent logistics to sea container or rail freight can reduce transportation emissions by up to 80%.`,
      actionableSteps: [
        'Identify non-critical inventory buffer stock to shift to 14-day sea shipping schedules.',
        'Negotiate bulk rail freight contracts for regional land-based supplier routes.',
        'Set an internal company policy requiring executive approval for air freight shipments exceeding 500 kg.'
      ]
    });
  }

  // Check high emitting suppliers
  const highEmitters = suppliers.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Critical');
  if (highEmitters.length > 0) {
    const topSupplier = highEmitters[0];
    insights.push({
      id: 'ai-supplier-engagement',
      title: `Supplier Engagement: Target Carbon Audit for ${topSupplier.name}`,
      category: 'Supplier Switch',
      impact: 'High',
      potentialSavingsTons: Math.round(topSupplier.totalEmissionsTons * 0.35 * 10) / 10,
      potentialCostSavingsUSD: 12500,
      description: `${topSupplier.name} (${topSupplier.tier}) accounts for ${topSupplier.totalEmissionsTons.toFixed(2)} tCO₂e. Implementing supplier decarbonization benchmarks or requesting renewable power documentation can yield immediate reductions.`,
      actionableSteps: [
        `Send standard CDP Scope 3 disclosure request to ${topSupplier.contactEmail}.`,
        'Incentivize top suppliers with longer-term contracts in exchange for ISO 14064 carbon reduction verification.',
        'Review alternative Tier 1/2 regional suppliers with verified lower carbon intensity.'
      ]
    });
  }

  // Check high-carbon material substitution (Steel / Aluminum / Plastics)
  const steelEmissions = emissions.filter(e => e.materialCategory === 'Raw Steel' || e.materialCategory === 'Aluminum');
  if (steelEmissions.length > 0) {
    const totalMetalsTons = steelEmissions.reduce((acc, curr) => acc + curr.co2EmissionsTons, 0);
    insights.push({
      id: 'ai-material-sub',
      title: 'Material Substitution: Incorporate Recycled Aluminum & Green Steel',
      category: 'Material Substitution',
      impact: 'Medium',
      potentialSavingsTons: Math.round(totalMetalsTons * 0.45 * 10) / 10,
      potentialCostSavingsUSD: 8400,
      description: `Primary metal procurement contributed ${totalMetalsTons.toFixed(2)} tCO₂e. Procuring post-consumer recycled metals or electric arc furnace (EAF) steel significantly slashes Scope 3 Category 1 emissions.`,
      actionableSteps: [
        'Request Material Declaration Sheets (MDS) containing recycled content percentages.',
        'Specify minimum 60% recycled content requirement in upcoming procurement RFPs.',
        'Explore bio-based polymer alternatives for plastic packaging components.'
      ]
    });
  }

  // Regionalization / Nearshoring recommendation
  const longDistanceShipments = emissions.filter(e => e.distanceKm > 1500);
  if (longDistanceShipments.length > 0) {
    insights.push({
      id: 'ai-nearshoring',
      title: 'Supply Chain Regionalization & Route Optimization',
      category: 'Efficiency Improvement',
      impact: 'Medium',
      potentialSavingsTons: 48.5,
      potentialCostSavingsUSD: 18000,
      description: `${longDistanceShipments.length} long-haul shipments (>1,500 km) were recorded. Consolidation of regional distribution hubs reduces total ton-kilometers traveled.`,
      actionableSteps: [
        'Consolidate smaller LTL (Less-than-Truckload) shipments into weekly FTL (Full-Truckload) freight schedules.',
        'Evaluate nearshoring strategic suppliers to shorten shipping distances by 40%.',
        'Deploy route optimization software for last-mile logistics.'
      ]
    });
  }

  return insights;
}
