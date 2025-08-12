
'use client';

import { useState, Suspense } from 'react';
import DashboardHeader from './DashboardHeader';
import ClientDashboard from './ClientDashboard';
import ProjectsOverview from './ProjectsOverview';
import DocumentsPanel from './DocumentsPanel';
import AIInsights from './AIInsights';
import TokensPurchase from './TokensPurchase';
import FinancialModule from './FinancialModule';
import ClientActivityLogs from './ClientActivityLogs';

function ClientPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeModule, setActiveModule] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <nav className="w-60 space-y-1 flex-shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-dashboard-2-line mr-2"></i>
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-building-2-line mr-2"></i>
              Mis Proyectos
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-folder-line mr-2"></i>
              Gestión de Documentos
            </button>

            <button
              onClick={() => setActiveTab('ai-insights')}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'ai-insights'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-brain-line mr-2"></i>
              Análisis IA
            </button>

            <button
              onClick={() => setActiveTab('financial')}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'financial'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-money-euro-circle-line mr-2"></i>
              Gestión Financiera
            </button>

            <button
              onClick={() => setActiveTab('tokens')}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'tokens'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-coin-line mr-2"></i>
              Comprar Tokens
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-history-line mr-2"></i>
              Registro de Actividad
            </button>
          </nav>

          <div className="flex-1 min-w-0">
            {activeTab === 'dashboard' && <ClientDashboard />}
            {activeTab === 'projects' && <ProjectsOverview />}
            {activeTab === 'documents' && <DocumentsPanel />}
            {activeTab === 'ai-insights' && <AIInsights />}
            {activeTab === 'financial' && <FinancialModule />}
            {activeTab === 'tokens' && <TokensPurchase />}
            {activeTab === 'activity' && <ClientActivityLogs />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando panel del cliente...</p>
          </div>
        </div>
      }
    >
      <ClientPanel />
    </Suspense>
  );
}
