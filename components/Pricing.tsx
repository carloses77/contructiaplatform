
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import CheckoutFlow from './CheckoutFlow';

export default function Pricing() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedTokens, setSelectedTokens] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Establecer marcador de cliente para evitar errores de hidratación
    setIsClient(true);

    // Validar si el usuario está logueado
    const clientId = localStorage.getItem('constructia_client_id');
    setIsLoggedIn(!!clientId);
  }, []);

  // Función segura de formateo numérico para evitar errores de hidratación
  const formatNumber = (num: number): string => {
    if (!isClient) {
      return num.toString(); // Servidor devuelve formato simple
    }
    return num.toLocaleString('es-ES'); // Cliente devuelve formato formateado
  };

  const subscriptionPlans = [
    {
      id: 'starter',
      name: 'Plan Starter',
      price: 89,
      currency: 'EUR',
      interval: 'monthly' as const,
      features: [
        '500 documentos mensuales',
        'Análisis IA básico',
        '2 proyectos activos',
        'Almacenamiento 5GB',
        'Soporte por email',
        'Búsqueda simple',
        '1,000 tokens incluidos'
      ],
      token_allowance: 1000,
      storage_gb: 5,
      api_calls: 2000,
      popular: false
    },
    {
      id: 'professional',
      name: 'Plan Profesional',
      price: 149,
      currency: 'EUR',
      interval: 'monthly' as const,
      features: [
        '2,000 documentos mensuales',
        'Análisis IA avanzado',
        '5 proyectos activos',
        'Almacenamiento 20GB',
        'Soporte prioritario',
        'Búsqueda semántica',
        'Control de versiones',
        '3,000 tokens incluidos',
        'Plantillas personalizadas'
      ],
      token_allowance: 3000,
      storage_gb: 20,
      api_calls: 5000,
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Plan Enterprise',
      price: 249,
      currency: 'EUR',
      interval: 'monthly' as const,
      features: [
        '5,000 documentos mensuales',
        'IA predictiva completa',
        '10 proyectos activos',
        'Almacenamiento 50GB',
        '3 usuarios incluidos',
        'Colaboración en tiempo real',
        'Reportes automáticos',
        '5,000 tokens incluidos',
        'Integraciones básicas',
        'Dashboard personalizado'
      ],
      token_allowance: 5000,
      storage_gb: 50,
      api_calls: 10000,
      popular: false
    },
    {
      id: 'business',
      name: 'Plan Business',
      price: 499,
      currency: 'EUR',
      interval: 'monthly' as const,
      features: [
        'Documentos ilimitados',
        'Suite IA empresarial',
        'Proyectos ilimitados',
        'Almacenamiento 200GB',
        'Usuarios ilimitados',
        'API personalizada',
        'Cumplimiento normativo',
        '15,000 tokens incluidos',
        'Gestor de cuenta dedicado',
        'Formación personalizada',
        'SLA garantizado',
        'Backup automático'
      ],
      token_allowance: 15000,
      storage_gb: 200,
      api_calls: 999999,
      popular: false
    }
  ];

  // Paquetes de tokens para clientes registrados
  const tokenPackages = [
    {
      id: 'tokens-basic',
      name: 'Paquete Básico',
      tokens: 1000,
      bonus_tokens: 100,
      storage_gb: 2,
      price: 25,
      currency: 'EUR',
      description: 'Ideal para proyectos pequeños',
      features: [
        '1,000 tokens de procesamiento IA',
        '100 tokens bonus',
        '2GB almacenamiento adicional',
        '500 llamadas API',
        'Válido por 6 meses'
      ]
    },
    {
      id: 'tokens-standard',
      name: 'Paquete Estándar',
      tokens: 2500,
      bonus_tokens: 350,
      storage_gb: 5,
      price: 35,
      currency: 'EUR',
      description: 'Perfecto para múltiples proyectos',
      features: [
        '2,500 tokens de procesamiento IA',
        '350 tokens bonus',
        '5GB almacenamiento adicional',
        '1,200 llamadas API',
        'Válido por 8 meses',
        'Análisis OCR incluido'
      ],
      popular: true
    },
    {
      id: 'tokens-premium',
      name: 'Paquete Premium',
      tokens: 5000,
      bonus_tokens: 1000,
      storage_gb: 10,
      price: 55,
      currency: 'EUR',
      description: 'Máxima potencia para profesionales',
      features: [
        '5,000 tokens de procesamiento IA',
        '1,000 tokens bonus',
        '10GB almacenamiento adicional',
        '2,500 llamadas API',
        'Válido por 12 meses',
        'Análisis predictivo avanzado',
        'Soporte prioritario'
      ]
    }
  ];

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setSelectedTokens(null);
    setShowCheckout(true);
  };

  const handleSelectTokens = (tokens: any) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setSelectedTokens(tokens);
    setSelectedPlan(null);
    setShowCheckout(true);
  };

  const LoginModal = () => (
    showLoginModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-lock-line text-2xl text-orange-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2"> Cuenta Requerida</h3>
            <p className="text-gray-600">
              Para comprar paquetes de tokens necesitas tener una cuenta activa en ConstructIA.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer whitespace-nowrap"
              onClick={() => setShowLoginModal(false)}
            >
              <i className="ri-login-circle-line mr-2"></i>
              Iniciar Sesión
            </Link>

            <button
              onClick={() => {
                setShowLoginModal(false);
                // Disparar el modal de registro
                const registerBtn = document.querySelector('[data-register-btn') as HTMLButtonElement;
                if (registerBtn) registerBtn.click();
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer whitespace-nowrap"
            >
              <i className="ri-user-add-line mr-2"></i>
              Crear Cuenta Gratis
            </button>
          </div>

          <button
            onClick={() => setShowLoginModal(false)}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  );

  return (
    <>
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planes que se Adaptan a tu Empresa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde autónomos hasta grandes empresas, tenemos la solución perfecta
            </p>
          </div>

          {/* Suscripciones Mensuales */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              💼 Planes de Suscripción Mensual
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
                    plan.popular ? 'ring-2 ring-green-500 scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-green-500 text-white text-center py-2 text-sm font-semibold">
                      🔥 Más Popular
                    </div>
                  )}

                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-green-600">€{plan.price}</span>
                      <span className="text-gray-600 text-sm">/mes</span>
                    </div>

                    <ul className="space-y-2 mb-6 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <i className="ri-check-line text-green-500 mt-0.5 mr-2 text-sm"></i>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors text-sm whitespace-nowrap cursor-pointer ${
                        plan.popular
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <i className="ri-rocket-line mr-2"></i>
                      Comenzar ahora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divisor visual */}
          <div className="relative mb-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">O compra tokens sin suscripción</span>
            </div>
          </div>

          {/* Paquetes de Tokens para Clientes Registrados */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                🎯 Paquetes de Tokens - Solo para Clientes Registrados
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Compra tokens adicionales sin compromiso mensual. Perfectos para proyectos específicos y uso ocasional.
              </p>
              <div className="inline-flex items-center mt-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <i className="ri-information-line text-blue-600 mr-2"></i>
                <span className="text-blue-700 text-sm font-medium">
                  {isLoggedIn ? '✅ Cuenta activa - Puedes comprar' : '🔐 Requiere cuenta activa para comprar'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tokenPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all relative ${
                    pkg.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                  } ${!isLoggedIn ? 'opacity-75' : ''}`}
                >
                  {!isLoggedIn && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-20 rounded-2xl flex items-center justify-center">
                      <div className="bg-white rounded-xl p-4 text-center">
                        <i className="ri-lock-line text-2xl text-gray-600 mb-2"></i>
                        <p className="text-sm font-medium text-gray-700">Cuenta requerida</p>
                      </div>
                    </div>
                  )}

                  {pkg.popular && (
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-semibold rounded-lg mb-4">
                      ⭐ Mejor Valor
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-purple-600">€{pkg.price}</span>
                      <span className="text-gray-600 ml-2 text-sm">pago único</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <i className="ri-check-line text-purple-500 mt-0.5 mr-3"></i>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-purple-900" suppressHydrationWarning={true}>
                          {formatNumber(pkg.tokens)}
                        </div>
                        <div className="text-xs text-purple-600">Tokens Base</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">+{pkg.bonus_tokens}</div>
                        <div className="text-xs text-green-600">Tokens Bonus</div>
                      </div>
                    </div>
                    <div className="text-center mt-3 pt-3 border-t border-purple-200">
                      <div className="text-xl font-bold text-gray-900" suppressHydrationWarning={true}>
                        {formatNumber(pkg.tokens + pkg.bonus_tokens)} tokens total
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectTokens(pkg)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    <i className={`${isLoggedIn ? 'ri-shopping-cart-line' : 'ri-lock-line'} mr-2`}></i>
                    {isLoggedIn ? 'Comprar Tokens' : 'Login Requerido'}
                  </button>

                  <div className="text-center mt-4">
                    <span className="text-xs text-gray-500">
                      * Solo disponible para clientes con cuenta activa
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Beneficios y Garantías */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-shield-check-line text-3xl text-green-600"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Pago 100% Seguro</h4>
                <p className="text-gray-600 text-sm">Procesamos pagos con las máximas medidas de seguridad</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-refund-line text-3xl text-blue-600"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Garantía 30 días</h4>
                <p className="text-gray-600 text-sm">Si no quedas satisfecho, te devolvemos tu dinero</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-customer-service-line text-3xl text-purple-600"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Soporte experto</h4>
                <p className="text-gray-600 text-sm">Te ayudamos a configurar y optimizar tu cuenta</p>
              </div>
            </div>
          </div>

          {/* Nota importante sobre tokens */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <i className="ri-lightbulb-line text-yellow-600 text-xl mt-1"></i>
              <div>
                <h4 className="font-bold text-yellow-900 mb-2">💡 ¿Cuándo comprar tokens adicionales?</h4>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• Cuando necesites procesar documentos extra fuera de tu plan mensual</li>
                  <li>• Para proyectos específicos con alta demanda de análisis IA</li>
                  <li>• Como respaldo para evitar interrupciones en tu trabajo</li>
                  <li>• Los tokens no caducan durante su período de validez</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Login Requerido */}
      <LoginModal />

      {/* Checkout Flow */}
      <CheckoutFlow
        isOpen={showCheckout}
        onClose={() => {
          setShowCheckout(false);
          setSelectedPlan(null);
          setSelectedTokens(null);
        }}
        selectedPlan={selectedPlan}
        selectedTokens={selectedTokens}
      />

      {/* Botón oculto para disparar registro desde el modal */}
      <button
        data-register-btn
        onClick={() => {
          const event = new CustomEvent('openRegistration');
          window.dispatchEvent(event);
        }}
        className="hidden"
      />
    </>
  );
}
