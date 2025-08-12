
'use client';

export default function Features() {
  const features = [
    {
      title: "Clasificación Automática con Gemini AI",
      description: "Identifica automáticamente el tipo de documento (certificados, facturas, planos) con 98.5% de precisión usando Gemini Pro Vision",
      icon: "ri-brain-line",
      color: "blue",
      aiFeature: true,
      demo: "Gemini analiza: Certificado de calidad hormigón → Clasificado automáticamente → Subido a Obralia sección correcta"
    },
    {
      title: "Integración Nativa con Obralia",
      description: "Conexión directa con la plataforma Obralia para subida automática de documentos clasificados por IA",
      icon: "ri-links-line", 
      color: "green",
      aiFeature: false,
      demo: "API segura → Validación automática → Subida directa → Confirmación instantánea"
    },
    {
      title: "Predicción de Riesgos con IA",
      description: "Gemini AI analiza patrones históricos para predecir posibles retrasos, sobrecostos y problemas técnicos",
      icon: "ri-alert-line",
      color: "orange", 
      aiFeature: true,
      demo: "IA detecta: Patrón climático + historial → Riesgo retraso 5 días → Alerta preventiva automática"
    },
    {
      title: "Gestión Documental Jerárquica",
      description: "Organización inteligente por cliente > empresa > proyecto con trazabilidad completa y drag & drop",
      icon: "ri-node-tree",
      color: "purple",
      aiFeature: false,
      demo: "Cliente García → Construcciones García SL → Torre Central → Documentos organizados automáticamente"
    },
    {
      title: "Análisis Multimodal Avanzado",
      description: "Gemini AI procesa texto, imágenes y PDFs simultáneamente para extraer información estructurada completa",
      icon: "ri-file-search-line",
      color: "teal",
      aiFeature: true,
      demo: "Plano + texto + imagen → Extracción datos → Validación técnica → Reporte estructurado automático"
    },
    {
      title: "Optimización Continua",
      description: "IA aprende de tus patrones de uso para optimizar workflows, reducir tiempos y mejorar precisión automáticamente",
      icon: "ri-settings-3-line",
      color: "indigo",
      aiFeature: true,
      demo: "IA aprende: Patrón uso → Optimización workflow → Tiempo procesamiento -30% → Mejora continua"
    }
  ];

  return (
    <section id="caracteristicas" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img 
              src="https://ai.google.dev/static/images/share.jpg" 
              alt="Google Gemini"
              className="w-10 h-10 rounded-lg"
            />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold">
              Impulsado por Gemini AI de Google
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Características <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Inteligentes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La primera plataforma de construcción que integra completamente <strong>Gemini AI</strong> 
            para automatizar, optimizar y predecir en tiempo real
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${
                feature.aiFeature 
                  ? 'from-blue-400/20 to-purple-400/20' 
                  : 'from-gray-400/10 to-gray-400/10'
              } rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                feature.aiFeature ? 'border-blue-100 hover:border-blue-200' : 'border-gray-100 hover:border-gray-200'
              }`}>
                {/* AI Badge */}
                {feature.aiFeature && (
                  <div className="absolute -top-3 right-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <i className="ri-brain-line"></i>
                      <span>GEMINI AI</span>
                    </div>
                  </div>
                )}

                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${
                  feature.aiFeature 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : `bg-${feature.color}-100`
                }`}>
                  <i className={`${feature.icon} text-2xl ${
                    feature.aiFeature ? 'text-white' : `text-${feature.color}-600`
                  }`}></i>
                </div>

                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Demo Flow */}
                <div className={`bg-${feature.aiFeature ? 'gradient-to-r from-blue-50 to-purple-50' : 'gray-50'} rounded-lg p-4 border ${
                  feature.aiFeature ? 'border-blue-200' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <i className={`ri-play-line text-sm ${feature.aiFeature ? 'text-blue-600' : 'text-gray-600'}`}></i>
                    <span className={`text-xs font-semibold ${feature.aiFeature ? 'text-blue-800' : 'text-gray-700'}`}>
                      {feature.aiFeature ? 'Demo IA' : 'Flujo de Trabajo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-mono">
                    {feature.demo}
                  </p>
                </div>

                {feature.aiFeature && (
                  <div className="mt-4 flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 font-medium">IA Activa</span>
                    <span className="text-gray-500">• Mejora continua</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Panel de Comparación */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Sin IA vs Con <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Gemini AI</span>
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Descubre la diferencia que hace tener Gemini AI integrado en cada proceso
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Sin IA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <i className="ri-user-line text-2xl text-red-400"></i>
                <h4 className="text-xl font-bold">Proceso Manual Tradicional</h4>
              </div>
              <ul className="space-y-3 text-red-100">
                <li className="flex items-center space-x-2">
                  <i className="ri-close-circle-line text-red-400"></i>
                  <span>Clasificación manual: 15-30 min por documento</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-close-circle-line text-red-400"></i>
                  <span>Errores humanos: 12-15% tasa de error</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-close-circle-line text-red-400"></i>
                  <span>Sin predicción de problemas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-close-circle-line text-red-400"></i>
                  <span>Optimización: depende de experiencia humana</span>
                </li>
              </ul>
            </div>

            {/* Con IA */}
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/50">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://ai.google.dev/static/images/share.jpg"
                  alt="Gemini AI"
                  className="w-8 h-8 rounded"
                />
                <h4 className="text-xl font-bold">Con Gemini AI</h4>
              </div>
              <ul className="space-y-3 text-green-100">
                <li className="flex items-center space-x-2">
                  <i className="ri-check-double-line text-green-400"></i>
                  <span>Clasificación IA: 2.3 segundos automático</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-check-double-line text-green-400"></i>
                  <span>Precisión IA: 98.5% sin errores humanos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-check-double-line text-green-400"></i>
                  <span>Predicción proactiva de riesgos y problemas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-check-double-line text-green-400"></i>
                  <span>Optimización automática y aprendizaje continuo</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 cursor-pointer">
              <i className="ri-rocket-line mr-2"></i>
              Experimenta la Diferencia IA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
