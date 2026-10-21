import React from 'react';
import { Leaf, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 px-6 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-emerald-500/10 rounded-md text-emerald-500">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            EcoChain AI Platform
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            v1.0 GHG Scope 3 Compliant
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://ghgprotocol.org/scope-3-standard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GHG Protocol Standard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>© {new Date().getFullYear()} EcoChain AI Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
