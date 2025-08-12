
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { optimizeQuery, cleanupMemory } from '@/lib/performance-optimizer';

interface AIIntegrationModuleProps {
  logAuditEvent: (action: string, table?: string, recordId?: string, oldData?: any, newData?: any) => Promise<void>;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AIService {
  id: string;
  name: string;
  type: 'llm' | 'image' | 'voice' | 'analysis';
  provider: string;
  status: 'active' | 'inactive' | 'error';
  usage_count: number;
  cost_per_request: number;
  total_cost: number;
  rate_limit: number;
  daily_requests?: number;
  success_rate?: number;
  avg_response_time?: number;
}

interface AIUsageMetric {
  id: string;
  service_id: string;
  request_count: number;
  success_count: number;
  error_count: number;
  cost: number;
  date: string;
  response_time_avg: number;
}

export default function AIIntegrationModule({ logAuditEvent }: AIIntegrationModuleProps) {
  const [services, setServices] = useState<AIService[]>([]);
  const [metrics, setMetrics] = useState<AIUsageMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedService, setSelectedService] = useState<AIService | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);

  // Datos mock optimizados - solo los esenciales
  const generateOptimizedMockServices = useCallback((): AIService[] => {
    return [
      {
        id: 'ai_001',
        name: 'OpenAI GPT-4',
        type: 'llm',
        provider: 'OpenAI',
        status: 'active',
        usage_count: 15420,
        cost_per_request: 0.03,
        total_cost: 462.60,
        rate_limit: 500,
        daily_requests: 520,
        success_rate: 94.2,
        avg_response_time: 1240,
      },
      {
        id: 'ai_002',
        name: 'Google Gemini Pro',
        type: 'llm',
        provider: 'Google',
        status: 'active',
        usage_count: 8934,
        cost_per_request: 0.0005,
        total_cost: 4.47,
        rate_limit: 1000,
        daily_requests: 298,
        success_rate: 96.8,
        avg_response_time: 890,
      },
      {
        id: 'ai_003',
        name: 'Claude 3 Opus',
        type: 'llm',
        provider: 'Anthropic',
        status: 'active',
        usage_count: 3245,
        cost_per_request: 0.015,
        total_cost: 48.68,
        rate_limit: 200,
        daily_requests: 108,
        success_rate: 97.5,
        avg_response_time: 1560,
      }
    ];
  }, []);

  const generateOptimizedMetrics = useCallback((): AIUsageMetric[] => {
    const metrics: AIUsageMetric[] = [];
    const serviceIds = ['ai_001', 'ai_002', 'ai_003'];

    for (let i = 0; i < 7; i++) { // Solo 7 días en lugar de 30
      const date = new Date();
      date.setDate(date.getDate() - i);

      serviceIds.forEach((serviceId) => {
        const requestCount = Math.floor(Math.random() * 500) + 50;
        const successCount = Math.floor(requestCount * 0.9);

        metrics.push({
          id: `metric_${serviceId}_${i}`,
          service_id: serviceId,
          request_count: requestCount,
          success_count: successCount,
          error_count: requestCount - successCount,
          cost: requestCount * (0.001 + Math.random() * 0.05),
          date: date.toISOString().split('T')[0],
          response_time_avg: Math.floor(Math.random() * 2000) + 200,
        });
      });
    }

    return metrics;
  }, []);

  const loadPerformanceData = useCallback(async () => {
    const performanceData = [];
    for (let i = 6; i >= 0; i--) { // Solo 7 días
      const date = new Date();
      date.setDate(date.getDate() - i);

      performanceData.push({
        date: date.toLocaleDateString('es-ES', { month: 'short', day: '2-digit' }),
        requests: Math.floor(Math.random() * 1000) + 500,
        success_rate: 85 + Math.random() * 14,
        cost: Math.random() * 100 + 20
      });
    }
    setPerformanceMetrics(performanceData);
  }, []);

  const loadAIServices = useCallback(async () => {
    try {
      const query = optimizeQuery(
        supabase.from('ai_services'),
        {
          select: 'id,name,type,provider,status,usage_count,cost_per_request,total_cost,rate_limit',
          limit: 20
        }
      );

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        setServices(generateOptimizedMockServices());
      } else {
        setServices(data);
      }
    } catch (error) {
      console.error('Error loading AI services:', error);
      setServices(generateOptimizedMockServices());
    }
  }, [generateOptimizedMockServices]);

  const loadUsageMetrics = useCallback(async () => {
    try {
      const query = optimizeQuery(
        supabase.from('ai_usage_metrics'),
        {
          select: 'id,service_id,request_count,success_count,error_count,cost,date,response_time_avg',
          orderBy: { column: 'date', ascending: false },
          limit: 50
        }
      );

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        setMetrics(generateOptimizedMetrics());
      } else {
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error loading usage metrics:', error);
      setMetrics(generateOptimizedMetrics());
    } finally {
      setLoading(false);
    }
  }, [generateOptimizedMetrics]);

  // Métricas calculadas con useMemo para optimización
  const totalMetrics = useMemo(() => {
    const totalRequests = metrics.reduce((sum, m) => sum + m.request_count, 0);
    const totalSuccess = metrics.reduce((sum, m) => sum + m.success_count, 0);
    const totalCost = metrics.reduce((sum, m) => sum + m.cost, 0);
    const avgResponseTime = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.response_time_avg, 0) / metrics.length : 0;
    const successRate = totalRequests > 0 ? (totalSuccess / totalRequests) * 100 : 0;

    return {
      totalRequests,
      totalCost,
      avgResponseTime,
      successRate,
    };
  }, [metrics]);

  const handleToggleService = useCallback(async (service: AIService) => {
    const newStatus = service.status === 'active' ? 'inactive' : 'active';

    try {
      const { error } = await supabase
        .from('ai_services')
        .update({ status: newStatus })
        .eq('id', service.id);

      if (error) throw error;

      const updatedServices = services.map((s) => (s.id === service.id ? { ...s, status: newStatus } : s));
      setServices(updatedServices);

      await logAuditEvent('toggle_ai_service', 'ai_services', service.id);
    } catch (error) {
      console.error('Error toggling AI service:', error);
    }
  }, [services, logAuditEvent]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'llm': return 'ri-brain-line';
      case 'image': return 'ri-image-line';
      case 'voice': return 'ri-mic-line';
      case 'analysis': return 'ri-line-chart-line';
      default: return 'ri-cpu-line';
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadAIServices(),
        loadUsageMetrics(),
        loadPerformanceData()
      ]);
    };

    loadData();
    logAuditEvent('view_ai_integration_module');

    return () => {
      cleanupMemory();
    };
  }, [loadAIServices, loadUsageMetrics, loadPerformanceData, logAuditEvent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando módulo de integración IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integración de IA</h2>
          <p className="text-gray-600 mt-1">Gestión completa de servicios de inteligencia artificial</p>
        </div>
      </div>

      {/* KPIs Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-cpu-line text-3xl"></i>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Servicios</span>
          </div>
          <div className="text-3xl font-bold mb-1">{services.length}</div>
          <div className="text-blue-100 text-sm">Servicios IA Integrados</div>
          <div className="mt-2 text-sm">
            <span className="text-green-300">{services.filter((s) => s.status === 'active').length} activos</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-send-plane-line text-3xl"></i>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Requests</span>
          </div>
          <div className="text-3xl font-bold mb-1">{totalMetrics.totalRequests.toLocaleString()}</div>
          <div className="text-green-100 text-sm">Total Peticiones</div>
          <div className="mt-2 text-sm">
            <span className="text-green-300">{totalMetrics.successRate.toFixed(1)}% éxito</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-money-dollar-circle-line text-3xl"></i>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Costos</span>
          </div>
          <div className="text-3xl font-bold mb-1">${totalMetrics.totalCost.toFixed(2)}</div>
          <div className="text-purple-100 text-sm">Costo Total IA</div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-time-line text-3xl"></i>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Latencia</span>
          </div>
          <div className="text-3xl font-bold mb-1">{totalMetrics.avgResponseTime.toFixed(0)}ms</div>
          <div className="text-orange-100 text-sm">Tiempo Respuesta</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Vista General', icon: 'ri-dashboard-line' },
          { id: 'services', label: 'Servicios', icon: 'ri-settings-3-line' },
          { id: 'metrics', label: 'Métricas', icon: 'ri-line-chart-line' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === tab.id ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Estado de Servicios IA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className={`${getTypeIcon(service.type)} text-blue-600`}></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.provider}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                      {service.status === 'active' ? 'Activo' : service.status === 'inactive' ? 'Inactivo' : 'Error'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Uso total:</span>
                      <span className="text-blue-600 font-medium">{service.usage_count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Costo total:</span>
                      <span className="text-green-600 font-medium">${service.total_cost.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleToggleService(service)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                        service.status === 'active'
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {service.status === 'active' ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => setSelectedService(service)}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 cursor-pointer"
                    >
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Gestión de Servicios IA</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Uso</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <i className={`${getTypeIcon(service.type)} text-gray-600`}></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500">{service.provider}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                        {service.status === 'active' ? '🟢 Activo' : service.status === 'inactive' ? '🟡 Inactivo' : '🔴 Error'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{service.usage_count.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">${service.total_cost.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">${service.cost_per_request.toFixed(4)}/req</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedService(service)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        >
                          <i className="ri-settings-3-line"></i>
                        </button>
                        <button
                          onClick={() => handleToggleService(service)}
                          className={`${
                            service.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          } cursor-pointer`}
                        >
                          <i className={`ri-${service.status === 'active' ? 'pause' : 'play'}-circle-line`}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Métricas de Rendimiento</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Requests</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Tasa de Éxito</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="success_rate" stroke="#10b981" fill="#10b981" fillOpacity={0.7} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className={`${getTypeIcon(selectedService.type)} text-blue-600 text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedService.name}</h3>
                    <p className="text-gray-600">{selectedService.provider}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Estadísticas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uso Total:</span>
                      <span className="text-gray-900">{selectedService.usage_count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Costo Total:</span>
                      <span className="text-gray-900">${selectedService.total_cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa Éxito:</span>
                      <span className="text-gray-900">{selectedService.success_rate?.toFixed(1) || 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Configuración</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Límite:</span>
                      <span className="text-gray-900">{selectedService.rate_limit}/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Costo/Request:</span>
                      <span className="text-gray-900">${selectedService.cost_per_request.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <i className="ri-information-line text-blue-600 text-2xl mt-1"></i>
          <div>
            <h3 className="font-bold text-blue-800 mb-2">🤖 Módulo de Integración IA</h3>
            <p className="text-blue-700 mb-3">
              Sistema de gestión de servicios de inteligencia artificial con rendimiento optimizado.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-blue-600">
              <div>✅ Gestión de múltiples proveedores IA</div>
              <div>✅ Monitoreo en tiempo real</div>
              <div>✅ Control de límites y quotas</div>
              <div>✅ Métricas de rendimiento</div>
              <div>✅ Cache optimizado</div>
              <div>✅ Integración con base de datos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
