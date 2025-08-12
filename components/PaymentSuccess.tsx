'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface PaymentSuccessProps {
  paymentData: {
    success: boolean;
    transaction_id: string;
    amount: number;
    total_amount: number;
    fee_amount: number;
    currency: string;
    method: string;
    processed_at: string;
    receipt: any;
    client_access: {
      can_upload_documents: boolean;
      subscription_active: boolean;
      tokens_available: number;
    };
  };
  onContinue: () => void;
}

export default function PaymentSuccess({ paymentData, onContinue }: PaymentSuccessProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Simular envío de recibo por email
    const sendReceiptEmail = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setEmailSent(true);
      } catch (error) {
        console.error('Error enviando recibo por email:', error);
      }
    };

    sendReceiptEmail();
  }, []);

  const downloadReceipt = () => {
    const receiptContent = generateReceiptPDF();
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-${paymentData.transaction_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReceiptPDF = () => {
    const receipt = paymentData.receipt;
    return `
CONSTRUCTIA - RECIBO DE COMPRA
${'-'.repeat(50)}

Número de recibo: ${receipt.receipt_number}
Fecha: ${receipt.date}

DATOS DEL CLIENTE:
Nombre: ${receipt.client_info.name}
Email: ${receipt.client_info.email}
${receipt.client_info.company ? `Empresa: ${receipt.client_info.company}` : ''}
${receipt.client_info.vat_id ? `NIF/CIF: ${receipt.client_info.vat_id}` : ''}

DETALLES DE LA COMPRA:
${receipt.items.map((item: any) => `${item.description} x${item.quantity} = €${item.total.toFixed(2)}`).join('\n')}

RESUMEN:
Subtotal: €${receipt.subtotal.toFixed(2)}
${receipt.fees.description}: €${receipt.fees.payment_processing.toFixed(2)}
TOTAL: €${receipt.total.toFixed(2)}

Método de pago: ${receipt.payment_method}
Estado: ${receipt.status}

${receipt.notes}

Transacción procesada el: ${paymentData.processed_at}
ID de transacción: ${paymentData.transaction_id}

¡Gracias por elegir ConstructIA!
`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header de éxito */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-line text-4xl text-green-600"></i>
            </div>
            <h1 className="text-3xl font-bold mb-2">🎉 ¡Pago realizado con éxito!</h1>
            <p className="text-green-100 text-lg">Tu cuenta de ConstructIA está lista para usar</p>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            {/* Información del pago */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Resumen de tu compra</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Número de transacción:</span>
                  <p className="font-mono font-medium text-gray-900">{paymentData.transaction_id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Fecha y hora:</span>
                  <p className="font-medium text-gray-900">{new Date(paymentData.processed_at).toLocaleString('es-ES')}</p>
                </div>
                <div>
                  <span className="text-gray-600">Importe:</span>
                  <p className="font-medium text-gray-900">€{paymentData.amount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total pagado:</span>
                  <p className="font-bold text-green-600 text-lg">€{paymentData.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Método de pago:</span>
                  <p className="font-medium text-gray-900">{paymentData.method}</p>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    ✅ Completado
                  </span>
                </div>
              </div>
            </div>

            {/* Lo que obtiene el cliente */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">🚀 ¡Ya tienes acceso completo!</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <i className="ri-upload-cloud-line text-2xl text-green-600"></i>
                  </div>
                  <h4 className="font-bold text-gray-900">Subir documentos</h4>
                  <p className="text-sm text-gray-600 mt-1">Ya puedes subir y procesar documentos</p>
                </div>
                
                {paymentData.client_access.subscription_active && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <i className="ri-vip-crown-line text-2xl text-purple-600"></i>
                    </div>
                    <h4 className="font-bold text-gray-900">Suscripción activa</h4>
                    <p className="text-sm text-gray-600 mt-1">Acceso a todas las funciones premium</p>
                  </div>
                )}

                {paymentData.client_access.tokens_available > 0 && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <i className="ri-cpu-line text-2xl text-orange-600"></i>
                    </div>
                    <h4 className="font-bold text-gray-900">{paymentData.client_access.tokens_available} tokens</h4>
                    <p className="text-sm text-gray-600 mt-1">Disponibles para usar inmediatamente</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recibo */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">📧 Recibo de compra</h3>
                <div className="flex items-center space-x-2">
                  {emailSent ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <i className="ri-check-line mr-1"></i>
                      Enviado por email
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-500 text-sm">
                      <i className="ri-loader-4-line animate-spin mr-1"></i>
                      Enviando por email...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowReceipt(!showReceipt)}
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-eye-line mr-2"></i>
                  {showReceipt ? 'Ocultar recibo' : 'Ver recibo'}
                </button>
                <button
                  onClick={downloadReceipt}
                  className="text-green-600 hover:text-green-800 font-medium cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-download-line mr-2"></i>
                  Descargar recibo
                </button>
              </div>

              {showReceipt && (
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto">
                    {generateReceiptPDF()}
                  </pre>
                </div>
              )}
            </div>

            {/* Mensaje de bienvenida */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">🎊 ¡Bienvenido a ConstructIA!</h3>
                <p className="text-gray-700 mb-4">
                  Gracias por confiar en nosotros. Tu cuenta está completamente configurada y lista para usar. 
                  Ahora puedes acceder a tu panel de gestión para comenzar a subir documentos y aprovechar 
                  todas las funciones de inteligencia artificial para tu empresa constructora.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <i className="ri-lightbulb-line text-yellow-500"></i>
                  <span>¿Necesitas ayuda? Nuestro equipo de soporte está disponible 24/7</span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/dashboard" className="cursor-pointer">
                <button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-8 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg whitespace-nowrap">
                  <i className="ri-dashboard-line mr-2"></i>
                  Acceder a mi panel
                </button>
              </Link>
              
              <Link href="/" className="cursor-pointer">
                <button className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-all whitespace-nowrap">
                  <i className="ri-home-line mr-2"></i>
                  Volver al inicio
                </button>
              </Link>
            </div>

            {/* Información adicional */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div>
                  <i className="ri-shield-check-line text-2xl text-green-600 mb-2"></i>
                  <h4 className="font-medium text-gray-900">Datos seguros</h4>
                  <p>Información encriptada y protegida</p>
                </div>
                <div>
                  <i className="ri-customer-service-line text-2xl text-blue-600 mb-2"></i>
                  <h4 className="font-medium text-gray-900">Soporte 24/7</h4>
                  <p>Estamos aquí para ayudarte</p>
                </div>
                <div>
                  <i className="ri-refund-line text-2xl text-purple-600 mb-2"></i>
                  <h4 className="font-medium text-gray-900">Garantía</h4>
                  <p>30 días de garantía de reembolso</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-gray-400">
                  Este recibo no constituye una factura fiscal. Para solicitar una factura con validez fiscal, 
                  contacta con nuestro departamento de facturación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}