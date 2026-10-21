import Papa from 'papaparse';
import { Supplier, EmissionRecord } from '../types';

/**
 * Downloads data as a CSV file in the browser
 */
function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSuppliersCSV(suppliers: Supplier[]) {
  const formattedData = suppliers.map(s => ({
    'Supplier ID': s.id,
    'Supplier Code': s.code,
    'Supplier Name': s.name,
    'Category': s.category,
    'Tier Level': s.tier,
    'Country': s.country,
    'Contact Email': s.contactEmail,
    'Status': s.status,
    'Carbon Risk Level': s.riskLevel,
    'Total Scope 3 Emissions (tCO2e)': s.totalEmissionsTons,
    'Last Audit Date': s.lastAuditDate || 'N/A',
  }));

  const csv = Papa.unparse(formattedData);
  downloadCSV(csv, `EcoChain_Suppliers_${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportEmissionsCSV(emissions: EmissionRecord[]) {
  const formattedData = emissions.map(e => ({
    'Record ID': e.id,
    'Date': e.date,
    'Supplier Name': e.supplierName,
    'Material Category': e.materialCategory,
    'Scope 3 Category': e.category,
    'Quantity (kg)': e.quantityKg,
    'Weight (Tons)': e.weightTons,
    'Transport Mode': e.transportMode,
    'Distance (km)': e.distanceKm,
    'CO2 Emissions (tCO2e)': e.co2EmissionsTons,
    'Flagged High Emission': e.flaggedHighEmission ? 'Yes' : 'No',
    'Notes': e.notes || ''
  }));

  const csv = Papa.unparse(formattedData);
  downloadCSV(csv, `EcoChain_Scope3_Emissions_${new Date().toISOString().slice(0, 10)}.csv`);
}
