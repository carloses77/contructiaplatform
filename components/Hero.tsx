
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const aiDemos = [
    {
      title: "Análisis Documental",
      status: "Gemini analizando certificado...",
      result: "Certificado válido - Subida automática a Obralia",
      confidence: "98.5%",
      icon: "ri-file-text-line",
      color: "blue"
    },
    {
      title: "Predicción de Riesgos",
      status: "Evaluando factores de proyecto...",
      result: "Riesgo medio detectado - Retraso probable 5 días",
      confidence: "94.2%",
      icon: "ri-alert-line",
      color: "orange"
    },
    {
      title: "Optimización de Costos",
      status: "Gemini optimizando presupuesto...",
      result: "Ahorro potencial: €12,400 en materiales",
      confidence: "96.7%",
      icon: "ri-money-euro-circle-line",
      color: "green"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnalyzing(true);
      setTimeout(() => {
        setCurrentDemo((prev) => (prev + 1) % aiDemos.length);
        setIsAnalyzing(false);
      }, 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentAIDemo = aiDemos[currentDemo];

  return (
    <section id="inicio" className="relative min-h-screen bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://ai.google.dev/static/images/share.jpg" 
                  alt="Google Gemini"
                  className="w-10 h-10 rounded-lg"
                />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Powered by Gemini AI
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-gray-900">Gestión</span><br/>
                <span className="text-gray-900">Documental</span><br/>
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Inteligente</span><br/>
                <span className="text-gray-900">para Construcción</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-xl">
                La primera plataforma que usa <strong>Gemini AI de Google</strong> para automatizar completamente 
                la gestión documental en construcción. Análisis predictivo, optimización automática y decisiones inteligentes.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <i className="ri-brain-line text-white text-sm"></i>
                </div>
                <span className="text-sm font-medium text-gray-700">Gemini AI en tiempo real</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">2.4s</div>
                  <div className="text-xs text-gray-600">Análisis documento</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">99.5%</div>
                  <div className="text-xs text-gray-600">Precisión IA</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">85%</div>
                  <div className="text-xs text-gray-600">Tiempo ahorrado</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all whitespace-nowrap cursor-pointer text-center shadow-lg">
                <i className="ri-rocket-line mr-2"></i>
                Probar Gemini AI Gratis
              </Link>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer shadow-lg">
                Ver Demo IA
              </button>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <i className="ri-check-line text-green-600"></i>
                Sin tarjeta de crédito
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-brain-line text-blue-600"></i>
                IA incluida desde día 1
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-time-line text-green-600"></i>
                Configuración en 5 minutos
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img 
                      src="https://ai.google.dev/static/images/share.jpg"
                      alt="Gemini"
                      className="w-6 h-6 rounded"
                    />
                    <h3 className="text-lg font-semibold text-gray-900">Gemini AI en Acción</h3>
                  </div>
                  <span className="text-sm text-blue-600 font-medium animate-pulse">
                    {isAnalyzing ? "Analizando..." : "Completado"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className={`flex items-center gap-3 p-4 rounded-xl border-l-4 transition-all duration-500 ${
                    currentAIDemo.color === 'blue' ? 'bg-blue-50 border-blue-400' :
                    currentAIDemo.color === 'orange' ? 'bg-orange-50 border-orange-400' :
                    'bg-green-50 border-green-400'
                  }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      isAnalyzing ? 'animate-spin' : 'animate-bounce'
                    } ${
                      currentAIDemo.color === 'blue' ? 'bg-blue-100' :
                      currentAIDemo.color === 'orange' ? 'bg-orange-100' :
                      'bg-green-100'
                    }`}>
                      <i className={`${currentAIDemo.icon} text-xl ${
                        currentAIDemo.color === 'blue' ? 'text-blue-600' :
                        currentAIDemo.color === 'orange' ? 'text-orange-600' :
                        'text-green-600'
                      }`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{currentAIDemo.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {isAnalyzing ? currentAIDemo.status : currentAIDemo.result}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">Confianza: {currentAIDemo.confidence}</span>
                        {!isAnalyzing && (
                          <i className="ri-check-double-line text-green-500"></i>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <i className="ri-brain-line text-white text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Capacidades Avanzadas</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                          <span>• Análisis multimodal</span>
                          <span>• Predicción de riesgos</span>
                          <span>• Optimización automática</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Documentos procesados hoy: 1,247</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Gemini AI Activo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
