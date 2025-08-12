
'use client';

export default function Benefits() {
  const benefits = [
    {
      title: "Ahorro de Tiempo",
      description: "Reduce hasta un 85% el tiempo dedicado a gestión documental con automatización IA",
      percentage: "85%",
      icon: "ri-time-line",
      color: "text-green-600"
    },
    {
      title: "Precisión Mejorada",
      description: "Elimina errores humanos con verificación automática y análisis predictivo avanzado",
      percentage: "99.5%",
      icon: "ri-target-line",
      color: "text-blue-600"
    },
    {
      title: "ROI Demostrado",
      description: "Nuestros clientes recuperan la inversión en menos de 4 meses de uso",
      percentage: "300%",
      icon: "ri-line-chart-line",
      color: "text-purple-600"
    },
    {
      title: "Satisfacción Cliente",
      description: "Mejora la comunicación y entrega de proyectos con reportes automáticos",
      percentage: "24/7",
      icon: "ri-customer-service-line",
      color: "text-orange-600"
    }
  ];

  return (
    <section id="empresa" className="py-16 bg-gray-900 relative overflow-hidden">
      {/* Construction background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Construction%20site%20at%20sunset%20with%20heavy%20machinery%20silhouettes%2C%20construction%20cranes%20and%20equipment%20against%20evening%20sky%2C%20civil%20engineering%20project%20backdrop%2C%20construction%20industry%20panoramic%20view%20with%20equipment%20silhouettes&width=1920&height=800&seq=benefits-bg-001&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-gray-900/95"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
            Sobre ConstructIA
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
            Somos la primera plataforma de IA especializada en construcción, combinando 
            experiencia sectorial con tecnología de vanguardia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-white">Nuestra Misión</h3>
            <p className="text-gray-200 text-lg leading-relaxed mb-6">
              Revolucionar la gestión documental en construcción mediante inteligencia artificial, 
              permitiendo que los profesionales se enfoquen en lo que realmente importa: 
              construir el futuro.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                <span className="text-gray-200">Fundada en 2023 por expertos en construcción e IA</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                <span className="text-gray-200">+500 empresas confían en nuestra tecnología</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                <span className="text-gray-200">Certificados ISO 27001 y SOC 2 Type II</span>
              </div>
            </div>
            
            {/* Gemini AI integration highlight */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://developers.google.com/static/site-assets/logo-gemini.svg"
                  alt="Gemini AI" 
                  className="h-6 w-6"
                />
                <span className="text-white font-medium">Impulsado por Gemini AI de Google</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="grid grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-700/80 rounded-lg flex items-center justify-center border border-gray-600/50">
                    <i className={`${benefit.icon} text-xl ${benefit.color}`}></i>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1 drop-shadow-md">{benefit.percentage}</div>
                  <div className="text-sm text-gray-300 font-medium">{benefit.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
          {/* Background image for CTA */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20construction%20site%20with%20workers%20in%20hard%20hats%20using%20tablets%20and%20smartphones%20for%20digital%20documentation%2C%20construction%20team%20collaboration%20with%20mobile%20technology%2C%20realistic%20construction%20industry%20digital%20transformation%20scene&width=800&height=400&seq=cta-bg-001&orientation=landscape')`
            }}
          ></div>
          
          <div className="relative">
            <h3 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">¿Listo para Transformar tu Gestión Documental?</h3>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
              Únete a las empresas líderes que ya están aprovechando el poder de la IA 
              para optimizar sus procesos de construcción
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer flex-1 shadow-lg">
                Prueba Gratuita
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer flex-1 shadow-lg">
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
