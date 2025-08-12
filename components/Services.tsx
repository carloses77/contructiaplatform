
'use client';

export default function Services() {
  const services = [
    {
      title: "Análisis IA de Documentos",
      description: "La inteligencia artificial analiza automáticamente planos, contratos y documentos técnicos para extraer información clave.",
      icon: "ri-brain-line",
      image: "https://readdy.ai/api/search-image?query=Construction%20worker%20using%20smartphone%20to%20upload%20construction%20documents%20on%20construction%20site%2C%20hard%20hat%20safety%20equipment%2C%20civil%20engineering%20paperwork%20management%2C%20construction%20administrative%20work%20with%20mobile%20technology%2C%20realistic%20construction%20industry%20documentation&width=400&height=300&seq=service-ai-upload-001&orientation=landscape"
    },
    {
      title: "Gestión de Proyectos",
      description: "Organiza todos los documentos por proyecto de construcción con clasificación automática y seguimiento de progreso.",
      icon: "ri-building-line",
      image: "https://readdy.ai/api/search-image?query=Heavy%20construction%20machinery%20excavator%20and%20bulldozer%20working%20on%20civil%20engineering%20project%2C%20construction%20site%20with%20multiple%20heavy%20equipment%2C%20realistic%20construction%20vehicles%20and%20earth%20moving%20equipment%2C%20professional%20construction%20industry%20scene&width=400&height=300&seq=service-machinery-001&orientation=landscape"
    },
    {
      title: "Control de Versiones Avanzado",
      description: "Sistema inteligente que detecta cambios en planos y documentos técnicos, manteniendo un historial completo de revisiones.",
      icon: "ri-git-branch-line",
      image: "https://readdy.ai/api/search-image?query=Construction%20site%20supervisors%20and%20engineers%20reviewing%20construction%20plans%20with%20tablets%20and%20smartphones%2C%20civil%20engineering%20project%20management%2C%20construction%20workers%20in%20hard%20hats%20using%20mobile%20devices%20for%20documentation%2C%20realistic%20construction%20industry%20scene&width=400&height=300&seq=service-versions-001&orientation=landscape"
    },
    {
      title: "Búsqueda Semántica",
      description: "Encuentra documentos usando lenguaje natural. La IA comprende el contexto y encuentra información específica de construcción.",
      icon: "ri-search-2-line",
      image: "https://readdy.ai/api/search-image?query=Construction%20administrative%20office%20workers%20using%20computers%20for%20document%20management%2C%20office%20employees%20in%20construction%20company%20managing%20digital%20files%2C%20professional%20construction%20administration%20workplace%20with%20modern%20technology%2C%20realistic%20office%20environment&width=400&height=300&seq=service-search-001&orientation=landscape"
    },
    {
      title: "Colaboración Inteligente",
      description: "Facilita la colaboración entre plataformas y contratistas con herramientas de IA para mejorar la gestión documental.",
      icon: "ri-team-line",
      image: "https://readdy.ai/api/search-image?query=Construction%20team%20collaboration%20with%20engineers%20architects%20and%20contractors%20on%20construction%20site%2C%20diverse%20construction%20professionals%20working%20together%20with%20mobile%20devices%20and%20tablets%2C%20realistic%20construction%20industry%20teamwork%20scene%20with%20hard%20hats%20and%20safety%20equipment&width=400&height=300&seq=service-collaboration-001&orientation=landscape"
    },
    {
      title: "Reportes Automatizados",
      description: "Genera reportes inteligentes de progreso, cumplimiento normativo y análisis predictivo para proyectos de construcción.",
      icon: "ri-file-chart-line",
      image: "https://readdy.ai/api/search-image?query=Construction%20crane%20and%20heavy%20machinery%20working%20on%20large%20civil%20engineering%20project%2C%20tower%20cranes%20and%20construction%20equipment%20on%20building%20site%2C%20realistic%20construction%20industry%20with%20heavy%20equipment%20and%20ongoing%20construction%20work%2C%20professional%20construction%20scene&width=400&height=300&seq=service-reports-001&orientation=landscape"
    }
  ];

  return (
    <section id="servicios" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Funcionalidades IA Avanzadas
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Tecnología de inteligencia artificial aplicada a la gestión documental de construcción
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100">
              <div className="h-48 bg-cover bg-center bg-top relative" style={{backgroundImage: `url(${service.image})`}}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <i className={`${service.icon} text-2xl text-green-600`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
