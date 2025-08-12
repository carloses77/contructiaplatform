
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import SEPAMandateForm from './SEPAMandateForm';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  logo_url: string;
  enabled: boolean;
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  supported_currencies: string[];
  processing_time: string;
  security_features: string[];
  api_config?: any;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  token_allowance: number;
  storage_gb: number;
  api_calls: number;
}

interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  currency: string;
  bonus_tokens: number;
}

interface PaymentGatewayProps {
  selectedPlan?: SubscriptionPlan;
  selectedTokens?: TokenPackage;
  clientId?: string;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: any) => void;
  onCancel?: () => void;
}

export default function PaymentGateway({
  selectedPlan,
  selectedTokens,
  clientId,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
}: PaymentGatewayProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showMethodDetails, setShowMethodDetails] = useState<string>('');
  const [platformConfig, setPlatformConfig] = useState<any>(null);

  const [existingSEPAMandates, setExistingSEPAMandates] = useState<any[]>([]);
  const [selectedSEPAMandate, setSelectedSEPAMandate] = useState<string>('');
  const [showSEPAMandateForm, setShowSEPAMandateForm] = useState(false);
  const [sepaMandateLoading, setSepaMandateLoading] = useState(false);

  const [paymentData, setPaymentData] = useState({
    email: '',
    fullName: '',
    company: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'ES',
    vatId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    iban: '',
    bizumPhone: '',
    savePaymentMethod: false,
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>( {});

  useEffect(() => {
    loadPaymentConfiguration();
    if (clientId) {
      loadClientSEPAMandates();
    }
  }, [clientId]);

  const loadClientSEPAMandates = async () => {
    if (!clientId) return;

    try {
      console.log(`🔍 VERIFICANDO MANDATOS SEPA EXISTENTES para cliente:`, clientId);

      const { data: mandates, error } = await supabase
        .from('sepa_mandates')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn(`⚠️ Error cargando mandatos SEPA (esperado si no existen):`, error.message);
        setExistingSEPAMandates([]);
        return;
      }

      if (mandates && mandates.length > 0) {
        console.log(`✅ MANDATOS SEPA ACTIVOS ENCONTRADOS:`, mandates.length);
        setExistingSEPAMandates(mandates);
        setSelectedSEPAMandate(mandates[0].id);
      } else {
        console.log(`ℹ️ No hay mandatos SEPA activos - cliente deberá firmar nuevo mandato`);
        setExistingSEPAMandates([]);
      }
    } catch (error) {
      console.error(`💥 Error verificando mandatos SEPA:`, error);
      setExistingSEPAMandates([]);
    }
  };

  const loadPaymentConfiguration = async () => {
    try {
      setLoading(true);

      const [systemConfig, integrations, platformIntegrations] = await Promise.all([
        supabase.from('system_configurations').select('*').order('created_at', { ascending: false }).limit(1),
        supabase.from('platform_integrations').select('*').eq('type', 'payment').eq('status', 'active'),
        supabase.from('platform_integrations').select('*').eq('category', 'payment_gateway'),
      ]);

      if (systemConfig && systemConfig.length > 0) {
        setPlatformConfig(systemConfig[0]);
      }

      if (integrations && integrations.length > 0) {
        const configuredMethods = integrations.map((integration) => ({
          id: integration.id,
          name: integration.name,
          type: getPaymentType(integration.provider),
          logo_url: integration.logo_url || getDefaultLogo(integration.provider),
          enabled: integration.status === 'active',
          fees: integration.fees || { percentage: 0, fixed: 0, currency: 'EUR' },
          supported_currencies: integration.supported_currencies || ['EUR'],
          processing_time: getProcessingTime(integration.provider),
          security_features: getSecurityFeatures(integration.provider),
          api_config: integration.api_config,
        }));

        setPaymentMethods(configuredMethods);
      } else {
        setPaymentMethods(getDefaultPaymentMethods());
      }
    } catch (error) {
      console.error('Error cargando configuración de pagos:', error);
      setPaymentMethods(getDefaultPaymentMethods());
    } finally {
      setLoading(false);
    }
  };

  const handleSEPAMethodSelection = async () => {
    if (!clientId) {
      console.error('❌ No hay clientId para verificar mandatos SEPA');
      return;
    }

    console.log('🎯 CLIENTE SELECCIONÓ SEPA - APLICANDO LÓGICA PERSISTENTE');

    if (existingSEPAMandates.length > 0) {
      const activeMandate = existingSEPAMandates[0];
      console.log(`✅ USANDO MANDATO SEPA EXISTENTE:`, activeMandate.mandate_reference);
      console.log(`📋 IBAN del mandato:`, activeMandate.iban);
      console.log(`📅 Fecha de firma:`, new Date(activeMandate.signed_at).toLocaleDateString());

      setPaymentData((prev) => ({
        ...prev,
        iban: activeMandate.iban,
        fullName: activeMandate.debtor_name,
        email: activeMandate.debtor_email || prev.email,
        address: activeMandate.debtor_address || prev.address,
      }));

      setSelectedMethod('sepa');
      return;
    }

    setSepaMandateLoading(true);
    await loadClientSEPAMandates();
    setSepaMandateLoading(false);

    if (existingSEPAMandates.length > 0) {
      console.log(`✅ MANDATOS ENCONTRADOS TRAS RECARGA`);
      const activeMandate = existingSEPAMandates[0];
      setPaymentData((prev) => ({
        ...prev,
        iban: activeMandate.iban,
        fullName: activeMandate.debtor_name,
        email: activeMandate.debtor_email || prev.email,
      }));
      setSelectedMethod('sepa');
    } else {
      console.log(`📝 NO HAY MANDATOS ACTIVOS - MOSTRAR FORMULARIO DE FIRMA`);
      setShowSEPAMandateForm(true);
    }
  };

  const handleSEPAMandateSigned = async (mandateData: any) => {
    console.log(`🎉 NUEVO MANDATO SEPA FIRMADO:`, mandateData);

    // CORRECCIÓN OPERATIVA: Recargar mandatos y actualizar estado inmediatamente
    await loadClientSEPAMandates();

    // ACTUALIZAR DATOS LOCALES INMEDIATAMENTE
    setPaymentData((prev) => ({
      ...prev,
      iban: mandateData.iban,
      fullName: mandateData.debtor_name,
      email: mandateData.debtor_email || prev.email,
    }));

    // CONFIGURAR MANDATO COMO SELECCIONADO
    setSelectedSEPAMandate(mandateData.id);
    setExistingSEPAMandates((prevMandates) => [mandateData, ...prevMandates]);

    setShowSEPAMandateForm(false);
    setSelectedMethod('sepa');

    console.log(`✅ MANDATO SEPA CONFIGURADO - CLIENTE PUEDE PROCEDER AL PAGO`);
  };

  const getDefaultPaymentMethods = (): PaymentMethod[] => [
    {
      id: 'stripe-card',
      name: 'Tarjeta de Crédito/Débito',
      type: 'card',
      logo_url: 'https://js.stripe.com/v3/fingerprinted/img/stripe-logo-stripe-blue.svg',
      enabled: true,
      fees: { percentage: 2.9, fixed: 0.3, currency: 'EUR' },
      supported_currencies: ['EUR', 'USD', 'GBP'],
      processing_time: 'Inmediato',
      security_features: ['3D Secure', 'Cifrado AES-256', 'Detección de fraude'],
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'paypal',
      logo_url: 'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png',
      enabled: true,
      fees: { percentage: 3.4, fixed: 0.35, currency: 'EUR' },
      supported_currencies: ['EUR', 'USD', 'GBP'],
      processing_time: 'Inmediato',
      security_features: ['Protección del comprador', 'Cifrado SSL', 'Monitoreo 24/7'],
    },
    {
      id: 'sepa',
      name: 'Transferencia SEPA',
      type: 'bank_transfer',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/SEPA_logo.svg',
      enabled: true,
      fees: { percentage: 0.8, fixed: 0, currency: 'EUR' },
      supported_currencies: ['EUR'],
      processing_time: '1-2 días laborables',
      security_features: ['Mandato SEPA', 'Verificación bancaria', 'Cumplimiento PSD2'],
    },
    {
      id: 'bizum',
      name: 'Bizum',
      type: 'bizum',
      logo_url: 'https://www.bizum.es/sites/default/files/inline-images/bizum-logo.png',
      enabled: true,
      fees: { percentage: 1.5, fixed: 0, currency: 'EUR' },
      supported_currencies: ['EUR'],
      processing_time: 'Inmediato',
      security_features: ['Autenticación bancaria', 'Cifrado E2E'],
    },
  ];

  const getPaymentType = (provider: string): string => {
    const typeMap: { [key: string]: string } = {
      stripe: 'card',
      paypal: 'paypal',
      sepa: 'bank_transfer',
      bizum: 'bizum',
      apple_pay: 'digital_wallet',
      google_pay: 'digital_wallet',
      klarna: 'bnpl',
    };
    return typeMap[provider.toLowerCase()] || 'card';
  };

  const getDefaultLogo = (provider: string): string => {
    const logoMap: { [key: string]: string } = {
      stripe: 'https://js.stripe.com/v3/fingerprinted/img/stripe-logo-stripe-blue.svg',
      paypal: 'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png',
      sepa: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/SEPA_logo.svg',
      bizum: 'https://www.bizum.es/sites/default/files/inline-images/bizum-logo.png',
    };
    return logoMap[provider.toLowerCase()] || '';
  };

  const getProcessingTime = (provider: string): string => {
    const timeMap: { [key: string]: string } = {
      stripe: 'Inmediato',
      paypal: 'Inmediato',
      sepa: '1-2 días laborables',
      bizum: 'Inmediato',
      apple_pay: 'Inmediato',
      google_pay: 'Inmediato',
      klarna: 'Inmediato',
    };
    return timeMap[provider.toLowerCase()] || 'Inmediato';
  };

  const getSecurityFeatures = (provider: string): string[] => {
    const featuresMap: { [key: string]: string[] } = {
      stripe: ['3D Secure', 'Cifrado AES-256', 'Detección de fraude'],
      paypal: ['Protección del comprador', 'Cifrado SSL', 'Monitoreo 24/7'],
      sepa: ['Mandato SEPA', 'Verificación bancaria', 'Cumplimiento PSD2'],
      bizum: ['Autenticación bancaria', 'Cifrado E2E', 'Límites de seguridad'],
    };
    return featuresMap[provider.toLowerCase()] || ['Cifrado SSL', 'Verificación segura'];
  };

  const validatePaymentForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!paymentData.email) errors.email = 'Email es obligatorio';
    if (!paymentData.fullName) errors.fullName = 'Nombre completo es obligatorio';
    if (!paymentData.acceptTerms) errors.terms = 'Debes aceptar los términos y condiciones';
    if (!paymentData.acceptPrivacy) errors.privacy = 'Debes aceptar la política de privacidad';

    const method = paymentMethods.find((m) => m.id === selectedMethod);
    if (!method) {
      errors.method = 'Selecciona un método de pago';
      setValidationErrors(errors);
      return false;
    }

    if (method.type === 'card') {
      if (!paymentData.cardNumber) errors.cardNumber = 'Número de tarjeta es obligatorio';
      if (!paymentData.cardHolder) errors.cardHolder = 'Titular de la tarjeta es obligatorio';
      if (!paymentData.expiryDate) errors.expiryDate = 'Fecha de vencimiento es obligatoria';
      if (!paymentData.cvv) errors.cvv = 'CVV es obligatorio';
    } else if (method.type === 'bank_transfer') {
      if (!paymentData.iban) errors.iban = 'IBAN es obligatorio';
      if (existingSEPAMandates.length === 0 && !selectedSEPAMandate) {
        errors.sepa = 'Es necesario un mandato SEPA activo para procesar el pago';
      }
    } else if (method.type === 'bizum') {
      if (!paymentData.bizumPhone) errors.bizumPhone = 'Teléfono asociado a Bizum es obligatorio';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotal = (): number => {
    const baseAmount = selectedPlan?.price || selectedTokens?.price || 0;
    const method = paymentMethods.find((m) => m.id === selectedMethod);
    if (!method) return baseAmount;

    const fee = (baseAmount * method.fees.percentage / 100) + method.fees.fixed;
    return baseAmount + fee;
  };

  const calculateFee = (): number => {
    const baseAmount = selectedPlan?.price || selectedTokens?.price || 0;
    const method = paymentMethods.find((m) => m.id === selectedMethod);
    if (!method) return 0;

    return (baseAmount * method.fees.percentage / 100) + method.fees.fixed;
  };

  const processPayment = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    setProcessing(true);

    try {
      const selectedPaymentMethod = paymentMethods.find((m) => m.id === selectedMethod);
      const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const total = calculateTotal();
      const fee = calculateFee();

      console.log(`💳 PROCESANDO PAGO - MÉTODO:`, selectedPaymentMethod?.name);

      // CORRECCIÓN OPERATIVA: Procesar pago SEPA con mandato existente o recién firmado
      if (selectedPaymentMethod?.type === 'bank_transfer') {
        const activeMandate = existingSEPAMandates.find((m) => m.id === selectedSEPAMandate) || existingSEPAMandates[0];
        if (activeMandate) {
          console.log(`✅ PROCESANDO PAGO SEPA CON MANDATO:`, activeMandate.mandate_reference);

          // REGISTRAR CARGO SEPA
          const { error: sepaChargeError } = await supabase
            .from('sepa_signatures')
            .insert([
              {
                id: `sepa_charge_${Date.now()}`,
                mandate_id: activeMandate.id,
                client_id: clientId,
                amount: total,
                currency: 'EUR',
                description: selectedPlan ? `Suscripción ${selectedPlan.name}` : `Paquete de ${selectedTokens?.tokens} tokens`,
                transaction_id: transactionId,
                status: 'pending',
                charge_date: new Date().toISOString(),
                created_at: new Date().toISOString(),
              },
            ]);

          if (sepaChargeError) {
            console.warn('Error registrando cargo SEPA:', sepaChargeError.message);
          }
        }
      }

      await simulatePaymentProcessing(selectedPaymentMethod!);

      // CORRECCIÓN OPERATIVA: Actualizar registro financiero con datos completos
      const financialRecord = {
        id: `fin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: 'income',
        amount: total,
        date: new Date().toISOString(),
        category: selectedPlan ? 'subscription_revenue' : 'token_revenue',
        description: `Pago ${selectedPlan ? 'suscripción' : 'tokens'}: ${selectedPlan?.name || selectedTokens?.name}`,
        transaction_id: transactionId,
        client_id: clientId,
        payment_method: selectedPaymentMethod?.name,
        payment_status: 'completed',
        metadata: {
          billing_info: {
            email: paymentData.email,
            name: paymentData.fullName,
            company: paymentData.company,
            address: paymentData.address,
            city: paymentData.city,
            zip_code: paymentData.zipCode,
            country: paymentData.country,
            vat_id: paymentData.vatId,
          },
          payment_method_data: getPaymentMethodData(),
          platform_config_id: platformConfig?.id,
          sepa_mandate_id: selectedPaymentMethod?.type === 'bank_transfer' && existingSEPAMandates.length > 0 ? (existingSEPAMandates.find((m) => m.id === selectedSEPAMandate) || existingSEPAMandates[0])?.id : null,
          fee_amount: fee,
          total_amount: total,
          currency: selectedPlan?.currency || selectedTokens?.currency || 'EUR',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: financialError } = await supabase.from('financial_records').insert([financialRecord]);

      if (financialError) {
        console.error('Error registrando transacción financiera:', financialError);
        throw new Error(`Error registrando transacción financiera: ${financialError.message}`);
      }

      console.log('✅ REGISTRO FINANCIERO CREADO CORRECTAMENTE');

      // CORRECCIÓN OPERATIVA: Actualizar suscripción o tokens del cliente
      if (selectedPlan) {
        await updateClientSubscription(clientId!, selectedPlan, transactionId);
      }

      if (selectedTokens) {
        await updateClientTokens(clientId!, selectedTokens, transactionId);
      }

      // CORRECCIÓN OPERATIVA: Registrar actividad del cliente con datos completos
      const { error: activityError } = await supabase.from('client_activity_logs').insert([
        {
          id: `activity_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          client_id: clientId,
          activity_type: selectedPlan ? 'subscription_purchased' : 'tokens_purchased',
          description: `Compra exitosa: ${selectedPlan?.name || selectedTokens?.name} por €${total}`,
          metadata: {
            transaction_id: transactionId,
            amount: selectedPlan?.price || selectedTokens?.price || 0,
            fee_amount: fee,
            total_amount: total,
            payment_method: selectedPaymentMethod?.name,
            sepa_mandate_used: selectedPaymentMethod?.type === 'bank_transfer' && existingSEPAMandates.length > 0,
            sepa_mandate_reference: selectedPaymentMethod?.type === 'bank_transfer' && existingSEPAMandates.length > 0 ? (existingSEPAMandates.find((m) => m.id === selectedSEPAMandate) || existingSEPAMandates[0])?.mandate_reference : null,
          },
          ip_address: '127.0.0.1',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 200) : 'client-browser',
          created_at: new Date().toISOString(),
        },
      ]);

      if (activityError) {
        console.warn('Error registrando actividad del cliente:', activityError.message);
      }

      const receiptData = generateReceiptData(transactionId, total, fee, selectedPaymentMethod!);

      const paymentResult = {
        success: true,
        transaction_id: transactionId,
        amount: selectedPlan?.price || selectedTokens?.price || 0,
        total_amount: total,
        fee_amount: fee,
        currency: selectedPlan?.currency || selectedTokens?.currency || 'EUR',
        method: selectedPaymentMethod?.name,
        processed_at: new Date().toISOString(),
        receipt: receiptData,
        client_access: {
          can_upload_documents: true,
          subscription_active: !!selectedPlan,
          tokens_available: selectedTokens?.tokens || 0,
        },
      };

      console.log('🎉 PAGO PROCESADO EXITOSAMENTE - TODOS LOS REGISTROS ACTUALIZADOS');
      onPaymentSuccess?.(paymentResult);
    } catch (error) {
      console.error('Error procesando pago:', error);
      onPaymentError?.(error);
    } finally {
      setProcessing(false);
    }
  };

  const simulatePaymentProcessing = async (method: PaymentMethod) => {
    const processingTime = method.processing_time === 'Inmediato' ? 2000 : 5000;
    await new Promise((resolve) => setTimeout(resolve, processingTime));

    if (Math.random() < 0.05) {
      throw new Error('Error en el procesamiento del pago. Inténtalo de nuevo.');
    }
  };

  const updateClientSubscription = async (clientId: string, plan: SubscriptionPlan, transactionId: string) => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (plan.interval === 'yearly' ? 12 : 1));

    await supabase
      .from('clients')
      .update({
        subscription_plan: plan.name.toLowerCase().replace(' ', '_'),
        subscription_status: 'active',
        subscription_start: new Date().toISOString(),
        subscription_end: endDate.toISOString(),
        monthly_allowance: plan.token_allowance,
        storage_limit_gb: plan.storage_gb,
        api_calls_limit: plan.api_calls,
        last_payment_transaction: transactionId,
      })
      .eq('id', clientId);
  };

  const updateClientTokens = async (clientId: string, tokenPackage: TokenPackage, transactionId: string) => {
    try {
      const { data: client } = await supabase
        .from('clients')
        .select('available_tokens')
        .eq('id', clientId)
        .single();

      const currentTokens = client?.available_tokens || 0;
      const totalTokens = tokenPackage.tokens + (tokenPackage.bonus_tokens || 0);

      // ACTUALIZAR CLIENTE
      const { error: clientUpdateError } = await supabase
        .from('clients')
        .update({
          available_tokens: currentTokens + totalTokens,
          last_token_purchase: new Date().toISOString(),
          last_payment_transaction: transactionId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clientId);

      if (clientUpdateError) {
        console.error('Error actualizando cliente:', clientUpdateError);
        throw new Error(`Error actualizando cliente: ${clientUpdateError.message}`);
      }

      // CORRECCIÓN OPERATIVA: Registrar compra de tokens con ID único
      const { error: tokensError } = await supabase.from('client_storage_tokens').insert([
        {
          id: `tokens_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          client_id: clientId,
          tokens_purchased: tokenPackage.tokens,
          bonus_tokens: tokenPackage.bonus_tokens || 0,
          total_tokens: totalTokens,
          price_paid: tokenPackage.price,
          package_name: tokenPackage.name,
          transaction_id: transactionId,
          payment_method: 'SEPA',
          purchased_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          created_at: new Date().toISOString(),
        },
      ]);

      if (tokensError) {
        console.error('Error registrando compra de tokens:', tokensError);
        throw new Error(`Error registrando compra de tokens: ${tokensError.message}`);
      }

      console.log('✅ TOKENS DEL CLIENTE ACTUALIZADOS CORRECTAMENTE');
    } catch (error) {
      console.error('Error en updateClientTokens:', error);
      throw error;
    }
  };

  const generateReceiptData = (transactionId: string, total: number, fee: number, method: PaymentMethod) => {
    return {
      receipt_number: transactionId,
      date: new Date().toLocaleString('es-ES'),
      client_info: {
        name: paymentData.fullName,
        email: paymentData.email,
        company: paymentData.company,
        vat_id: paymentData.vatId,
      },
      items: [
        {
          description: selectedPlan ? `Suscripción ${selectedPlan.name}` : `Paquete de ${selectedTokens?.tokens} tokens`,
          quantity: 1,
          unit_price: selectedPlan?.price || selectedTokens?.price || 0,
          total: selectedPlan?.price || selectedTokens?.price || 0,
        },
      ],
      subtotal: selectedPlan?.price || selectedTokens?.price || 0,
      fees: {
        payment_processing: fee,
        description: `Comisión ${method.name} (${method.fees.percentage}% + €${method.fees.fixed})`,
      },
      total: total,
      currency: 'EUR',
      payment_method: method.name,
      status: 'Pagado',
      notes: 'Este es un recibo de compra, no una factura fiscal.',
    };
  };

  const getPaymentMethodData = () => {
    const method = paymentMethods.find((m) => m.id === selectedMethod);
    if (!method) return {};

    switch (method.type) {
      case 'card':
        return {
          card_last_four: paymentData.cardNumber.slice(-4),
          card_holder: paymentData.cardHolder,
          expiry_date: paymentData.expiryDate,
        };
      case 'bank_transfer':
        const mandateInfo = existingSEPAMandates.length > 0 ? existingSEPAMandates.find((m) => m.id === selectedSEPAMandate) || existingSEPAMandates[0] : null;
        return {
          iban_last_four: paymentData.iban.slice(-4),
          mandate_reference: mandateInfo?.mandate_reference,
          mandate_signed_date: mandateInfo?.signed_at,
          // CORRECCIÓN: Usar debtor_bic según esquema correcto
          debtor_bic: mandateInfo?.debtor_bic,
        };
      case 'bizum':
        return {
          phone: paymentData.bizumPhone,
        };
      default:
        return {};
    }
  };

  const renderPaymentForm = () => {
    const method = paymentMethods.find((m) => m.id === selectedMethod);
    if (!method) return null;

    switch (method.type) {
      case 'card':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de tarjeta *</label>
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\.)/g, '$1 ');
                    if (value.length <= 19) {
                      setPaymentData((prev) => ({ ...prev, cardNumber: value }));
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  maxLength={19}
                />
                {validationErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.cardNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titular *</label>
                <input
                  type="text"
                  value={paymentData.cardHolder}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, cardHolder: e.target.value }))}
                  placeholder="Nombre completo"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.cardHolder ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {validationErrors.cardHolder && <p className="text-red-500 text-xs mt-1">{validationErrors.cardHolder}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vencimiento *</label>
                <input
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                    if (value.length <= 5) {
                      setPaymentData((prev) => ({ ...prev, expiryDate: value }));
                    }
                  }}
                  placeholder="MM/AA"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  maxLength={5}
                />
                {validationErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{validationErrors.expiryDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      setPaymentData((prev) => ({ ...prev, cvv: value }));
                    }
                  }}
                  placeholder="123"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                  maxLength={4}
                />
                {validationErrors.cvv && <p className="text-red-500 text-xs mt-1">{validationErrors.cvv}</p>}
              </div>
            </div>
          </div>
        );

      case 'bank_transfer':
        return (
          <div className="space-y-4">
            {existingSEPAMandates.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-shield-check-line text-green-600 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 text-sm mb-2">✅ Mandatos SEPA Activos</h4>
                    <p className="text-green-700 text-sm mb-3">
                      Tienes {existingSEPAMandates.length} mandato(s) SEPA firmado(s). Puedes usar cualquiera sin firmar de nuevo.
                    </p>

                    <div className="space-y-2">
                      {existingSEPAMandates.map((mandate) => (
                        <div key={mandate.id} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id={`mandate-${mandate.id}`}
                            name="sepa_mandate"
                            value={mandate.id}
                            checked={selectedSEPAMandate === mandate.id}
                            onChange={(e) => setSelectedSEPAMandate(e.target.value)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 cursor-pointer"
                          />
                          <label htmlFor={`mandate-${mandate.id}`} className="text-sm text-green-700 cursor-pointer flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">Mandato: {mandate.mandate_reference}</span>
                                <div className="text-xs text-green-600 mt-1">
                                  IBAN: ****{mandate.iban.slice(-4)} • Firmado: {new Date(mandate.signed_at).toLocaleDateString()}
                                </div>
                              </div>
                              {selectedSEPAMandate === mandate.id && <i className="ri-check-line text-green-600"></i>}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IBAN {existingSEPAMandates.length > 0 ? '(Pre-completado desde mandato)' : '*'}
              </label>
              <input
                type="text"
                value={paymentData.iban}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\\w]/gi, '').replace(/(.{4})/g, '$1 ').trim();
                  setPaymentData((prev) => ({ ...prev, iban: value }));
                }}
                placeholder="ES21 1234 5678 90 1234567890"
                readOnly={existingSEPAMandates.length > 0}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.iban ? 'border-red-500' : 'border-gray-300'
                  } ${existingSEPAMandates.length > 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
              />
              {validationErrors.iban && <p className="text-red-500 text-xs mt-1">{validationErrors.iban}</p>}
              {validationErrors.sepa && <p className="text-red-500 text-xs mt-1">{validationErrors.sepa}</p>}
            </div>

            {existingSEPAMandates.length > 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <i className="ri-information-line text-blue-600 mt-0.5"></i>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Pago con Mandato SEPA Existente</p>
                    <p>Se procesará el cargo usando tu mandato firmado previamente. Sin necesidad de nueva autorización.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <i className="ri-information-line text-orange-600 mt-0.5"></i>
                  <div className="text-sm text-orange-700">
                    <p className="font-medium mb-1">Nuevo Mandato SEPA Requerido</p>
                    <p>Necesitas firmar un mandato de domiciliación bancaria antes de proceder al pago.</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('🔘 BOTÓN FIRMAR MANDATO SEPA CLICKEADO');
                        setShowSEPAMandateForm(true);
                      }}
                      className="mt-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Firmar Mandato SEPA
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'bizum':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de móvil asociado a Bizum *</label>
              <input
                type="tel"
                value={paymentData.bizumPhone}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, bizumPhone: e.target.value }))}
                placeholder="+34 123 456 789"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.bizumPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {validationErrors.bizumPhone && <p className="text-red-500 text-xs mt-1">{validationErrors.bizumPhone}</p>}
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <i className="ri-smartphone-line text-orange-600 mt-0.5"></i>
                <div className="text-sm text-orange-700">
                  <p className="font-medium mb-1">Pago con Bizum</p>
                  <p>Recibirás una notificación en tu móvil para autorizar el pago. Límite máximo: €1.000</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'paypal':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src={method.logo_url} alt={method.name} className="w-12 h-8 object-contain" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">PayPal</h4>
            <p className="text-gray-600">Serás redirigido a PayPal para completar el pago de forma segura</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-700">✅ Protección del comprador incluida</p>
            </div>
          </div>
        );

      case 'digital_wallet':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src={method.logo_url} alt={method.name} className="w-10 h-10 object-contain" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">{method.name}</h4>
            <p className="text-gray-600">Se abrirá la aplicación para confirmar el pago</p>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-bank-card-line text-2xl text-gray-600"></i>
            </div>
            <p className="text-gray-600">Configuración de pago personalizada</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">🔒 Cargando pasarela de pago segura...</p>
        </div>
      </div>
    );
  }

  if (showSEPAMandateForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">📝 Firma de Mandato SEPA</h2>
            <button
              onClick={() => setShowSEPAMandateForm(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          <SEPAMandateForm
            clientId={clientId!}
            amount={calculateTotal()}
            description={selectedPlan ? `Suscripción ${selectedPlan.name}` : `Paquete de ${selectedTokens?.tokens} tokens`}
            onMandateSigned={handleSEPAMandateSigned}
            onCancel={() => setShowSEPAMandateForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl font-[ 'Pacifico']">C</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-[ 'Pacifico']">ConstructIA</h1>
          </div>
          <h2 className="text-xl text-gray-700 mb-2">🚀 ¡Último paso para activar tu cuenta!</h2>
          <p className="text-gray-600">Completa tu pago de forma segura y comienza a disfrutar de ConstructIA</p>
        </div>

        {/* Resumen de compra */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {selectedPlan && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🎯 {selectedPlan.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <i className="ri-cpu-line text-green-600"></i>
                      <span>{selectedPlan.token_allowance.toLocaleString()} tokens/mes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-hard-drive-line text-blue-600"></i>
                      <span>{selectedPlan.storage_gb} GB storage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-api-line text-purple-600"></i>
                      <span>{selectedPlan.api_calls.toLocaleString()} API calls</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-time-line text-orange-600"></i>
                      <span>Facturación {selectedPlan.interval === 'monthly' ? 'mensual' : 'anual'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">
                    €{selectedPlan.price}
                    <span className="text-lg font-normal text-gray-600">/{selectedPlan.interval === 'monthly' ? 'mes' : 'año'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTokens && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">💎 {selectedTokens.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <i className="ri-cpu-line text-purple-600"></i>
                      <span>{selectedTokens.tokens.toLocaleString()} tokens base</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-gift-line text-green-600"></i>
                      <span>+{selectedTokens.bonus_tokens} tokens bonus</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-purple-600">€{selectedTokens.price}</div>
                  <div className="text-sm text-gray-600">Pago único</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Métodos de pago */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="ri-secure-payment-line mr-3 text-green-600"></i>
            Métodos de pago disponibles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {paymentMethods
              .filter((method) => method.enabled)
              .map((method) => (
                <div
                  key={method.id}
                  onClick={() => {
                    if (method.id === 'sepa') {
                      handleSEPAMethodSelection();
                    } else {
                      setSelectedMethod(method.id);
                    }
                  }}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedMethod === method.id
                      ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                      <img
                        src={method.logo_url}
                        alt={method.name}
                        className="max-w-12 max-h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'flex';
                        }}
                      />
                      <div style={{ display: 'none' }} className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <i className="ri-bank-card-line text-blue-600"></i>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900 text-sm">{method.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{method.processing_time}</div>
                      {method.id === 'sepa' && existingSEPAMandates.length > 0 && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          ✅ Mandato activo
                        </div>
                      )}
                    </div>

                    <div className="text-xs">
                      <div className="text-gray-600">
                        {method.fees.percentage > 0 ? `${method.fees.percentage}%` : 'Sin comisión'}{' '}
                        {method.fees.fixed > 0 && ` + €${method.fees.fixed}`}
                      </div>
                    </div>

                    {selectedMethod === method.id && (
                      <div className="text-green-600 text-sm font-medium">
                        ✅ Seleccionado
                      </div>
                    )}

                    {method.id === 'sepa' && sepaMandateLoading && (
                      <div className="text-blue-600 text-xs">
                        <i className="ri-loader-4-line animate-spin mr-1"></i>
                        Verificando mandatos...
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {validationErrors.method && <p className="text-red-500 text-sm mb-4">{validationErrors.method}</p>}

          {/* Formulario de datos de facturación */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">📋 Datos de facturación</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={paymentData.email}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, email: e.target.value }))}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                />
                {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                <input
                  type="text"
                  value={paymentData.fullName}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, fullName: e.target.value }))}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Juan Pérez García"
                />
                {validationErrors.fullName && <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                <input
                  type="text"
                  value={paymentData.company}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, company: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mi Empresa SL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIF/CIF</label>
                <input
                  type="text"
                  value={paymentData.vatId}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, vatId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12345678Z"
                />
              </div>
            </div>

            {/* Formulario específico del método de pago */}
            {selectedMethod && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">💳 Datos de pago</h4>
                {renderPaymentForm()}
              </div>
            )}
          </div>

          {/* Resumen de costos */}
          {selectedMethod && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h5 className="font-medium text-gray-900 mb-4">💰 Resumen del pago</h5>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>{selectedPlan ? `Suscripción ${selectedPlan.name}` : `Paquete de ${selectedTokens?.tokens} tokens`}</span>
                  <span className="font-medium">€{(selectedPlan?.price || selectedTokens?.price || 0).toFixed(2)}</span>
                </div>
                {calculateFee() > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Comisión procesamiento ({paymentMethods.find((m) => m.id === selectedMethod)?.name})</span>
                    <span>€{calculateFee().toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3 font-semibold text-lg">
                  <div className="flex justify-between">
                    <span>Total a pagar</span>
                    <span className="text-green-600">€{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Términos y condiciones */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={paymentData.acceptTerms}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, acceptTerms: e.target.checked }))}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                Acepto los <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">términos y condiciones</a> de ConstructIA *
              </label>
            </div>
            {validationErrors.terms && <p className="text-red-500 text-xs ml-7">{validationErrors.terms}</p>}

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="privacy"
                checked={paymentData.acceptPrivacy}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, acceptPrivacy: e.target.checked }))}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
                Acepto la <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">política de privacidad</a> *
              </label>
            </div>
            {validationErrors.privacy && <p className="text-red-500 text-xs ml-7">{validationErrors.privacy}</p>}
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between">
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-gray-600 hover:text-gray-800 font-medium cursor-pointer whitespace-nowrap"
              >
                ← Volver atrás
              </button>
            )}

            <button
              onClick={processPayment}
              disabled={processing || !selectedMethod || (selectedMethod === 'sepa' && existingSEPAMandates.length === 0)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shadow-lg"
            >
              {processing ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-3"></i>
                  Procesando pago seguro...
                </>
              ) : (
                <>
                  <i className="ri-secure-payment-line mr-3"></i>
                  Pagar €{calculateTotal().toFixed(2)} de forma segura
                </>
              )}
            </button>
          </div>

          {/* Información de seguridad */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <i className="ri-shield-check-line mr-2 text-green-600"></i>
                <span>SSL 256-bit</span>
              </div>
              <div className="flex items-center">
                <i className="ri-lock-line mr-2 text-green-600"></i>
                <span>Datos encriptados</span>
              </div>
              <div className="flex items-center">
                <i className="ri-customer-service-line mr-2 text-blue-600"></i>
                <span>Soporte 24/7</span>
              </div>
              <div className="flex items-center">
                <i className="ri-refund-line mr-2 text-purple-600"></i>
                <span>Garantía de reembolso</span>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-400">
                Tus datos están protegidos y nunca compartimos tu información financiera. Cumplimos con PCI DSS y GDPR.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
