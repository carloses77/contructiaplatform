'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ActivityLog {
  id: string;
  timestamp: string;
  activity_type: string;
  description: string;
  ip_address: string;
  user_agent: string;
  location: string;
  status: string;
  details?: any;
}

export default function ClientActivityLogs() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [activityStats, setActivityStats] = useState<any>({});
  const [hourlyActivity, setHourlyActivity] = useState<any[]>([]);

  useEffect(() => {
    loadActivityLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterType, filterDate, activityLogs]);

  const loadActivityLogs = async () => {
    try {
      setLoading(true);

      // Simular datos de actividad del cliente
      const mockLogs: ActivityLog[] = [
        {
          id: 'log_001',
          timestamp: '2024-02-28T14:30:22.000Z',
          activity_type: 'login',
          description: 'Inicio de sesión exitoso',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Madrid, España',
          status: 'success'
        },
        {
          id: 'log_002',
          timestamp: '2024-02-28T14:32:15.000Z',
          activity_type: 'document_upload',
          description: 'Subida de documento: Plano_Estructural_Torre_A.pdf',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Madrid, España',
          status: 'success',
          details: { file_size: '2.4MB', file_type: 'pdf' }
        },
        {
          id: 'log_003',
          timestamp: '2024-02-28T14:35:42.000Z',
          activity_type: 'ai_analysis',
          description: 'Análisis IA completado para documento estructural',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Madrid, España',
          status: 'success',
          details: { tokens_used: 45, analysis_time: '3.2s' }
        },
        {
          id: 'log_004',
          timestamp: '2024-02-28T15:12:18.000Z',
          activity_type: 'token_purchase',
          description: 'Compra de paquete Premium - 5,000 tokens',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Madrid, España',
          status: 'success',
          details: { amount: 55.00, payment_method: 'card' }
        },
        {
          id: 'log_005',
          timestamp: '2024-02-28T16:45:33.000Z',
          activity_type: 'logout',
          description: 'Cierre de sesión',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Madrid, España',
          status: 'success'
        },
        {
          id: 'log_006',
          timestamp: '2024-02-27T09:15:45.000Z',
          activity_type: 'login',
          description: 'Inicio de sesión exitoso',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Madrid, España',
          status: 'success'
        },
        {
          id: 'log_007',
          timestamp: '2024-02-27T09:22:12.000Z',
          activity_type: 'document_search',
          description: 'Búsqueda IA: "certificados de calidad hormigón"',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Madrid, España',
          status: 'success',
          details: { results_found: 12, tokens_used: 8 }
        },
        {
          id: 'log_008',
          timestamp: '2024-02-27T10:30:28.000Z',
          activity_type: 'report_generation',
          description: 'Generación automática de reporte de proyecto',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Madrid, España',
          status: 'success',
          details: { project_id: 'proj_001', tokens_used: 32 }
        },
        {
          id: 'log_009',
          timestamp: '2024-02-26T13:45:17.000Z',
          activity_type: 'failed_login',
          description: 'Intento de inicio de sesión fallido - contraseña incorrecta',
          ip_address: '203.45.67.89',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Barcelona, España',
          status: 'failed'
        },
        {
          id: 'log_010',
          timestamp: '2024-02-26T13:47:22.000Z',
          activity_type: 'login',
          description: 'Inicio de sesión exitoso después de reset de contraseña',
          ip_address: '203.45.67.89',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Barcelona, España',
          status: 'success'
        }
      ];

      setActivityLogs(mockLogs);

      // Estadísticas de actividad
      setActivityStats({
        total_sessions: 8,
        documents_uploaded: 5,
        ai_analyses: 12,
        searches_performed: 23,
        reports_generated: 4,
        avg_session_duration: 42, // minutos
        most_active_hour: '14:00',
        security_alerts: 1
      });

      // Datos de actividad por horas
      const mockHourlyData = [
        { hour: '09:00', activities: 3 },
        { hour: '10:00', activities: 2 },
        { hour: '11:00', activities: 1 },
        { hour: '12:00', activities: 0 },
        { hour: '13:00', activities: 4 },
        { hour: '14:00', activities: 8 },
        { hour: '15:00', activities: 5 },
        { hour: '16:00', activities: 3 },
        { hour: '17:00', activities: 2 },
        { hour: '18:00', activities: 1 }
      ];
      setHourlyActivity(mockHourlyData);

    } catch (error) {
      console.error('Error cargando logs de actividad:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activityLogs];

    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.activity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.activity_type === filterType);
    }

    // Filtro por fecha
    const now = new Date();
    if (filterDate !== 'all') {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        switch (filterDate) {
          case 'today':
            return logDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return logDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return logDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredLogs(filtered);
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      login: 'ri-login-circle-line',
      logout: 'ri-logout-circle-line',
      document_upload: 'ri-upload-2-line',
      ai_analysis: 'ri-brain-line',
      document_search: 'ri-search-2-line',
      token_purchase: 'ri-coin-line',
      report_generation: 'ri-file-chart-line',
      failed_login: 'ri-error-warning-line',
      security_alert: 'ri-shield-warning-line'
    };
    return icons[type as keyof typeof icons] || 'ri-information-line';
  };

  const getActivityColor = (type: string, status: string) => {
    if (status === 'failed') return 'text-red-600 bg-red-100';
    
    const colors = {
      login: 'text-green-600 bg-green-100',
      logout: 'text-gray-600 bg-gray-100',
      document_upload: 'text-blue-600 bg-blue-100',
      ai_analysis: 'text-purple-600 bg-purple-100',
      document_search: 'text-orange-600 bg-orange-100',
      token_purchase: 'text-yellow-600 bg-yellow-100',
      report_generation: 'text-indigo-600 bg-indigo-100',
      security_alert: 'text-red-600 bg-red-100'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando logs de actividad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Logs de Actividad</h2>
          <p className="text-gray-600 mt-1">Registro completo de tu actividad en la plataforma</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm text-gray-600">Sesiones Hoy</div>
            <div className="text-xl font-bold text-green-600">{activityStats.total_sessions}</div>
          </div>
        </div>
      </div>

      {/* Estadísticas de Actividad */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-green-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{activityStats.avg_session_duration}min</div>
              <div className="text-sm text-gray-600">Duración Promedio</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">Por sesión</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-upload-2-line text-blue-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{activityStats.documents_uploaded}</div>
              <div className="text-sm text-gray-600">Documentos Subidos</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">Este mes</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-brain-line text-purple-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{activityStats.ai_analyses}</div>
              <div className="text-sm text-gray-600">Análisis IA</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">Completados</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-search-2-line text-orange-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{activityStats.searches_performed}</div>
              <div className="text-sm text-gray-600">Búsquedas IA</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">Realizadas</div>
        </div>
      </div>

      {/* Gráfico de Actividad por Horas */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Actividad por Horas</h3>
            <p className="text-sm text-gray-600">Distribución de tu actividad durante el día</p>
          </div>
          <div className="text-sm text-gray-500">
            Hora más activa: <span className="font-semibold text-blue-600">{activityStats.most_active_hour}</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Bar dataKey="activities" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Buscar actividades..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Actividad</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
            >
              <option value="all">Todos</option>
              <option value="login">Inicios de Sesión</option>
              <option value="document_upload">Subida de Documentos</option>
              <option value="ai_analysis">Análisis IA</option>
              <option value="document_search">Búsquedas</option>
              <option value="token_purchase">Compras</option>
              <option value="report_generation">Reportes</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periodo</label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
            >
              <option value="all">Todo</option>
              <option value="today">Hoy</option>
              <option value="week">Última Semana</option>
              <option value="month">Último Mes</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={loadActivityLogs}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-refresh-line mr-2"></i>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Logs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Registro de Actividades ({filteredLogs.length})
            </h3>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-download-line mr-2"></i>
              Exportar CSV
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(log.activity_type, log.status)}`}>
                  <i className={`${getActivityIcon(log.activity_type)} text-lg`}></i>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{log.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status === 'success' ? 'Exitoso' : 'Fallido'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <i className="ri-computer-line mr-2"></i>
                      <span>IP: {log.ip_address}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-map-pin-line mr-2"></i>
                      <span>{log.location}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-smartphone-line mr-2"></i>
                      <span>
                        {log.user_agent.includes('Windows') ? 'Windows' : 
                         log.user_agent.includes('Mac') ? 'macOS' : 
                         log.user_agent.includes('Android') ? 'Android' : 'Móvil'}
                      </span>
                    </div>
                  </div>
                  
                  {log.details && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">
                        <strong>Detalles:</strong>
                        {log.details.tokens_used && (
                          <span className="ml-2">• Tokens usados: {log.details.tokens_used}</span>
                        )}
                        {log.details.file_size && (
                          <span className="ml-2">• Tamaño: {log.details.file_size}</span>
                        )}
                        {log.details.amount && (
                          <span className="ml-2">• Importe: €{log.details.amount}</span>
                        )}
                        {log.details.results_found && (
                          <span className="ml-2">• Resultados: {log.details.results_found}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredLogs.length === 0 && (
            <div className="p-12 text-center">
              <i className="ri-history-line text-4xl text-gray-300 mb-4"></i>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No se encontraron actividades</h4>
              <p className="text-gray-600">Prueba cambiando los filtros o el término de búsqueda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Alertas de Seguridad */}
      {activityStats.security_alerts > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-shield-warning-line text-2xl text-red-600"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Alertas de Seguridad</h3>
              <p className="text-sm text-gray-700 mb-4">
                Se detectó {activityStats.security_alerts} intento de acceso fallido desde una ubicación diferente.
                Revisa tu actividad reciente y considera cambiar tu contraseña si no fuiste tú.
              </p>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-shield-check-line mr-2"></i>
                Revisar Seguridad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}