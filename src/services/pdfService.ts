import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Supplier, EmissionRecord, UserProfile, AIInsight } from '../types';

export function exportScope3PDFReport(
  profile: UserProfile,
  suppliers: Supplier[],
  emissions: EmissionRecord[],
  insights: AIInsight[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate high level KPIs
  const totalEmissions = emissions.reduce((sum, e) => sum + e.co2EmissionsTons, 0);
  const totalSuppliers = suppliers.length;
  const highEmitters = suppliers.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Critical').length;
  const targetYear = profile.netZeroTargetYear || 2030;
  const reductionTarget = profile.targetReductionPercent || 30;

  // Header Styling (Dark Emerald background band)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Title
  doc.setTextColor(34, 197, 94); // emerald-500
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('EcoChain AI', 14, 18);

  doc.setTextColor(248, 250, 252);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Scope 3 GHG Emissions & Decarbonization Report', 14, 27);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on: ${today} | Organization: ${profile.companyName || 'SME Enterprise'}`, 14, 35);

  // Executive Summary Card Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Carbon Accounting Summary', 14, 52);

  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 56, pageWidth - 28, 30, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  // Column 1: Total Emissions
  doc.text('Total Scope 3 Emissions', 22, 66);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74); // green
  doc.text(`${totalEmissions.toFixed(2)} tCO₂e`, 22, 76);

  // Column 2: Total Suppliers
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Active Suppliers', 80, 66);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${totalSuppliers} (${highEmitters} High Risk)`, 80, 76);

  // Column 3: Decarbonization Goal
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Decarbonization Goal', 148, 66);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136); // teal
  doc.text(`-${reductionTarget}% by ${targetYear}`, 148, 76);

  // Table 1: High Carbon Suppliers Breakdown
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Supplier Decarbonization & Risk Register', 14, 98);

  const supplierRows = suppliers.map(s => [
    s.code,
    s.name,
    s.category,
    s.tier,
    s.country,
    s.riskLevel,
    `${s.totalEmissionsTons.toFixed(2)} tCO₂e`
  ]);

  autoTable(doc, {
    startY: 102,
    head: [['Supplier Code', 'Company Name', 'Category', 'Tier', 'Country', 'Risk', 'Emissions']],
    body: supplierRows,
    theme: 'grid',
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // Table 2: Recent Emissions Log
  // Safely extract finalY from jspdf-autotable plugin
  const finalY = (doc as any).lastAutoTable?.finalY ?? 160;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. Scope 3 Emissions Log', 14, finalY + 12);

  const emissionRows = emissions.slice(0, 15).map(e => [
    e.date,
    e.supplierName,
    e.materialCategory,
    e.transportMode,
    `${e.weightTons} T`,
    `${e.distanceKm} km`,
    `${e.co2EmissionsTons.toFixed(2)} tCO₂e`
  ]);

  autoTable(doc, {
    startY: finalY + 16,
    head: [['Date', 'Supplier', 'Material', 'Transport', 'Weight', 'Distance', 'CO₂e Tons']],
    body: emissionRows,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5
    }
  });

  // AI Recommendation Section on Next Page or Bottom
  doc.addPage();

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74);
  doc.text('4. EcoChain AI Carbon Reduction Roadmap', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('AI-generated recommendations tailored for SME supply chain optimization:', 14, 26);

  let insightY = 34;
  insights.forEach((insight, index) => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, insightY, pageWidth - 28, 38, 2, 2, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${index + 1}. ${insight.title} [Impact: ${insight.impact}]`, 18, insightY + 8);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitText = doc.splitTextToSize(insight.description, pageWidth - 36);
    doc.text(splitText, 18, insightY + 15);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 163, 74);
    doc.text(`Estimated Potential Reduction: ${insight.potentialSavingsTons} tCO₂e | Est. Cost Savings: $${insight.potentialCostSavingsUSD?.toLocaleString() || 'N/A'}`, 18, insightY + 32);

    insightY += 44;
  });

  // Footer for all pages
  const pageCount = typeof (doc as any).getNumberOfPages === 'function'
    ? (doc as any).getNumberOfPages()
    : ((doc as any).internal?.getNumberOfPages ? (doc as any).internal.getNumberOfPages() : 1);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`EcoChain AI Scope 3 Tracking Platform | Confidential | Page ${i} of ${pageCount}`, 14, 288);
  }

  // Trigger Save PDF
  const filename = `EcoChain_Scope3_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
