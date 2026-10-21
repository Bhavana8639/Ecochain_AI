import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { EmissionModal } from '../emissions/EmissionModal';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEmissionModalOpen, setIsEmissionModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onOpenEmissionModal={() => setIsEmissionModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Quick Add Emission Record Modal */}
      <EmissionModal
        isOpen={isEmissionModalOpen}
        onClose={() => setIsEmissionModalOpen(false)}
      />
    </div>
  );
};
