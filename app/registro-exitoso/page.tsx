
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RegistroExitoso() {
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    loadClientData();
    startCountdown();
  }, []);

  const loadClientData = async () => {
    try {
      const clientId = localStorage.getItem('constructia_temp_client_id') || 
                      localStorage.getItem('constructia_client_id');

      if (clientId) {
        const { data: client, error } = await supabase
          .from('clients')
          .select(`
            *,
            companies (*)
          `)
          .eq('id', clientId)
          .single();

        if (client && !error) {
          setClientData(client);
        }
      }
    } catch (error) {
      console.error('Error cargando datos del cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = '/dashboard';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header de éxito */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-4xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold mb-2">¡Registro Completado!</h1>
            <p className="text-green-100">Tu cuenta en ConstructIA ha sido creada exitosamente</p>
          </div>

          {/* Contenido */}
          <div className="p-8">
            {clientData && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Datos de tu cuenta:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="font-medium text-gray-900">{clientData.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium text-gray-900">{clientData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Empresa:</span>
                    <p className="font-medium text-gray-900">{clientData.company}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">ID Cliente:</span>
                    <p className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{clientData.id}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Beneficios del registro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="ri-gift-line text-2xl text-blue-600"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Prueba Gratuita</h3>
                <p className="text-sm text-gray-600">14 días de acceso completo sin costo</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="ri-cpu-line text-2xl text-purple-600"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Tokens Incluidos</h3>
                <p className="text-sm text-gray-600">{clientData?.available_tokens || 100} tokens de IA</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="ri-customer-service-line text-2xl text-green-600"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Soporte Premium</h3>
                <p className="text-sm text-gray-600">Acceso completo al soporte técnico</p>
              </div>
            </div>

            {/* Próximos pasos */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-blue-900 mb-4">Próximos pasos recomendados:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center">
                  <i className="ri-check-line text-blue-600 mr-2"></i>
                  Accede a tu panel y explora las funcionalidades
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-blue-600 mr-2"></i>
                  Configura tus credenciales de Obralia (opcional)
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-blue-600 mr-2"></i>
                  Sube tu primer documento para analisis con IA
                </li>
                <li className="flex items-center">
                  <i className="ri-check-line text-blue-600 mr-2"></i>
                  Explora los insights avanzados de Gemini AI
                </li>
              </ul>
            </div>

            {/* Información importante */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8">
              <div className="flex items-start space-x-2">
                <i className="ri-information-line text-orange-600 mt-0.5"></i>
                <div className="text-sm text-orange-700">
                  <p className="font-medium mb-1">Información importante:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Tu prueba gratuita expira el {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}</li>
                    <li>• Puedes actualizar tu plan en cualquier momento</li>
                    <li>• Todos tus datos están protegidos con cifrado SSL</li>
                    <li>• El soporte está disponible por email y chat</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-center hover:from-green-700 hover:to-blue-700 transition-all shadow-lg cursor-pointer"
              >
                <i className="ri-dashboard-line mr-2"></i>
                Ir a mi Panel Cliente
              </Link>
              <button
                onClick={() => window.location.href = '#pricing'}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-green-600 hover:text-green-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-price-tag-line mr-2"></i>
                Ver Planes de Pago
              </button>
            </div>

            {/* Contador automático */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Seras redirigido automaticamente a tu panel en:
              </p>
              <div className="text-2xl font-bold text-green-600">{countdown}s</div>
              <p className="text-xs text-gray-500 mt-2">
                O haz clic en el boton de arriba para ir inmediatamente
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda? Contacta con nuestro soporte en 
            <a href="mailto:soporte@constructia.es" className="text-blue-600 hover:text-blue-800 font-medium">
              soporte@constructia.es
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
