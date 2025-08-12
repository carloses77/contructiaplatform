
'use client';

import { useState, useEffect } from 'react';
import { generateProjectReport } from '@/lib/gemini';

export default function ProjectsOverview() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Torre Residencial Central",
      status: "En Progreso",
      progress: 65,
      documents: 127,
      lastUpdate: "Hace 2 horas",
      aiInsights: 3,
      risk: "Bajo",
      image: "https://readdy.ai/api/search-image?query=Modern%20residential%20tower%20under%20construction%20with%20green%20and%20gray%20color%20scheme%2C%20contemporary%20architecture%20building%20project%2C%20construction%20site%20with%20cranes%20and%20progress%20visualization%2C%20professional%20construction%20photography&width=300&height=200&seq=project-tower-001&orientation=landscape"
    },
    {
      id: 2,
      name: "Complejo Comercial Vista",
      status: "Planificación",
      progress: 25,
      documents: 89,
      lastUpdate: "Hace 1 día",
      aiInsights: 5,
      risk: "Medio",
      image: "https://readdy.ai/api/search-image?query=Commercial%20complex%20architectural%20planning%20with%20modern%20design%2C%20shopping%20center%20construction%20project%2C%20green%20and%20gray%20professional%20visualization%2C%20commercial%20building%20development&width=300&height=200&seq=project-commercial-001&orientation=landscape"
    },
    {
      id: 3,
      name: "Oficinas Corporativas Norte",
      status: "Finalizado",
      progress: 100,
      documents: 234,
      lastUpdate: "Hace 1 semana",
      aiInsights: 1,
      risk: "Sin Riesgo",
      image: "https://readdy.ai/api/search-image?query=Completed%20corporate%20office%20building%20with%20modern%20facade%2C%20finished%20construction%20project%2C%20professional%20architectural%20photography%2C%20green%20and%20gray%20contemporary%20design%2C%20business%20building%20exterior&width=300&height=200&seq=project-offices-001&orientation=landscape"
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [aiReport, setAiReport] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);

  const generateReport = async (project: any) => {
    setLoadingReport(true);
    try {
      const report = await generateProjectReport(project);
      setAiReport(report);
    } catch (error) {
      console.error('Error generating report:', error);
      setAiReport('Error al generar el reporte. Intenta nuevamente.');
    }
    setLoadingReport(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mis Proyectos</h2>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer">
          <i className="ri-add-line mr-2"></i>
          Nuevo Proyecto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div 
              className="h-48 bg-cover bg-center bg-top" 
              style={{backgroundImage: `url(${project.image})`}}
            ></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{project.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  project.status === 'Finalizado' ? 'bg-green-100 text-green-800' :
                  project.status === 'En Progreso' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Documentos</span>
                    <p className="font-semibold text-gray-900">{project.documents}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Insights IA</span>
                    <p className="font-semibold text-green-600">{project.aiInsights}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${
                      project.risk === 'Sin Riesgo' ? 'bg-green-500' :
                      project.risk === 'Bajo' ? 'bg-green-400' :
                      project.risk === 'Medio' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}></span>
                    <span className="text-sm text-gray-600">Riesgo {project.risk}</span>
                  </div>
                  <span className="text-xs text-gray-500">{project.lastUpdate}</span>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <button 
                    onClick={() => generateReport(project)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <i className="ri-brain-line mr-1"></i>
                    Reporte IA
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:border-green-600 hover:text-green-600 transition-colors cursor-pointer">
                    <i className="ri-eye-line mr-1"></i>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Reporte IA */}
      {(loadingReport || aiReport) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Reporte de IA - Proyecto</h3>
                <button 
                  onClick={() => setAiReport('')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              {loadingReport ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Generando reporte con IA...</p>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{aiReport}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
