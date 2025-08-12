
'use client';

import { useState, Suspense, useCallback, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { cleanupMemory, PerformanceMonitor } from '@/lib/performance-optimizer';

// Lazy imports for heavy components with better error boundaries
import { lazy } from 'react';

const AdminHeader = lazy(() => import('./AdminHeader'));
const KPIsDashboard = lazy(() => import('./KPIsDashboard'));
const ClientsModule = lazy(() => import('./ClientsModule'));
const AIIntegrationModule = lazy(() => import('./AIIntegrationModule'));
const ConfigurationModule = lazy(() => import('./ConfigurationModule'));
const AuditLogs = lazy(() => import('./AuditLogs'));
const DocumentQueueModule = lazy(() => import('./DocumentQueueModule'));
const AdminWorkLogs = lazy(() => import('./AdminWorkLogs'));
const FinancialModule = lazy(() => import('./FinancialModule'));
const ReportsModule = lazy(() => import('./ReportsModule'));
const DataProtectionCompliance = lazy(() => import('./DataProtectionCompliance'));
const DatabaseManagementModule = lazy(() => import('./DatabaseManagementModule'));
const MessagingModule = lazy(() => import('./MessagingModule'));
const PlatformIntegrationModule = lazy(() => import('./PlatformIntegrationModule'));

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    realtime: {
      params: {
        eventsPerSecond: 1
      }
    }
  }
);

// Enhanced loading component
const EnhancedLoading = ({ message = "Cargando..." }: { message?: string }) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-2"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  </div>
);

