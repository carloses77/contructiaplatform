
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import RegistrationForm from './RegistrationForm';
import PaymentGateway from './PaymentGateway';
import PaymentSuccess from './PaymentSuccess';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: 'monthly' | 'yearly';
    features: string[];
    token_allowance: number;
    storage_gb: number;
    api_calls: number;
  };
  selectedTokens?: {
    id: string;
    name: string;
    tokens: number;
    price: number;
    currency: string;
    bonus_tokens: number;
    storage_gb?: number;
  };
}

export default function CheckoutFlow({
  isOpen,
  onClose,
  selectedPlan,
  selectedTokens
}: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState<'registration' | 'payment' | 'success'>('registration');
  const [clientId, setClientId] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [existingClient, setExistingClient] = useState<boolean>(false);
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      checkExistingSession();
    } else {
      // Reset state cuando se cierra
      setCurrentStep('registration');
      setClientId(null);
      setPaymentResult(null);
      setExistingClient(false);
      setClientData(null);
    }
  }, [isOpen]);

  const checkExistingSession = async () => {
    try {
      setLoading(true);

      // Revisar si hay un cliente temporal o activo
      const tempClientId = localStorage.getItem('constructia_temp_client_id');
      const activeClientId = localStorage.getItem('constructia_client_id');
      const storedClientId = tempClientId || activeClientId;

      if (storedClientId) {
        console.log('🔍 Verificando cliente existente:', storedClientId);

        // Verificar que el cliente existe y está válido
        const { data: client, error } = await supabase
          .from('clients')
          .select(`
            *,
            companies (*)
          `)
          .eq('id', storedClientId)
          .single();

        if (client && !error) {
          console.log('✅ Cliente existente encontrado:', client);
          setClientId(storedClientId);
          setClientData(client);
          setExistingClient(true);

          // Si el cliente ya tiene una suscripción activa o tokens, ir directamente al pago
          if (client.status === 'active' || client.status === 'pending_payment') {
            setCurrentStep('payment');
          } else {
            setCurrentStep('registration');
          }
        } else {
          console.log('⚠️ Cliente no válido o no encontrado, limpiando localStorage');
          // Cliente no válido, limpiar localStorage
          localStorage.removeItem('constructia_temp_client_id');
          localStorage.removeItem('constructia_client_id');
          localStorage.removeItem('constructia_client_email');
          localStorage.removeItem('constructia_registration_timestamp');
          setCurrentStep('registration');
        }
      } else {
        console.log('📝 No hay cliente existente, iniciando registro');
        setCurrentStep('registration');
      }

    } catch (error) {
      console.error('❌ Error verificando sesión:', error);
      setCurrentStep('registration');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = async (newClientId: string) => {
    try {
      setLoading(true);

      console.log('🎉 Registro exitoso, ID del cliente:', newClientId);

      // Obtener datos completos del cliente recién registrado
      const { data: client, error } = await supabase
        .from('clients')
        .select(`
          *,
          companies (*)
        `)
        .eq('id', newClientId)
        .single();

      if (error) {
        console.error('❌ Error obteniendo datos del cliente:', error);
        throw error;
      }

      console.log('✅ Datos del cliente cargados:', client);

      setClientId(newClientId);
      setClientData(client);
      setExistingClient(true);

      // Actualizar localStorage con el cliente activo
      localStorage.setItem('constructia_client_id', newClientId);
      localStorage.setItem('constructia_client_email', client.email);
      localStorage.setItem('constructia_login_timestamp', new Date().toISOString());

      // Limpiar cliente temporal si existe
      localStorage.removeItem('constructia_temp_client_id');

      // Continuar al proceso de pago
      setCurrentStep('payment');

    } catch (error) {
      console.error('💥 Error en registro exitoso:', error);
      alert('Hubo un problema al procesar tu registro. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      setLoading(true);
      console.log('💳 Procesando pago exitoso:', paymentData);

      // Llamar directamente a la función de procesamiento de tokens que ya existe
      if (selectedTokens && typeof window !== 'undefined') {
        // Buscar la función processSuccessfulPayment en el contexto global
        const tokensPurchaseComponent = (window as any).tokensPurchaseProcessPayment;
        if (tokensPurchaseComponent) {
          await tokensPurchaseComponent(paymentData);
        } else {
          // Procesamiento alternativo si no está disponible
          await processTokenPurchase(paymentData);
        }
      }

      // Preparar resultado del pago
      const paymentSuccessData = {
        ...paymentData,
        success: true,
        purchase_type: selectedTokens ? 'tokens' : 'subscription',
        item_name: selectedPlan?.name || selectedTokens?.name,
        client_info: {
          id: clientId,
          name: clientData?.name,
          email: clientData?.email,
          company: clientData?.company
        }
      };

      setPaymentResult(paymentSuccessData);
      setCurrentStep('success');

      console.log('🎉 Proceso de pago completado exitosamente');

    } catch (error) {
      console.error('💥 Error procesando pago exitoso:', error);
      alert('El pago fue procesado, pero hubo un error actualizando tu cuenta. Contacta soporte técnico.');
    } finally {
      setLoading(false);
    }
  };

  const processTokenPurchase = async (paymentData: any) => {
    if (!selectedTokens || !clientId) return;

    try {
      const currentDate = new Date().toISOString();
      const transactionId = paymentData.transaction_id || `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // 1. Actualizar balance del cliente
      const { data: currentClient } = await supabase
        .from('clients')
        .select('available_tokens, storage_limit_gb')
        .eq('id', clientId)
        .single();

      const currentTokens = currentClient?.available_tokens || 0;
      const newTokens = currentTokens + selectedTokens.tokens + selectedTokens.bonus_tokens;
      const currentStorage = currentClient?.storage_limit_gb || 0;
      const newStorage = currentStorage + (selectedTokens.storage_gb || 0);

      await supabase
        .from('clients')
        .update({
          available_tokens: newTokens,
          storage_limit_gb: newStorage,
          last_token_purchase: currentDate,
          updated_at: currentDate,
        })
        .eq('id', clientId);

      // 2. Crear registro en historial
      await supabase
        .from('client_storage_tokens')
        .insert([{
          id: `tokens_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          client_id: clientId,
          tokens_purchased: selectedTokens.tokens,
          bonus_tokens: selectedTokens.bonus_tokens,
          total_tokens: selectedTokens.tokens + selectedTokens.bonus_tokens,
          price_paid: selectedTokens.price,
          package_name: selectedTokens.name,
          transaction_id: transactionId,
          payment_method: paymentData.method || 'Tarjeta',
          purchased_at: currentDate,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          created_at: currentDate
        }]);

      // 3. Registrar ingresos
      await supabase
        .from('financial_records')
        .insert([{
          id: `fin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          type: 'income',
          amount: selectedTokens.price,
          date: currentDate,
          category: 'token_sales',
          description: `Venta de tokens: ${selectedTokens.name}`,
          transaction_id: transactionId,
          client_id: clientId,
          payment_method: paymentData.method || 'card',
          payment_status: 'completed',
          metadata: {
            tokens_sold: selectedTokens.tokens,
            bonus_tokens: selectedTokens.bonus_tokens,
            total_tokens: selectedTokens.tokens + selectedTokens.bonus_tokens
          },
          created_at: currentDate
        }]);

      // 4. Actualizar KPIs
      const { data: currentKPIs } = await supabase
        .from('operational_kpis')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      const existingKPIs = currentKPIs && currentKPIs.length > 0 ? currentKPIs[0] : {};

      await supabase
        .from('operational_kpis')
        .upsert([{
          ...existingKPIs,
          revenue_generated: (existingKPIs.revenue_generated || 0) + selectedTokens.price,
          tokens_sold_total: (existingKPIs.tokens_sold_total || 0) + (selectedTokens.tokens + selectedTokens.bonus_tokens),
          monthly_revenue: (existingKPIs.monthly_revenue || 0) + selectedTokens.price,
          updated_at: currentDate
        }]);

      // 5. Log de actividad
      await supabase
        .from('client_activity_logs')
        .insert([{
          id: `activity_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          client_id: clientId,
          activity_type: 'tokens_purchased',
          description: `Compró ${selectedTokens.name} - ${selectedTokens.tokens + selectedTokens.bonus_tokens} tokens por €${selectedTokens.price}`,
          metadata: {
            transaction_id: transactionId,
            tokens_purchased: selectedTokens.tokens,
            bonus_tokens: selectedTokens.bonus_tokens,
            total_tokens: selectedTokens.tokens + selectedTokens.bonus_tokens,
            amount: selectedTokens.price
          },
          created_at: currentDate
        }]);

    } catch (error) {
      console.error('Error en processTokenPurchase:', error);
      throw error;
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Error en el pago:', error);
    alert('Ha ocurrido un error en el pago. Por favor, inténtalo de nuevo o contacta soporte.');
  };

  const handleBackToPayment = () => {
    setCurrentStep('payment');
  };

  const handleContinueToDashboard = () => {
    onClose();
    // Delay para asegurar que el modal se cierre antes de navegar
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }, 300);
  };

  const handleClose = () => {
    // Limpiar estado completamente al cerrar
    setCurrentStep('registration');
    setClientId(null);
    setPaymentResult(null);
    setExistingClient(false);
    setClientData(null);
    onClose();
  };

  if (!isOpen) return null;

  if (loading && currentStep !== 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full mx-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl font-[\'Pacifico\']">C</span>
          </div>
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Procesando información...</p>
          <p className="text-sm text-gray-500 mt-2">
            {currentStep === 'registration' ? 'Verificando datos de registro' :
              currentStep === 'payment' ? 'Procesando pago seguro' : 'Cargando...'}
          </p>
        </div>
      </div>
    );
  }

  const getStepInfo = () => {
    switch (currentStep) {
      case 'registration':
        return { step: existingClient ? 2 : 1, total: 3, title: existingClient ? 'Pago' : 'Registro' };
      case 'payment':
        return { step: 2, total: 3, title: 'Pago' };
      case 'success':
        return { step: 3, total: 3, title: 'Completado' };
      default:
        return { step: 1, total: 3, title: 'Registro' };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <>
      {/* Progress Header - Solo mostrar si no es success */}
      {currentStep !== 'success' && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm font-[\'Pacifico\']">C</span>
                </div>
                <span className="text-lg font-[\'Pacifico\'] text-green-600">ConstructIA</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">Proceso de activación profesional</span>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= stepInfo.step
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step < stepInfo.step ? (
                          <i className="ri-check-line"></i>
                        ) : (
                          step
                        )}
                      </div>
                      {step < 3 && (
                        <div className={`h-1 w-16 mx-2 ${
                          step < stepInfo.step ? 'bg-green-600' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Paso {stepInfo.step} de {stepInfo.total}: {stepInfo.title}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={currentStep !== 'success' ? 'pt-24' : ''}>
        {currentStep === 'registration' && !existingClient && (
          <RegistrationForm
            isOpen={true}
            onClose={handleClose}
            onSuccess={handleRegistrationSuccess}
            selectedPlan={selectedPlan}
            selectedTokens={selectedTokens}
          />
        )}

        {currentStep === 'payment' && (
          <PaymentGateway
            selectedPlan={selectedPlan}
            selectedTokens={selectedTokens}
            clientId={clientId!}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onCancel={existingClient ? handleClose : handleBackToPayment}
          />
        )}

        {currentStep === 'success' && paymentResult && (
          <PaymentSuccess
            paymentData={paymentResult}
            onContinue={handleContinueToDashboard}
          />
        )}
      </div>
    </>
  );
}
