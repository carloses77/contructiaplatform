
'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ObraliaCredentialsModal from './ObraliaCredentialsModal';

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (clientId: string) => void;
  selectedPlan?: any;
  selectedTokens?: any;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RegistrationForm({ 
  isOpen, 
  onClose, 
  onSuccess,
  selectedPlan,
  selectedTokens
}: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientId, setClientId] = useState<string | null>(null);
  const [showObraliaModal, setShowObraliaModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {}

    if (!formData.name.trim()) errors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) errors.email = 'El email es obligatorio';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'El email no es válido';
    if (!formData.company.trim()) errors.company = 'La empresa es obligatoria';
    if (!formData.password) errors.password = 'La contraseña es obligatoria';
    if (formData.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBasicRegistration = async (e: React.FormEvent) => {
    e.preventDefault();    

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Generar ID único realista
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);
      const uniqueId = `cl_${timestamp}_${randomString}`;
      
      // Datos del cliente completos - Estructura de producción
      const clientData = {
        id: uniqueId,
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim() || null,
        company: formData.company.trim(),
        status: 'pending_payment',
        subscription_plan: selectedPlan?.id || 'free_trial',
        subscription_status: selectedPlan ? 'pending_payment' : 'trial',
        registration_source: 'website',
        registration_flow: 'standard',
        blocked_until_credentials: false,
        obralia_credentials_validated: false,
        registration_step: 'payment_pending',
        available_tokens: selectedPlan?.token_allowance || 100,
        storage_used_gb: 0,
        storage_limit_gb: selectedPlan?.storage_gb || 1,
        monthly_allowance: selectedPlan?.token_allowance || 100,
        api_calls_used: 0,
        api_calls_limit: selectedPlan?.api_calls || 50,
        profile_completed: true,
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 días trial
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: null,
        login_count: 0,
        last_activity: new Date().toISOString(),
        onboarding_completed: false,
        marketing_consent: true,
        gdpr_consent: true,
        ip_address: '127.0.0.1', // En producción sería la IP real
        user_agent: navigator.userAgent.substring(0, 255),
        referrer: document.referrer || null,
        utm_source: null,
        utm_medium: null,
        utm_campaign: null
      };

      console.log('🔄 Registrando cliente en base de datos...', { clientId: uniqueId, email: formData.email });

      // Insertar cliente en base de datos
      const { data: insertedClient, error: clientError } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (clientError) {
        console.error('❌ Error al insertar cliente:', clientError);
        if (clientError.code === '23505') {
          setError('Ya existe una cuenta con este email. Usa otro email o inicia sesión si ya tienes cuenta.');
          return;
        }
        setError(`Error técnico: ${clientError.message}`);
        return;
      }

      console.log('✅ Cliente registrado exitosamente:', insertedClient);

      // Crear empresa asociada
      try {
        const companyData = {
          id: `comp_${timestamp}_${Math.random().toString(36).substring(2, 8)}`,
          name: formData.company.trim(),
          client_id: uniqueId,
          sector: 'Construcción',
          size: 'Mediana',
          country: 'España',
          phone: formData.phone.trim() || null,
          email: formData.email.toLowerCase().trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          active: true
        };

        await supabase.from('companies').insert([companyData]);
        console.log('✅ Empresa creada y asociada al cliente');
      } catch (companyError) {
        console.warn('⚠️ No se pudo crear empresa (no crítico):', companyError);
      }

      // Registrar actividad inicial
      try {
        await supabase.from('client_activity_logs').insert({
          client_id: uniqueId,
          activity_type: 'account_created',
          description: `Cliente registrado: ${formData.name} (${formData.email})`,
          metadata: {
            registration_method: 'website_form',
            selected_plan: selectedPlan?.id || null,
            selected_tokens: selectedTokens?.id || null,
            company: formData.company,
            phone: formData.phone || null
          },
          ip_address: '127.0.0.1',
          user_agent: navigator.userAgent.substring(0, 255),
          created_at: new Date().toISOString()
        });
        console.log('✅ Actividad de registro guardada');
      } catch (activityError) {
        console.warn('⚠️ No se pudo registrar actividad inicial:', activityError);
      }

      // Configurar sesión temporal para continuar con el flujo de pago
      if (typeof window !== 'undefined') {
        localStorage.setItem('constructia_temp_client_id', uniqueId);
        localStorage.setItem('constructia_temp_client_email', formData.email);
        localStorage.setItem('constructia_registration_timestamp', new Date().toISOString());
      }

      console.log('🎉 Registro completado, continuando al pago...');
      
      setClientId(uniqueId);
      onSuccess(uniqueId);

    } catch (error: any) {
      console.error('💥 Error inesperado durante el registro:', error);
      setError(`Error inesperado: ${error.message || 'Problema técnico desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setStep(1);
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setValidationErrors({});
    setClientId(null);
    setShowObraliaModal(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Header con botón cerrar */}
            <div className="flex justify-between items-start mb-6">
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl font-['Pacifico']">C</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">¡Únete a ConstructIA!</h2>
                <p className="text-gray-600 mt-2">Crea tu cuenta profesional para continuar</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Mostrar plan/tokens seleccionados */}
            {(selectedPlan || selectedTokens) && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <i className="ri-gift-line text-green-600"></i>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">
                      Plan seleccionado:
                    </p>
                    <p className="font-bold text-green-900">
                      {selectedPlan ? `${selectedPlan.name} - €${selectedPlan.price}/${selectedPlan.interval === 'monthly' ? 'mes' : 'año'}` : 
                       selectedTokens ? `${selectedTokens.name} - €${selectedTokens.price}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleBasicRegistration} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Juan Pérez García"
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email profesional *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="juan@miempresa.com"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa/Organización *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                    validationErrors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Construcciones García S.L."
                />
                {validationErrors.company && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="+34 123 456 789"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                        validationErrors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line text-gray-400 hover:text-gray-600`}></i>
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                        validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Repite la contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      <i className={`ri-${showConfirmPassword ? 'eye-off' : 'eye'}-line text-gray-400 hover:text-gray-600`}></i>
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <i className="ri-error-warning-line text-red-500 mt-0.5"></i>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <i className="ri-shield-check-line text-blue-600 mt-0.5"></i>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Registro seguro y profesional</p>
                    <ul className="text-xs space-y-1">
                      <li>• Prueba gratuita de 14 días incluida</li>
                      <li>• Datos protegidos con cifrado SSL</li>
                      <li>• Soporte técnico profesional</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap shadow-lg"
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Creando tu cuenta...
                  </>
                ) : (
                  <>
                    <i className="ri-arrow-right-line mr-2"></i>
                    Continuar al Pago
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Al registrarte aceptas nuestros{' '} 
                  <a href="#" className="text-blue-600 hover:text-blue-800">términos y condiciones</a>
                  {' '}y{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800">política de privacidad</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
