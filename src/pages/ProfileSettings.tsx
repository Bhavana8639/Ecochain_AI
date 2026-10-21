import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Building, Target, Bell, Settings, Save, Shield, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfileSettings: React.FC = () => {
  const { userProfile, updateProfileData, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(userProfile?.displayName || '');
  const [company, setCompany] = useState(userProfile?.companyName || '');
  const [role, setRole] = useState(userProfile?.role || '');
  const [targetReduction, setTargetReduction] = useState(userProfile?.targetReductionPercent || 30);
  const [netZeroYear, setNetZeroYear] = useState(userProfile?.netZeroTargetYear || 2030);
  const [threshold, setThreshold] = useState(userProfile?.highEmissionThresholdTons || 15);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.displayName || '');
      setCompany(userProfile.companyName || '');
      setRole(userProfile.role || '');
      setTargetReduction(userProfile.targetReductionPercent || 30);
      setNetZeroYear(userProfile.netZeroTargetYear || 2030);
      setThreshold(userProfile.highEmissionThresholdTons || 15);
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile) return;
    setIsSaving(true);
    try {
      await updateProfileData({
        displayName: name,
        companyName: company,
        role,
        targetReductionPercent: Number(targetReduction),
        netZeroTargetYear: Number(netZeroYear),
        highEmissionThresholdTons: Number(threshold)
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Profile & Platform Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your enterprise profile, decarbonization targets, and alert configurations.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm overflow-hidden">
        {/* Card Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 h-20 relative">
          <div className="absolute bottom-0 translate-y-1/2 left-6">
            <div className="w-14 h-14 rounded-2xl border-4 border-white dark:border-slate-800 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl font-extrabold text-white shadow-xl">
              {name.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        <div className="pt-10 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-500" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-500" />
                Organization / Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Job Role / Position
              </label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Decarbonization Targets Panel */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-3">
          <Target className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Net-Zero Decarbonization Targets
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Emission Reduction Target (%)
            </label>
            <input
              type="number"
              value={targetReduction}
              onChange={e => setTargetReduction(Number(e.target.value))}
              min={0} max={100}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Target % reduction vs baseline</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Net-Zero Target Year
            </label>
            <input
              type="number"
              value={netZeroYear}
              onChange={e => setNetZeroYear(Number(e.target.value))}
              min={2025} max={2050}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">e.g. 2030, 2035, 2050</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              High Emission Alert Threshold (tCO₂e)
            </label>
            <input
              type="number"
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              min={1}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Flag records exceeding this value</p>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/60 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-3">
          <Settings className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Appearance & Platform Settings
          </h3>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            Color Theme
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                theme === 'light'
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className="w-4 h-4" />
              Light Mode
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-700 border-emerald-500 text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark Mode
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60">
        <button
          onClick={logout}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl text-rose-600 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          Log Out
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

    </div>
  );
};
