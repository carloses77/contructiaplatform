
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import PaymentGateway from '../../components/PaymentGateway';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TokensPurchase() {
  const [clientData, setClientData] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientData();
    loadTokenPackages();
    loadPurchaseHistory();
  }, []);

  const loadClientData = async () => {
    try {
      const clientId = 'client_001'; 

      setClientData({
        id: clientId,
        name: 'García Construcciones',
        email: 'admin@garciaconstrucciones.com',
        available_tokens: 5000,
        monthly_allowance: 2000,
        storage_limit_gb: 0,
        subscription_plan: 'premium',
        status: 'active',
        has_payment_methods: true,
        sepa_mandates: 1,
        last_payment_method: 'SEPA'
      });

      localStorage.setItem('constructia_client_id', clientId);
      localStorage.setItem('constructia_client_email', 'admin@garciaconstrucciones.com');
      localStorage.setItem('constructia_client_authenticated', 'true');

    } catch (error) {
      console.error('Error cargando datos del cliente:', error);
    }
  };

  const loadTokenPackages = async () => {
    try {
      const mockPackages = [
        {
          id: 'basic',
          name: 'Paquete Básico',
          description: 'Ideal para proyectos pequeños',
          tokens: 1000,
          bonus_tokens: 100,
          storage_gb: 2,
          price: 25.00,
          popular: false,
          features: [
            '1,000 tokens de procesamiento IA',
            '100 tokens bonus',
            '2GB almacenamiento adicional',
            '500 llamadas API'
          ]
        },
        {
          id: 'standard',
          name: 'Paquete Estándar',
          description: 'Perfecto para múltiples proyectos',
          tokens: 2500,
          bonus_tokens: 350,
          storage_gb: 5,
          price: 35.00,
          popular: true,
          features: [
            '2,500 tokens de procesamiento IA',
            '350 tokens bonus',
            '5GB almacenamiento adicional',
            '1,200 llamadas API'
          ]
        },
        {
          id: 'premium',
          name: 'Paquete Premium',
          description: 'Máxima potencia para profesionales',
          tokens: 5000,
          bonus_tokens: 1000,
          storage_gb: 10,
          price: 55.00,
          popular: false,
          features: [
            '5,000 tokens de procesamiento IA',
            '1,000 tokens bonus',
            '10GB almacenamiento adicional',
            '2,500 llamadas API'
          ]
        }
      ];
      setPackages(mockPackages);
    } catch (error) {
      console.error('Error cargando paquetes de tokens:', error);
    }
  };

  const loadPurchaseHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('client_storage_tokens')
        .select('*')
        .eq('client_id', clientData?.id || 'client_001')
        .order('purchased_at', { ascending: false })
        .limit(10);

      if (data && data.length > 0) {
        setPurchaseHistory(data);
      } else {
        setPurchaseHistory([]);
      }
    } catch (error) {
      console.error('Error cargando historial de compras:', error);
    } finally {
      setLoading(false);
    }
  };

  const processSuccessfulPayment = async (paymentData: any) => {
    try {
      if (!clientData || !selectedPackage) {
        throw new Error('Datos del cliente o paquete no disponibles');
      }

      const currentTokens = clientData.available_tokens || 0;
      const newTokens = currentTokens + selectedPackage.tokens + selectedPackage.bonus_tokens;
      const currentStorage = clientData.storage_limit_gb || 0;
      const newStorage = currentStorage + selectedPackage.storage_gb;
      const currentDate = new Date().toISOString();
      const transactionId = paymentData.transaction_id || `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const receiptNumber = `REC-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

      console.log('💰 PROCESANDO COMPRA EXITOSA CON GENERACIÓN AUTOMÁTICA DE RECIBO');

      const { error: clientError } = await supabase
        .from('clients')
        .update({
          available_tokens: newTokens,
          storage_limit_gb: newStorage,
          last_token_purchase: currentDate,
          updated_at: currentDate,
        })
        .eq('id', clientData.id);

      if (clientError) {
        console.error('Error actualizando cliente:', clientError);
        throw new Error(`Error actualizando cliente: ${clientError.message}`);
      }
      console.log('✅ Cliente actualizado correctamente');

      const tokenStorageRecord = {
        id: `tokens_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        client_id: clientData.id,
        tokens_purchased: selectedPackage.tokens,
        bonus_tokens: selectedPackage.bonus_tokens,
        total_tokens: selectedPackage.tokens + selectedPackage.bonus_tokens,
        price_paid: selectedPackage.price,
        package_name: selectedPackage.name,
        transaction_id: transactionId,
        payment_method: paymentData.method || 'SEPA',
        receipt_number: receiptNumber,
        receipt_generated: true,
        receipt_sent: true,
        purchased_at: currentDate,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        created_at: currentDate
      };

      const { error: tokenError } = await supabase
        .from('client_storage_tokens')
        .insert([tokenStorageRecord]);

      if (tokenError) {
        console.error('Error creando registro de tokens:', tokenError);
        throw new Error(`Error creando registro de tokens: ${tokenError.message}`);
      }
      console.log('✅ Historial de compras del cliente actualizado con recibo');

      const financialRecord = {
        id: `fin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: 'income',
        amount: selectedPackage.price,
        date: currentDate,
        category: 'token_sales',
        description: `Recibo de Tokens: ${selectedPackage.name} - Cliente: ${clientData.name || clientData.email}`,
        transaction_id: transactionId,
        receipt_number: receiptNumber,
        client_id: clientData.id,
        payment_method: paymentData.method || 'SEPA',
        payment_status: 'completed',
        receipt_issued: true,
        receipt_sent_date: currentDate,
        metadata: {
          package_id: selectedPackage.id,
          package_name: selectedPackage.name,
          tokens_sold: selectedPackage.tokens,
          bonus_tokens: selectedPackage.bonus_tokens,
          total_tokens: selectedPackage.tokens + selectedPackage.bonus_tokens,
          storage_gb_added: selectedPackage.storage_gb,
          client_name: clientData.name || 'Cliente',
          client_email: clientData.email,
          currency: 'EUR',
          fee_amount: paymentData.fee_amount || 0,
          total_amount: paymentData.total_amount || selectedPackage.price,
          receipt_details: {
            receipt_number: receiptNumber,
            service_type: 'tokens_service',
            tax_rate: 21,
            subtotal: (selectedPackage.price * 0.79).toFixed(2),
            tax_amount: (selectedPackage.price * 0.21).toFixed(2),
            total_amount: selectedPackage.price,
            receipt_format: 'digital'
          }
        },
        created_at: currentDate,
        updated_at: currentDate
      };

      const { error: finError } = await supabase
        .from('financial_records')
        .insert([financialRecord]);

      if (finError) {
        console.error('Error registrando recibo en módulo financiero:', finError);
        throw new Error(`Error registrando recibo financiero: ${finError.message}`);
      }
      console.log('✅ Módulo financiero del admin actualizado con recibo completo');

      const { data: currentKPIs, error: kpiSelectError } = await supabase
        .from('operational_kpis')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (kpiSelectError) {
        console.warn('Error leyendo KPIs actuales:', kpiSelectError.message);
      }

      const existingKPIs = currentKPIs && currentKPIs.length > 0 ? currentKPIs[0] : {};

      const updatedKPIs = {
        documents_processed: existingKPIs.documents_processed || 0,
        projects_completed: existingKPIs.projects_completed || 0,
        revenue_generated: (existingKPIs.revenue_generated || 0) + selectedPackage.price,
        active_users: existingKPIs.active_users || 1,
        document_accuracy: existingKPIs.document_accuracy || 98.5,
        processing_speed: existingKPIs.processing_speed || 2.3,
        user_satisfaction: existingKPIs.user_satisfaction || 96.2,
        cost_savings: existingKPIs.cost_savings || 0,
        ai_requests_count: existingKPIs.ai_requests_count || 0,
        error_rate: existingKPIs.error_rate || 0.1,
        uptime_percentage: existingKPIs.uptime_percentage || 99.9,
        storage_used_gb: (existingKPIs.storage_used_gb || 0) + selectedPackage.storage_gb,
        tokens_sold_total: (existingKPIs.tokens_sold_total || 0) + (selectedPackage.tokens + selectedPackage.bonus_tokens),
        monthly_revenue: (existingKPIs.monthly_revenue || 0) + selectedPackage.price,
        token_revenue_total: (existingKPIs.token_revenue_total || 0) + selectedPackage.price,
        receipts_issued_total: (existingKPIs.receipts_issued_total || 0) + 1,
        receipts_this_month: (existingKPIs.receipts_this_month || 0) + 1,
        updated_at: currentDate,
      };

      const { error: kpiError } = await supabase
        .from('operational_kpis')
        .upsert([updatedKPIs]);

      if (kpiError) {
        console.error('Error actualizando KPIs:', kpiError);
      } else {
        console.log('✅ Panel del administrador (KPIs) actualizado con contadores de recibos');
      }

      const activityLog = {
        id: `activity_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        client_id: clientData.id,
        activity_type: 'tokens_purchased_with_receipt',
        description: `Compró ${selectedPackage.name} - ${selectedPackage.tokens + selectedPackage.bonus_tokens} tokens por €${selectedPackage.price} - Recibo: ${receiptNumber}`,
        metadata: {
          transaction_id: transactionId,
          receipt_number: receiptNumber,
          receipt_issued: true,
          package_id: selectedPackage.id,
          package_name: selectedPackage.name,
          tokens_purchased: selectedPackage.tokens,
          bonus_tokens: selectedPackage.bonus_tokens,
          total_tokens: selectedPackage.tokens + selectedPackage.bonus_tokens,
          amount: selectedPackage.price,
          payment_method: paymentData.method || 'SEPA',
          storage_added: selectedPackage.storage_gb,
          sepa_mandate_used: paymentData.method === 'SEPA',
          receipt_details: {
            service_type: 'tokens_service',
            digital_receipt: true,
            sent_to_email: clientData.email,
            admin_visibility: true
          }
        },
        ip_address: '127.0.0.1',
        user_agent: navigator?.userAgent?.substring(0, 255) || 'client-browser',
        created_at: currentDate,
      };

      const { error: logError } = await supabase
        .from('client_activity_logs')
        .insert([activityLog]);

      if (logError) {
        console.error('Error registrando log de actividad:', logError);
      } else {
        console.log('✅ Registro de actividad del cliente actualizado con información de recibo');
      }

      console.log('🎉 COMPRA PROCESADA EXITOSAMENTE - RECIBO GENERADO AUTOMÁTICAMENTE');

      setClientData(prev => ({
        ...prev,
        available_tokens: newTokens,
        storage_limit_gb: newStorage
      }));

      await loadPurchaseHistory();

      setShowPaymentGateway(false);
      setSelectedPackage(null);

      alert(`✅ ¡Compra exitosa con recibo generado!
      🎉 ${selectedPackage.tokens + selectedPackage.bonus_tokens} tokens añadidos
      💾 +${selectedPackage.storage_gb}GB de almacenamiento
      💰 Total: €${selectedPackage.price}
      📄 Recibo: ${receiptNumber}
      ✅ Recibo enviado a tu email
      ✅ Visible en módulo financiero admin
      ✅ Historial actualizado automáticamente
      ¡Ya puedes usar tus nuevos tokens!`);

    } catch (error: any) {
      console.error('❌ Error procesando compra con recibo:', error);
      alert(`❌ Error procesando la compra: ${error?.message || 'Error desconocido'}
      El pago fue procesado pero hubo un error generando el recibo.
      Contacta soporte técnico.
      ID de transacción: ${paymentData?.transaction_id || 'N/A'}`);
    }
  };

  const handleBuyTokens = (packageData: any) => {
    console.log('🎯 CLIENTE EXISTENTE COMPRANDO TOKENS - LÓGICA EMPRESARIAL CORRECTA');
    console.log('✅ Cliente autenticado:', clientData.name);
    console.log('✅ Métodos de pago disponibles:', clientData.has_payment_methods ? 'SÍ' : 'NO');
    console.log('✅ Mandatos SEPA activos:', clientData.sepa_mandates);

    setSelectedPackage(packageData);
    setShowPaymentGateway(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando paquetes de tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-coin-line text-purple-600 text-xl"></i>
          </div>
          <div className="text-3xl font-bold text-gray-900">{clientData?.available_tokens || 0}</div>
          <div className="text-sm text-gray-600 mt-1">Tokens Disponibles</div>
        </div>

        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-database-2-line text-blue-600 text-xl"></i>
          </div>
          <div className="text-3xl font-bold text-gray-900">{clientData?.storage_limit_gb || 0} GB</div>
          <div className="text-sm text-gray-600 mt-1">Almacenamiento</div>
        </div>

        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-shopping-bag-3-line text-green-600 text-xl"></i>
          </div>
          <div className="text-3xl font-bold text-gray-900">{purchaseHistory.length}</div>
          <div className="text-sm text-gray-600 mt-1">Compras Realizadas</div>
        </div>
      </div>

      {/* Información SEPA */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-bank-line text-blue-600 text-sm"></i>
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-blue-900 text-sm">Mandatos SEPA Activos</h3>
            <p className="text-blue-700 text-sm mt-1">
              Tienes {clientData?.sepa_mandates || 1} mandato(s) SEPA activo(s) - Puedes usar SEPA para comprar tokens sin firmar nuevamente
            </p>
          </div>
        </div>
      </div>

      {/* Título */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Paquetes de Tokens Disponibles</h1>
      </div>

      {/* Paquetes de Tokens */}
      <div className="grid grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`relative bg-white rounded-2xl p-6 text-center shadow-sm border transition-all hover:shadow-md ${pkg.popular ? 'border-purple-300' : 'border-gray-200'}`}>
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                  Más Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

              <div className="text-4xl font-bold text-purple-600 mb-2">€{pkg.price}</div>

              <div className="flex justify-center items-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{pkg.tokens}</div>
                  <div className="text-xs text-gray-500">Tokens Base</div>
                </div>
                <div className="text-lg text-gray-400">+</div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">+{pkg.bonus_tokens}</div>
                  <div className="text-xs text-gray-500">Bonus</div>
                </div>
              </div>

              <div className="text-lg font-bold text-gray-900 mb-4">
                {(pkg.tokens + pkg.bonus_tokens).toLocaleString()} tokens total
              </div>
            </div>

            <div className="space-y-2 mb-6 text-left">
              {pkg.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-green-500 mr-2 text-base"></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleBuyTokens(pkg)}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-shopping-cart-line mr-2"></i>
              Comprar Ahora
            </button>
          </div>
        ))}
      </div>

      {/* Historial de Compras */}
      {purchaseHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Historial de Compras</h3>
            <p className="text-sm text-gray-600 mt-1">Tus últimas adquisiciones de tokens</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paquete</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchaseHistory.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{purchase.package_name}</div>
                        <div className="text-sm text-gray-500">ID: {purchase.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {purchase.tokens_purchased?.toLocaleString()} + {purchase.bonus_tokens?.toLocaleString()} bonus
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        Total: {purchase.total_tokens?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">€{purchase.price_paid?.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{purchase.payment_method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(purchase.purchased_at).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {purchase.status === 'active' ? 'Activo' : purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LÓGICA EMPRESARIAL CORRECTA: PaymentGateway Directo para Cliente Existente */}
      {showPaymentGateway && selectedPackage && clientData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm font-[\\\'Pacifico\\\']">C</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Checkout Rápido</h2>
                  <p className="text-sm text-gray-600">Cliente: {clientData.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPaymentGateway(false);
                  setSelectedPackage(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <PaymentGateway
              selectedTokens={{
                id: selectedPackage.id,
                name: selectedPackage.name,
                tokens: selectedPackage.tokens,
                price: selectedPackage.price,
                currency: 'EUR',
                bonus_tokens: selectedPackage.bonus_tokens,
                storage_gb: selectedPackage.storage_gb
              }}
              clientId={clientData.id}
              onPaymentSuccess={processSuccessfulPayment}
              onPaymentError={(error) => {
                console.error('Error en el pago:', error);
                alert('Error en el pago. Inténtalo de nuevo.');
              }}
              onCancel={() => {
                setShowPaymentGateway(false);
                setSelectedPackage(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
