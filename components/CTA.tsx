
'use client';

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-green-600 to-blue-700 relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Construction%20workers%20in%20hard%20hats%20using%20smartphones%20and%20tablets%20for%20digital%20documentation%20on%20modern%20construction%20site%2C%20construction%20team%20collaboration%20with%20mobile%20technology%2C%20civil%20engineering%20professionals%20with%20digital%20tools%2C%20realistic%20construction%20industry%20digital%20transformation&width=1920&height=800&seq=cta-main-001&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-blue-700/80"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Comienza tu Transformación Digital
        </h2>
        <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          Únete a más de 500 empresas constructoras que ya están revolucionando 
          su gestión documental con inteligencia artificial
        </p>

        {/* Stats highlighting construction focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold mb-2">2M+</div>
            <div className="text-green-100">Documentos de Obra Procesados</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold mb-2">85%</div>
            <div className="text-green-100">Reducción de Tiempo Administrativo</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-green-100">Análisis IA Continuo</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto mb-12">
          <button className="bg-white text-green-700 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer shadow-2xl flex-1 max-w-sm">
            <i className="ri-rocket-line mr-2"></i>
            Prueba Gratuita 30 Días
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-white hover:text-green-700 transition-colors whitespace-nowrap cursor-pointer shadow-2xl flex-1 max-w-sm">
            <i className="ri-phone-line mr-2"></i>
            Llamar Ahora: +34 900 123 456
          </button>
        </div>

        {/* Gemini AI powered indicator */}
        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img 
              src="https://developers.google.com/static/site-assets/logo-gemini.svg"
              alt="Gemini AI" 
              className="h-12 w-12"
            />
            <div className="text-left">
              <div className="text-xl font-bold">Potenciado por Gemini AI</div>
              <div className="text-green-100">La IA más avanzada para construcción</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <i className="ri-check-line text-green-300 mr-2"></i>
              <span>Análisis de planos en tiempo real</span>
            </div>
            <div className="flex items-center">
              <i className="ri-check-line text-green-300 mr-2"></i>
              <span>Detección automática de riesgos</span>
            </div>
            <div className="flex items-center">
              <i className="ri-check-line text-green-300 mr-2"></i>
              <span>Optimización predictiva de costos</span>
            </div>
            <div className="flex items-center">
              <i className="ri-check-line text-green-300 mr-2"></i>
              <span>Cumplimiento normativo automático</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
