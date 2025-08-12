'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientDashboard() {
  const [kpis, setKpis] = useState({
    documentsUploaded: 0,
    totalTimeSpent: 0,
    aiAnalysisCompleted: 0,
    activeProjects: 0,
    tokensConsumed: 0,
    complianceScore: 0
  });

  const [documentData, setDocumentData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [tokenUsageData, setTokenUsageData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simular datos KPI en tiempo real
      setKpis({
        documentsUploaded: Math.floor(Math.random() * 50) + 127,
        totalTimeSpent: Math.floor(Math.random() * 10) + 45, // horas
        aiAnalysisCompleted: Math.floor(Math.random() * 20) + 89,
        activeProjects: Math.floor(Math.random() * 3) + 8,
        tokensConsumed: Math.floor(Math.random() * 500) + 1250,
        complianceScore: Math.floor(Math.random() * 5) + 94
      });

      // Datos para gráfico de documentos por mes
      const mockDocumentData = [
        { month: 'Ene', subidos: 15, procesados: 14, pendientes: 1 },
        { month: 'Feb', subidos: 23, procesados: 20, pendientes: 3 },
        { month: 'Mar', subidos: 18, procesados: 18, pendientes: 0 },
        { month: 'Abr', subidos: 31, procesados: 28, pendientes: 3 },
        { month: 'May', subidos: 25, procesados: 24, pendientes: 1 },
        { month: 'Jun', subidos: 28, procesados: 27, pendientes: 1 }
      ];
      setDocumentData(mockDocumentData);

      // Datos de actividad diaria
      const mockActivityData = [
        { day: 'Lun', sessions: 3, duration: 45 },
        { day: 'Mar', sessions: 2, duration: 38 },
        { day: 'Mié', sessions: 4, duration: 52 },
        { day: 'Jue', sessions: 1, duration: 22 },
        { day: 'Vie', sessions: 3, duration: 41 },
        { day: 'Sáb', sessions: 2, duration: 18 },
        { day: 'Dom', sessions: 1, duration: 12 }
      ];
      setActivityData(mockActivityData);

      // Datos de consumo de tokens
      const mockTokenData = [
        { service: 'Análisis Documental', tokens: 450, percentage: 35 },
        { service: 'OCR y Extracción', tokens: 320, percentage: 25 },
        { service: 'Búsqueda IA', tokens: 180, percentage: 14 },
        { service: 'Validación Normativa', tokens: 210, percentage: 16 },
        { service: 'Reportes Automáticos', tokens: 130, percentage: 10 }
      ];
      setTokenUsageData(mockTokenData);

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido a ConstructIA!</h2>
            <p className="text-green-100">Tu asistente inteligente para gestión documental</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <i className="ri-brain-line text-2xl"></i>
              <div>
                <div className="text-sm opacity-90">Asistente IA</div>
                <div className="text-xs">Activo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Grid - 6 métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-upload-line text-2xl text-blue-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{kpis.documentsUploaded}</div>
              <div className="text-sm text-gray-600">Documentos Subidos</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-arrow-up-line text-green-500 mr-1"></i>
            <span className="text-green-600">+12% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-2xl text-purple-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{kpis.totalTimeSpent}h</div>
              <div className="text-sm text-gray-600">Tiempo en Plataforma</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-arrow-up-line text-green-500 mr-1"></i>
            <span className="text-green-600">+8% esta semana</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-brain-line text-2xl text-green-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{kpis.aiAnalysisCompleted}</div>
              <div className="text-sm text-gray-600">Análisis IA</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-arrow-up-line text-green-500 mr-1"></i>
            <span className="text-green-600">+15% este mes</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-building-2-line text-2xl text-orange-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{kpis.activeProjects}</div>
              <div className="text-sm text-gray-600">Proyectos Activos</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-subtract-line text-gray-400 mr-1"></i>
            <span className="text-gray-500">Sin cambios</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-coin-line text-2xl text-yellow-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{kpis.tokensConsumed}</div>
              <div className="text-sm text-gray-600">Tokens Consumidos</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-arrow-up-line text-green-500 mr-1"></i>
            <span className="text-green-600">+22% uso de IA</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <i className="ri-shield-check-line text-2xl text-emerald-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{kpis.complianceScore}%</div>
              <div className="text-sm text-gray-600">Cumplimiento</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-arrow-up-line text-green-500 mr-1"></i>
            <span className="text-green-600">+2% este mes</span>
          </div>
        </div>
      </div>

      {/* Gráficos Dinámicos - 3 principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Gráfico 1: Documentos por Mes */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 col-span-1 lg:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Documentos por Mes</h3>
              <p className="text-sm text-gray-600">Subidos vs Procesados</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-chart-line text-blue-600"></i>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={documentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Area
                  type="monotone"
                  dataKey="subidos"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="procesados"
                  stackId="2"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Actividad Semanal */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Actividad Semanal</h3>
              <p className="text-sm text-gray-600">Sesiones y Duración</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-bar-chart-line text-purple-600"></i>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Bar dataKey="sessions" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Uso de Tokens por Servicio */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Uso de Tokens IA</h3>
              <p className="text-sm text-gray-600">Por Servicio</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-pie-chart-line text-green-600"></i>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="tokens"
                >
                  {tokenUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {tokenUsageData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors[index] }}
                  ></div>
                  <span className="text-gray-600">{item.service}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.tokens}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel de Recomendaciones IA */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="ri-lightbulb-line text-2xl text-blue-600"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Recomendaciones IA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <i className="ri-arrow-up-line text-green-500 mr-2"></i>
                  <span className="font-medium text-gray-900">Optimización Detectada</span>
                </div>
                <p className="text-gray-600">Puedes reducir 23% el tiempo de procesamiento automatizando la validación de contratos.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <i className="ri-alert-line text-orange-500 mr-2"></i>
                  <span className="font-medium text-gray-900">Atención Requerida</span>
                </div>
                <p className="text-gray-600">3 documentos pendientes requieren validación manual para cumplimiento normativo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <i className="ri-upload-2-line text-2xl mb-2"></i>
            <div className="font-semibold">Subir Documento</div>
            <div className="text-sm opacity-90">Análisis automático</div>
          </button>
          <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <i className="ri-brain-line text-2xl mb-2"></i>
            <div className="font-semibold">Análisis IA</div>
            <div className="text-sm opacity-90">Insight inteligente</div>
          </button>
          <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
            <i className="ri-file-chart-line text-2xl mb-2"></i>
            <div className="font-semibold">Generar Reporte</div>
            <div className="text-sm opacity-90">Automático con IA</div>
          </button>
          <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer">
            <i className="ri-settings-3-line text-2xl mb-2"></i>
            <div className="font-semibold">Configurar</div>
            <div className="text-sm opacity-90">Optimizar workflow</div>
          </button>
        </div>
      </div>
    </div>
  );
}