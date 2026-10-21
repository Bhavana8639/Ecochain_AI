import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { exportScope3PDFReport } from '../services/pdfService';
import { exportEmissionsCSV, exportSuppliersCSV } from '../services/csvService';
import { FileSpreadsheet, FileText, Download, Calendar, Factory, Users, TrendingDown, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { UserProfile } from '../types';

export const Reports: React.FC = () => {
  const { suppliers, emissions, insights, totalScope3Emissions, totalSuppliersCount } = useData();
  const { userProfile } = useAuth();

  const handleExportPDF = () => {
    const profileToUse: UserProfile = userProfile || {
      uid: 'demo-user-sme-123',
      email: 'alex.morgan@greentech.io',
      displayName: 'Alex Morgan',
      companyName: 'GreenTech Solutions SME',
      role: 'Supply Chain Carbon Lead',
      targetReductionPercent: 35,
      netZeroTargetYear: 2030,
      highEmissionThresholdTons: 15,
      createdAt: new Date().toISOString()
    };
    exportScope3PDFReport(profileToUse, suppliers, emissions, insights);
  };

  const today = format(new Date(), 'MMMM d, yyyy');

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Scope 3 Reports & Export Center
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generate GHG Protocol–compliant executive reports and export emission datasets.
        </p>
      </div>

      {/* Report Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 p-6 rounded-3xl text-white border border-slate-700/80 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              GHG Protocol Scope 3 Report — Report Period
            </p>
            <h3 className="text-xl font-extrabold text-white mt-1">
              {userProfile?.companyName || 'GreenTech Solutions SME'} — Emissions Report
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Generated: {today} | Net-Zero Target: -{userProfile?.targetReductionPercent ?? 35}% by {userProfile?.netZeroTargetYear ?? 2030}
            </p>
          </div>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-extrabold rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition-all shadow-glow hover:scale-105 shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Export Executive PDF Report</span>
          </button>
        </div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          {[
            { label: 'Total CO₂e', value: `${totalScope3Emissions} tCO₂e`, icon: Factory },
            { label: 'Suppliers', value: totalSuppliersCount.toString(), icon: Users },
            { label: 'Emission Records', value: emissions.length.toString(), icon: Calendar },
            { label: 'AI Insights', value: insights.length.toString(), icon: Sparkles },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-lg font-extrabold text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* PDF Executive Report */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-800/50">
              <FileText className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                PDF Executive Report
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Full carbon audit & AI roadmap
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Professional GHG Protocol–aligned executive report including supplier risk register, emissions tables, carbon reduction roadmap from EcoChain AI, and carbon savings estimates.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Supplier Register', 'Emissions Log', 'AI Roadmap', 'Executive Summary'].map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={handleExportPDF}
            className="w-full py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF Report
          </button>
        </div>

        {/* Emissions CSV */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/50">
              <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Scope 3 Emissions CSV
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {emissions.length} records · Full data
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Complete Scope 3 emissions log with CO₂e calculations, supplier details, transport mode, distances, material categories, and high-emission flags.
          </p>
          <div className="flex flex-wrap gap-2">
            {['CO₂e Data', 'Supplier Names', 'Transport Mode', 'Date Range'].map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => exportEmissionsCSV(emissions)}
            className="w-full py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Emissions CSV
          </button>
        </div>

        {/* Suppliers CSV */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800/50">
              <Users className="w-6 h-6 text-teal-500" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Supplier Risk Register CSV
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {suppliers.length} suppliers · Full register
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Complete supplier directory with Tier classification, carbon risk ratings, audit status, total CO₂e contributions, and contact details for ESG disclosure.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Tier Level', 'Carbon Risk', 'Audit Status', 'Total CO₂e'].map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => exportSuppliersCSV(suppliers)}
            className="w-full py-2.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Supplier CSV
          </button>
        </div>

      </div>
    </div>
  );
};
