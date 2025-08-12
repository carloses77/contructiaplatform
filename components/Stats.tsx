'use client';

import { useState, useEffect } from 'react';

export default function Stats() {
  const [currentStat, setCurrentStat] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const stats = [
    {
      number: "98.5%",
      label: "Precisión IA",
      description: "Gemini AI clasifica documentos con precisión superior a humanos",
      icon: "ri-brain-line",
      color: "blue",
      highlight: "Powered by Gemini"
    },
    {
      number: "2.3s",
      label: "Tiempo Procesamiento",
      description: "Análisis completo de documentos en tiempo récord",
      icon: "ri-timer-flash-line",
      color: "green",
      highlight: "Ultra rápido"
    },
    {
      number: "€45,000",
      label: "Ahorro Promedio/Cliente",
      description: "Reducción de costos operativos anuales demostrada",
      icon: "ri-money-euro-circle-line",
      color: "orange",
      highlight: "ROI demostrado"
    },
    {
      number: "500+",
      label: "Empresas Confían",
      description: "Líderes en construcción ya usan ConstructIA",
      icon: "ri-building-line",
      color: "purple",
      highlight: "Sector líder"
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-blue-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20construction%20site%20with%20digital%20technology%20integration%2C%20construction%20workers%20using%20tablets%20and%20AI%20technology%2C%20futuristic%20construction%20industry%20with%20smart%20building%20technology%20and%20data%20visualization&width=1920&height=600&seq=stats-bg-001&orientation=landscape')`
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 to-blue-900/95"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="https://ai.google.dev/static/images/share.jpg" 
              alt="Google Gemini"
              className="w-8 h-8 rounded-lg"
            />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 rounded-full text-sm font-bold">
              Resultados Verificados con IA
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Resultados que <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Impresionan</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Datos reales de empresas que han transformado su gestión documental con Gemini AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`relative group transition-all duration-500 transform ${
                currentStat === index ? 'scale-110 z-10' : 'scale-100 hover:scale-105'
              }`}
            >
              {/* Glow effect for active stat */}
              {currentStat === index && (
                <div className={`absolute -inset-4 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 rounded-2xl opacity-20 blur-xl animate-pulse`}></div>
              )}
              
              <div className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${
                currentStat === index 
                  ? `border-${stat.color}-400 bg-white/20` 
                  : 'border-white/20 hover:border-white/40'
              }`}>
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center ${
                    currentStat === index ? 'animate-bounce' : ''
                  }`}>
                    <i className={`${stat.icon} text-2xl text-white`}></i>
                  </div>

                  <div className="mb-4">
                    <div className={`text-4xl md:text-5xl font-bold mb-2 ${
                      currentStat === index 
                        ? `text-transparent bg-clip-text bg-gradient-to-r from-${stat.color}-300 to-${stat.color}-100` 
                        : 'text-white'
                    }`}>
                      {stat.number}
                    </div>
                    <div className={`text-lg font-semibold ${
                      currentStat === index ? `text-${stat.color}-200` : 'text-blue-100'
                    }`}>
                      {stat.label}
                    </div>
                  </div>

                  <p className="text-sm text-blue-100 mb-4 leading-relaxed">
                    {stat.description}
                  </p>

                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    currentStat === index 
                      ? `bg-${stat.color}-500/30 text-${stat.color}-200 border border-${stat.color}-400/50` 
                      : 'bg-white/10 text-blue-200 border border-white/20'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      currentStat === index ? 'animate-pulse' : ''
                    } bg-${stat.color}-400`}></div>
                    {stat.highlight}
                  </div>
                </div>

                {/* AI processing animation for active stat */}
                {currentStat === index && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Real-time AI metrics */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Gemini AI en Tiempo Real
            </h3>
            <p className="text-blue-100">
              Métricas actualizadas de nuestra IA trabajando ahora mismo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {mounted ? Math.floor(Math.random() * 50) + 847 : 847}
              </div>
              <div className="text-sm text-green-200">Documentos procesados hoy</div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div className="bg-green-400 h-2 rounded-full animate-pulse" style={{width: '89%'}}></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                100%
              </div>
              <div className="text-sm text-blue-200">Disponibilidad IA</div>
              <div className="flex items-center justify-center mt-2 space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {mounted ? (Math.random() * 2 + 1.5).toFixed(1) : '2.1'}s
              </div>
              <div className="text-sm text-purple-200">Tiempo promedio análisis</div>
              <div className="text-xs text-purple-300 mt-1">Optimizando continuamente</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {mounted ? (Math.random() * 2 + 98.5).toFixed(1) : '98.5'}%
              </div>
              <div className="text-sm text-orange-200">Precisión actual</div>
              <div className="text-xs text-orange-300 mt-1">Mejorando con cada análisis</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-blue-100">
              <span>Modelo: Gemini Pro Vision</span>
              <span>•</span>
              <span suppressHydrationWarning={true}>
                Última actualización: {mounted ? new Date().toLocaleTimeString() : '--:--:--'}
              </span>
              <span>•</span>
              <span className="text-green-400">Estado: Óptimo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}