// Error boundary component
const ErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="ri-error-warning-line text-red-600 text-2xl"></i>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Error en el modulo</h3>
      <p className="text-gray-600 mb-4">Ha ocurrido un error inesperado</p>
      <button
        onClick={resetError}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
      >
        Reintentar
      </button>
    </div>
  </div>
);

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminData, setAdminData] = useState({ name: 'Administrador', role: 'Super Admin' });
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Enhanced audit function with better error handling
  const logAuditEvent = useCallback(async (
    action: string,
    tableName?: string,
    recordId?: string,
    oldData?: any,
    newData?: any
  ) => {
    try {
      const tempUserId = 'admin-user-temp-id';

      const auditData = {
        user_id: tempUserId,
        action,
        table_name: tableName || null,
        record_id: recordId || null,
        old_data: oldData || null,
        new_data: newData || null,
        ip_address: 'localhost',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'Admin Browser',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('audit_logs').insert(auditData);

      if (error) {
        console.warn('Audit log warning:', error.message);
        // Continue execution even if audit fails
      }
    } catch (error) {
      console.error('Error logging audit event:', error);
      // Don't throw error to prevent breaking the main flow
    }
  }, []);

  // Optimized navigation configuration with better organization
  const navigationItems = useMemo(() => [
    {
      id: 'dashboard',
      label: 'KPIs Dashboard',
      icon: 'ri-dashboard-2-line',
      component: KPIsDashboard,
      category: 'overview'
    },
    {
      id: 'clients',
      label: 'Client Management',
      icon: 'ri-user-settings-line',
      component: ClientsModule,
      category: 'management'
    },
    {
      id: 'document-queue',
      label: 'Document Queue',
      icon: 'ri-file-list-3-line',
      component: DocumentQueueModule,
      category: 'operations'
    },
    {
      id: 'work-logs',
      label: 'Work Logs',
      icon: 'ri-file-list-2-line',
      component: AdminWorkLogs,
      category: 'operations'
    },
    {
      id: 'database',
      label: 'Database Management',
      icon: 'ri-database-2-line',
      component: DatabaseManagementModule,
      category: 'technical'
    },
    {
      id: 'configuration',
      label: 'Control Center',
      icon: 'ri-settings-2-line',
      component: ConfigurationModule,
      category: 'system'
    },
    {
      id: 'ia-integration',
      label: 'AI Integration',
      icon: 'ri-brain-line',
      component: AIIntegrationModule,
      category: 'technical'
    },
    {
      id: 'messaging',
      label: 'Internal Messaging',
      icon: 'ri-mail-send-line',
      component: MessagingModule,
      category: 'communication'
    },
    {
      id: 'financial',
      label: 'Financial Module',
      icon: 'ri-money-dollar-circle-line',
      component: FinancialModule,
      category: 'business'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'ri-file-chart-line',
      component: ReportsModule,
      category: 'business'
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: 'ri-shield-check-line',
      component: AuditLogs,
      category: 'security'
    },
    {
      id: 'data-protection',
      label: 'Data Protection',
      icon: 'ri-lock-2-line',
      component: DataProtectionCompliance,
      category: 'security'
    },
    {
      id: 'integraciones',
      label: 'Integraciones',
      icon: 'ri-links-line',
      component: PlatformIntegrationModule,
      category: 'technical'
    }
  ], []);

  // Enhanced tab change handler with performance monitoring
  const handleTabChange = useCallback((tabId: string) => {
    PerformanceMonitor.startMeasurement(`tab_switch_${tabId}`);

    setActiveTab(tabId);
    setLoadingError(null);

    logAuditEvent(`navigate_${tabId}`);

    // Clean memory when switching tabs
    cleanupMemory();

    PerformanceMonitor.endMeasurement(`tab_switch_${tabId}`);
  }, [logAuditEvent]);

  // Enhanced active content rendering with error boundary
  const renderActiveContent = useCallback(() => {
    try {
      const activeItem = navigationItems.find(item => item.id === activeTab);
      if (!activeItem) {
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Modulo no encontrado</p>
          </div>
        );
      }

      const Component = activeItem.component;

      // Components that don't need logAuditEvent
      const standaloneComponents = ['audit', 'data-protection'];

      if (standaloneComponents.includes(activeTab)) {
        return <Component />;
      }

      // Components that need logAuditEvent
      return <Component logAuditEvent={logAuditEvent} />;
    } catch (error) {
      console.error('Error rendering component:', error);
      return (
        <ErrorFallback
          error={error as Error}
          resetError={() => setLoadingError(null)}
        />
      );
    }
  }, [activeTab, navigationItems, logAuditEvent]);

  // Initialize admin data
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        // Check database connection
        const { error } = await supabase.from('clients').select('id').limit(1);

        if (error) {
          console.warn('Database connection warning:', error.message);
        }

        await logAuditEvent('admin_panel_initialized');
      } catch (error) {
        console.error('Error initializing admin panel:', error);
        setLoadingError('Error de conexion con la base de datos');
      }
    };

    initializeAdmin();

    // Cleanup on unmount
    return () => {
      cleanupMemory();
    };
  }, [logAuditEvent]);

  // Group navigation items by category
  const groupedNavigationItems = useMemo(() => {
    const groups: { [key: string]: typeof navigationItems } = {};

    navigationItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    return groups;
  }, [navigationItems]);

  if (loadingError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-red-600 text-2xl"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Error de conexion</h3>
          <p className="text-gray-600 mb-4">{loadingError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
          >
            Recargar pagina
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<EnhancedLoading message="Cargando header..." />}>
        <AdminHeader adminData={adminData} />

      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Enhanced navigation with categories */}
          <nav className="w-64 space-y-1 flex-shrink-0 max-h-[calc(100vh-120px)] overflow-y-auto">
            {Object.entries(groupedNavigationItems).map(([category, items]) => (
              <div key={category} className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                  {category === 'overview' && 'Vision General'}
                  {category === 'management' && 'Gestion'}
                  {category === 'operations' && 'Operaciones'}
                  {category === 'technical' && 'Tecnico'}
                  {category === 'system' && 'Sistema'}
                  {category === 'communication' && 'Comunicacion'}
                  {category === 'business' && 'Negocio'}
                  {category === 'security' && 'Seguridad'}
                </h4>
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-sm whitespace-nowrap cursor-pointer group ${
                      activeTab === item.id
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-green-600'
                    }`}
                  >
                    <i className={`${item.icon} mr-2 ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-green-600'}`}></i>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Main content with enhanced error handling */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<EnhancedLoading message="Cargando modulo..." />}>
              <div className="bg-white rounded-xl shadow-sm min-h-[600px]">
                <div className="p-6">
                  {renderActiveContent()}
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      </div>

      {/* Performance info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-2 rounded-lg">
          <div>Modulo activo: {activeTab}</div>
          <div>Cache size: {require('@/lib/performance-optimizer').optimizedCache.size()}</div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando panel de administracion...</p>
          </div>
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}
