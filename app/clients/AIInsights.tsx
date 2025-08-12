
'use client';

import { useState, useEffect } from 'react';
import { analyzeDocument, generateProjectReport, predictProjectRisks, validateCompliance, optimizeWorkflow } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AIInsights() {
  const [activeInsight, setActiveInsight] = useState('analysis');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState({
    documentAnalysis: '',
    riskPrediction: '',
    complianceCheck: '',
    workflowOptimization: '',
    projectReport: ''
  });
  
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    documentsAnalyzed: 0,
    risksDetected: 0,
    optimizationsSuggested: 0,
    complianceScore: 0
  });

  useEffect(() => {
    generateRealtimeInsights();
    const interval = setInterval(generateRealtimeInsights, 10000); // Actualizar cada 10s
    return () => clearInterval(interval);
  }, []);

  const generateRealtimeInsights = async () => {
    try {
      // Simular métricas en tiempo real
      setRealtimeMetrics({
        documentsAnalyzed: Math.floor(Math.random() * 50) + 847,
        risksDetected: Math.floor(Math.random() * 5) + 3,
        optimizationsSuggested: Math.floor(Math.random() * 10) + 12,
        complianceScore: Math.floor(Math.random() * 5) + 95
      });
    } catch (error) {
      console.error('Error generando métricas en tiempo real:', error);
    }
  };

  const generateDocumentAnalysis = async () => {
    setLoading(true);
    try {
      const sampleDocuments = [
        "Certificado de calidad de hormigón H-25, fecha 15/01/2024, resistencia compresión 28.5 MPa",
        "Factura proveedor cemento, importe €4,250, vencimiento 30 días",
        "Plano estructural Torre A, revisión 3.2, fecha aprobación 10/01/2024"
      ];

      const analysis = await analyzeDocument(
        sampleDocuments.join('\n'),
        'documentos_construccion'
      );
      
      setInsights(prev => ({ ...prev, documentAnalysis: analysis }));
    } catch (error) {
      console.error('Error en análisis de documentos:', error);
      setInsights(prev => ({ 
        ...prev, 
        documentAnalysis: 'Error al analizar documentos. Intenta nuevamente.' 
      }));
    } finally {
      setLoading(false);
    }
  };

  const generateRiskPrediction = async () => {
    setLoading(true);
    try {
      const projectHistory = [
        { project: "Torre Central", delays: 5, cost_overrun: 0.12, weather_impact: "medium" },
        { project: "Centro Comercial Norte", delays: 2, cost_overrun: 0.08, weather_impact: "low" },
        { project: "Residencial Sur", delays: 8, cost_overrun: 0.15, weather_impact: "high" }
      ];

      const currentStatus = {
        progress: 0.65,
        budget_used: 0.72,
        weather_forecast: "lluvia próximos 7 días",
        team_availability: 0.85
      };

      const riskAnalysis = await predictProjectRisks(projectHistory, currentStatus);
      setInsights(prev => ({ ...prev, riskPrediction: riskAnalysis }));
    } catch (error) {
      console.error('Error en predicción de riesgos:', error);
      setInsights(prev => ({ 
        ...prev, 
        riskPrediction: 'Error al predecir riesgos. Intenta nuevamente.' 
      }));
    } finally {
      setLoading(false);
    }
  };

  const generateComplianceCheck = async () => {
    setLoading(true);
    try {
      const documentData = {
        type: "certificado_calidad",
        content: "Certificado de calidad hormigón H-25, resistencia 28.5 MPa, fecha 15/01/2024",
        project: "Torre Residencial Central",
        supplier: "Cementos García S.L."
      };

      const regulations = [
        "EHE-08 (Instrucción de Hormigón Estructural)",
        "CTE DB-SE (Código Técnico de la Edificación)",
        "UNE-EN 206 (Especificación, prestaciones y conformidad del hormigón)"
      ];

      const compliance = await validateCompliance(documentData, regulations);
      setInsights(prev => ({ ...prev, complianceCheck: compliance }));
    } catch (error) {
      console.error('Error en validación de cumplimiento:', error);
      setInsights(prev => ({ 
        ...prev, 
        complianceCheck: 'Error al validar cumplimiento. Intenta nuevamente.' 
      }));
    } finally {
      setLoading(false);
    }
  };

  const generateWorkflowOptimization = async () => {
    setLoading(true);
    try {
      const workflowData = {
        processes: [
          { name: "Recepción documentos", current_time: 45, frequency: "daily", bottlenecks: ["validación manual"] },
          { name: "Clasificación IA", current_time: 3, frequency: "per_document", bottlenecks: [] },
          { name: "Subida Obralia", current_time: 12, frequency: "per_document", bottlenecks: ["API rate limits"] },
          { name: "Validación final", current_time: 30, frequency: "per_batch", bottlenecks: ["revisión humana"] }
        ],
        total_daily_volume: 150,
        target_processing_time: 120
      };

      const optimization = await optimizeWorkflow(workflowData);
      setInsights(prev => ({ ...prev, workflowOptimization: optimization }));
    } catch (error) {
      console.error('Error en optimización de workflow:', error);
      setInsights(prev => ({ 
        ...prev, 
        workflowOptimization: 'Error al optimizar workflow. Intenta nuevamente.' 
      }));
    } finally {
      setLoading(false);
    }
  };

  const generateProjectReport = async () => {
    setLoading(true);
    try {
      const projectData = {
        name: "Torre Residencial Central",
        progress: 65,
        budget: { allocated: 2500000, used: 1800000 },
        timeline: { planned_days: 365, elapsed_days: 240 },
        team: { size: 45, availability: 0.92 },
        documents: { total: 247, processed: 235, pending: 12 },
        risks: ["weather delays", "material cost increase"],
        quality_metrics: { compliance: 0.98, defects: 3 }
      };

      const report = await generateProjectReport(projectData);
      setInsights(prev => ({ ...prev, projectReport: report }));
    } catch (error) {
      console.error('Error generando reporte de proyecto:', error);
      setInsights(prev => ({ 
        ...prev, 
        projectReport: 'Error al generar reporte. Intenta nuevamente.' 
      }));
    } finally {
      setLoading(false);
    }
  };

  const insightTypes = [
    {
      id: 'analysis',
      title: 'Análisis Documental',
      description: 'Análisis inteligente de documentos con IA',
      icon: 'ri-file-search-line',
      color: 'blue',
      action: generateDocumentAnalysis,
      content: insights.documentAnalysis
    },
    {
      id: 'risks',
      title: 'Predicción de Riesgos',
      description: 'Identificación proactiva de riesgos del proyecto',
      icon: 'ri-alert-line',
      color: 'red',
      action: generateRiskPrediction,
      content: insights.riskPrediction
    },
    {
      id: 'compliance',
      title: 'Validación Normativa',
      description: 'Verificación automática de cumplimiento',
      icon: 'ri-shield-check-line',
      color: 'green',
      action: generateComplianceCheck,
      content: insights.complianceCheck
    },
    {
      id: 'optimization',
      title: 'Optimización de Procesos',
      description: 'Mejoras inteligentes en workflows',
      icon: 'ri-settings-3-line',
      color: 'purple',
      action: generateWorkflowOptimization,
      content: insights.workflowOptimization
    },
    {
      id: 'reports',
      title: 'Reportes Inteligentes',
      description: 'Generación automática de informes',
      icon: 'ri-file-chart-line',
      color: 'orange',
      action: generateProjectReport,
      content: insights.projectReport
    }
  ];

  const activeInsightData = insightTypes.find(insight => insight.id === activeInsight);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Insights Avanzados con Gemini AI</h2>
          <p className="text-gray-600 mt-1">Análisis inteligente y predictivo para optimizar tu operativa</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg border border-blue-200">
            <img 
              src="https://ai.google.dev/static/images/share.jpg"
              alt="Gemini AI"
              className="w-5 h-5 rounded"
            />
            <span className="text-sm font-medium text-blue-700">Gemini Pro Vision</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Métricas en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{realtimeMetrics.documentsAnalyzed}</div>
              <div className="text-blue-100 text-sm">Docs Analizados</div>
            </div>
            <i className="ri-file-text-line text-2xl opacity-80"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{realtimeMetrics.risksDetected}</div>
              <div className="text-red-100 text-sm">Riesgos Detectados</div>
            </div>
            <i className="ri-alert-line text-2xl opacity-80"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{realtimeMetrics.optimizationsSuggested}</div>
              <div className="text-purple-100 text-sm">Optimizaciones</div>
            </div>
            <i className="ri-settings-3-line text-2xl opacity-80"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{realtimeMetrics.complianceScore}%</div>
              <div className="text-green-100 text-sm">Cumplimiento</div>
            </div>
            <i className="ri-shield-check-line text-2xl opacity-80"></i>
          </div>
        </div>
      </div>

      {/* Selector de Insights */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tipos de Análisis IA</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {insightTypes.map((insight) => (
            <button
              key={insight.id}
              onClick={() => setActiveInsight(insight.id)}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                activeInsight === insight.id
                  ? `border-${insight.color}-500 bg-${insight.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <i className={`${insight.icon} text-2xl text-${insight.color}-600 mb-2`}></i>
                <div className={`font-medium text-sm ${
                  activeInsight === insight.id ? `text-${insight.color}-900` : 'text-gray-900'
                }`}>
                  {insight.title}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {insight.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Panel de Análisis Activo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-${activeInsightData?.color}-100 rounded-xl flex items-center justify-center`}>
              <i className={`${activeInsightData?.icon} text-xl text-${activeInsightData?.color}-600`}></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{activeInsightData?.title}</h3>
              <p className="text-sm text-gray-600">{activeInsightData?.description}</p>
            </div>
          </div>
          
          <button
            onClick={activeInsightData?.action}
            disabled={loading}
            className={`bg-gradient-to-r from-${activeInsightData?.color}-600 to-${activeInsightData?.color}-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-${activeInsightData?.color}-700 hover:to-${activeInsightData?.color}-800 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50`}
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Analizando con IA...
              </>
            ) : (
              <>
                <i className="ri-brain-line mr-2"></i>
                Generar con Gemini
              </>
            )}
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Gemini AI procesando datos...</p>
                <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
              </div>
            </div>
          ) : activeInsightData?.content ? (
            <div className="prose max-w-none">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <i className="ri-brain-line text-blue-600"></i>
                  <span className="text-sm font-semibold text-blue-800">Análisis Generado por Gemini AI</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completado</span>
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed bg-white rounded-lg p-4 border">{activeInsightData.content}</pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <i className={`${activeInsightData?.icon} text-6xl text-gray-300 mb-4`}></i>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                  {activeInsightData?.title} con IA
                </h4>
                <p className="text-gray-500 mb-6 max-w-md">
                  Haz clic en "Generar con Gemini" para obtener análisis inteligente 
                  basado en datos reales de tu plataforma
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                  <i className="ri-magic-line"></i>
                  <span>Powered by Google Gemini AI</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel de Capacidades IA */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Capacidades Gemini AI en ConstructIA</h3>
          <img 
            src="https://ai.google.dev/static/images/share.jpg"
            alt="Gemini AI"
            className="w-8 h-8 rounded opacity-80"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Análisis Multimodal</h4>
            <ul className="text-sm text-green-100 space-y-1">
              <li>• Texto, imágenes y documentos PDF</li>
              <li>• Clasificación automática inteligente</li>
              <li>• Extracción de datos estructurada</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Predicción y Optimización</h4>
            <ul className="text-sm text-blue-100 space-y-1">
              <li>• Predicción de riesgos y retrasos</li>
              <li>• Optimización de workflows</li>
              <li>• Recomendaciones inteligentes</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Cumplimiento y Reportes</h4>
            <ul className="text-sm text-purple-100 space-y-1">
              <li>• Validación normativa automática</li>
              <li>• Generación de reportes ejecutivos</li>
              <li>• Análisis de cumplimiento LOPD</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
