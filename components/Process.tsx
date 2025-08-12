
'use client';

export default function Process() {
  const steps = [
    {
      number: "01",
      title: "Configuración Inicial",
      description: "Nuestro equipo de expertos configura la plataforma según las necesidades específicas de tu empresa constructora en solo 2-3 días.",
      duration: "2-3 días",
      icon: "ri-settings-3-line",
      image: "https://readdy.ai/api/search-image?query=Construction%20company%20office%20setup%20with%20computers%20and%20digital%20systems%2C%20professional%20construction%20administrative%20workplace%20being%20configured%2C%20modern%20construction%20company%20office%20environment%20with%20technology%20setup%2C%20realistic%20construction%20business%20office&width=400&height=300&seq=process-setup-001&orientation=landscape"
    },
    {
      number: "02", 
      title: "Migración de Datos",
      description: "Importamos todos tus documentos existentes y los organizamos automáticamente usando IA. Procesamos miles de documentos de forma segura.",
      duration: "1-2 semanas",
      icon: "ri-upload-cloud-2-line",
      image: "https://readdy.ai/api/search-image?query=Construction%20workers%20and%20administrative%20staff%20uploading%20documents%20with%20smartphones%20and%20tablets%20on%20construction%20site%2C%20construction%20employees%20using%20mobile%20devices%20for%20document%20management%2C%20realistic%20construction%20industry%20digital%20documentation%20process&width=400&height=300&seq=process-migration-001&orientation=landscape"
    },
    {
      number: "03",
      title: "Capacitación del Equipo", 
      description: "Formamos a tu equipo para aprovechar al máximo todas las funcionalidades de IA. Incluye sesiones prácticas y soporte personalizado.",
      duration: "1 semana",
      icon: "ri-graduation-cap-line",
      image: "https://readdy.ai/api/search-image?query=Construction%20team%20training%20session%20with%20engineers%20and%20workers%20learning%20digital%20tools%2C%20construction%20professionals%20in%20meeting%20room%20with%20laptops%20and%20projector%2C%20construction%20company%20training%20environment%20with%20employees%20in%20hard%20hats%2C%20realistic%20construction%20education%20scene&width=400&height=300&seq=process-training-001&orientation=landscape"
    }
  ];

  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Background construction pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Dark%20construction%20blueprint%20pattern%20with%20engineering%20drawings%20and%20technical%20schematics%2C%20construction%20industry%20background%20with%20architectural%20plans%2C%20civil%20engineering%20blueprints%20texture%2C%20dark%20construction%20themed%20background%20pattern&width=1920&height=800&seq=process-bg-001&orientation=landscape')`
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proceso de Implementación
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Implementamos ConstructIA en tu empresa de forma rápida y sin interrupciones en tus operaciones
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <span className="text-6xl font-bold text-green-400 mr-6">{step.number}</span>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <div className="flex items-center space-x-2">
                      <i className={`${step.icon} text-green-400 text-xl`}></i>
                      <span className="text-green-400 font-semibold">{step.duration}</span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  {step.description}
                </p>
                
                {/* Timeline indicator */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-400">Inicio</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-700 rounded">
                    <div className="h-1 bg-green-400 rounded" style={{width: `${(index + 1) * 33.33}%`}}></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-400">Completado</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="relative">
                  <div 
                    className="h-80 rounded-2xl bg-cover bg-center shadow-2xl"
                    style={{backgroundImage: `url(${step.image})`}}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-green-600 text-white p-4 rounded-xl shadow-lg">
                    <i className={`${step.icon} text-2xl`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gemini AI Attribution */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <img 
              src="https://developers.google.com/static/site-assets/logo-gemini.svg"
              alt="Gemini AI" 
              className="h-8 w-8"
            />
            <span className="text-white font-medium">Proceso optimizado con Gemini AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
