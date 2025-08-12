
'use client';

import Link from 'next/link';

interface AdminHeaderProps {
  adminData: any;
}

export default function AdminHeader({ adminData }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
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
              <h1 className="text-xl font-semibold text-gray-900">Panel de Administración</h1>
              <p className="text-sm text-gray-600">Sistema de gestión avanzada</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <i className="ri-notification-3-line text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Información del Admin */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white text-sm"></i>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  {adminData?.name || 'Administrador'}
                </div>
                <div className="text-xs text-gray-600">
                  {adminData?.role || 'Super Admin'}
                </div>
              </div>
            </div>

            {/* Volver al sitio */}
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
