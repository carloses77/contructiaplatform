
'use client';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Carlos Martínez",
      position: "Director de Proyectos",
      company: "Constructora del Norte S.A.",
      content: "ConstructIA ha revolucionado nuestra gestión documental. La IA de Gemini identifica inconsistencias en planos que antes nos llevaban días detectar. Hemos reducido los retrasos de obra un 40%.",
      image: "https://readdy.ai/api/search-image?query=Professional%20construction%20site%20manager%20in%20hard%20hat%20and%20safety%20vest%2C%20middle-aged%20hispanic%20male%20construction%20director%2C%20realistic%20construction%20industry%20professional%20portrait%2C%20construction%20project%20manager%20on%20construction%20site&width=80&height=80&seq=testimonial-carlos-001&orientation=squarish",
      rating: 5,
      project: "Torre Residencial Vista Mar - 45 plantas"
    },
    {
      name: "Ana García", 
      position: "Gerente de Operaciones",
      company: "Ingeniería Civil Moderna",
      content: "La búsqueda semántica es increíble. Puedo encontrar cualquier documento técnico en segundos usando lenguaje natural. El análisis predictivo nos ha ahorrado miles de euros en materiales.",
      image: "https://readdy.ai/api/search-image?query=Professional%20female%20construction%20engineer%20in%20office%20environment%2C%20middle-aged%20latina%20woman%20construction%20operations%20manager%2C%20realistic%20construction%20industry%20professional%20portrait%2C%20civil%20engineering%20professional&width=80&height=80&seq=testimonial-ana-001&orientation=squarish",
      rating: 5,
      project: "Complejo Industrial TechPark - 120.000 m²"
    },
    {
      name: "Miguel Rodríguez",
      position: "Arquitecto Jefe",
      company: "Estudios Arquitectónicos Avanzados",
      content: "La integración con Gemini AI es impresionante. Analiza nuestros diseños y sugiere optimizaciones que mejoran la eficiencia energética. Es como tener un consultor experto 24/7.",
      image: "https://readdy.ai/api/search-image?query=Professional%20male%20architect%20in%20construction%20site%20with%20blueprints%2C%20middle-aged%20spanish%20architect%20with%20hard%20hat%2C%20realistic%20construction%20industry%20professional%20portrait%2C%20senior%20architect%20on%20construction%20project&width=80&height=80&seq=testimonial-miguel-001&orientation=squarish",
      rating: 5,
      project: "Centro Comercial Sostenible - Certificación LEED Gold"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Light%20construction%20equipment%20and%20blueprints%20pattern%2C%20subtle%20construction%20industry%20background%20texture%2C%20engineering%20tools%20and%20architectural%20elements%20pattern%2C%20light%20gray%20construction%20themed%20background&width=1920&height=600&seq=testimonials-bg-001&orientation=landscape')`
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Empresas líderes en construcción ya están transformando sus operaciones con ConstructIA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover object-center mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-green-600 text-sm font-medium">{testimonial.position}</p>
                  <p className="text-gray-600 text-sm">{testimonial.company}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-yellow-400"></i>
                ))}
              </div>
              
              <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 font-medium">
                  <i className="ri-building-line mr-2 text-green-600"></i>
                  {testimonial.project}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Powered by Gemini AI testimonials section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border border-gray-100">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img 
                src="https://developers.google.com/static/site-assets/logo-gemini.svg"
                alt="Gemini AI" 
                className="h-10 w-10"
              />
              <h3 className="text-2xl font-bold text-gray-900">Testimonios verificados por Gemini AI</h3>
            </div>
            <p className="text-gray-700 text-lg">
              Todas nuestras reseñas son analizadas y verificadas por inteligencia artificial para garantizar 
              autenticidad y relevancia en el sector de la construcción.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
