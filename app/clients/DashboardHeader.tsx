
'use client';

import Link from 'next/link';

export default function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
              <img 
                src="https://static.readdy.ai/image/a46e05e0e46521768ae523a2d6c02dff/115802210ec057f189cdb973cb3ac2b8.png" 
                alt="ConstructIA" 
                className="h-16 w-auto"
              />
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Panel del Cliente</h1>
              <p className="text-sm text-gray-600">Gestión inteligente de documentos</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-green-50 rounded-lg px-3 py-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white text-sm"></i>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">Juan García</div>
                <div className="text-xs text-green-600">Cliente Premium</div>
              </div>
            </div>

            <Link 
              href="/"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-home-line mr-2"></i>
              Volver al Sitio
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
