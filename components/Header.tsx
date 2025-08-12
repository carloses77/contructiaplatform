
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      <header className="bg-white shadow-sm fixed w-full top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
              <img 
                src="https://static.readdy.ai/image/a46e05e0e46521768ae523a2d6c02dff/115802210ec057f189cdb973cb3ac2b8.png" 
                alt="ConstructIA" 
                className="h-20 w-auto"
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                Funciones
              </Link>
              <Link href="/#pricing" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                Precios
              </Link>
              <Link href="/#testimonials" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                Testimonios
              </Link>
              <Link href="/#contact" className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                Contacto
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Link 
                href="/clients"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Panel Cliente
              </Link>
              <Link 
                href="/registro-exitoso"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Registro
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
