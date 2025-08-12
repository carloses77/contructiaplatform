
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-gray-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
              <img 
                src="https://static.readdy.ai/image/a46e05e0e46521768ae523a2d6c02dff/115802210ec057f189cdb973cb3ac2b8.png" 
                alt="ConstructIA" 
                className="h-16 w-auto mb-4"
              />
            </Link>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
              La primera plataforma de gestión documental con inteligencia artificial diseñada específicamente 
              para el sector de la construcción. Revoluciona tus proyectos con tecnología de vanguardia.
            </p>
            
            {/* Powered by Gemini AI in footer */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3 w-fit">
                <img 
                  src="https://developers.google.com/static/site-assets/logo-gemini.svg"
                  alt="Gemini AI" 
                  className="h-6 w-6"
                />
                <span className="text-white text-sm font-medium">Powered by Gemini AI</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <i className="ri-facebook-fill text-lg"></i>
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <i className="ri-twitter-fill text-lg"></i>
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <i className="ri-linkedin-fill text-lg"></i>
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <i className="ri-instagram-fill text-lg"></i>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Funcionalidades IA</h3>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors">Análisis Inteligente</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors">Búsqueda Semántica</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors">Análisis Predictivo</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors">Automatización</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors">Reportes IA</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Empresa</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Carreras</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Soporte</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-500 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            2024 ConstructIA. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/aviso-legal" className="text-gray-400 hover:text-white transition-colors">Aviso Legal</Link>
            <Link href="/terminos-uso" className="text-gray-400 hover:text-white transition-colors">Términos de Uso</Link>
            <Link href="/politica-privacidad" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</Link>
            <Link href="/politica-cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
            {/* Escudo del administrador en el footer */}
            <Link 
              href="/admin" 
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors cursor-pointer"
              title="Panel de Administración"
            >
              <i className="ri-shield-check-line text-lg"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
