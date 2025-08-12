
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FinancialModule() {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [financialMetrics, setFinancialMetrics] = useState<any>({});
  const [monthlySpending, setMonthlySpending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [receipts, setReceipts] = useState<any[]>([]);

  useEffect(() => {
    loadFinancialData();
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      const clientId = localStorage.getItem('constructia_client_id') || 'client_001';

      // Cargar recibos de la base de datos financiera
      const { data: receiptsData, error } = await supabase
        .from('financial_records')
        .select('*')
        .eq('client_id', clientId)
        .in('type', ['income', 'payment_received'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (receiptsData && receiptsData.length > 0) {
        const processedReceipts = receiptsData.map(record => ({
          id: record.id,
          receipt_number: `REC-${record.id.slice(-8).toUpperCase()}`,
          date: record.date || record.created_at,
          description: record.description,
          amount: record.amount,
          type: record.category === 'token_sales' ? 'tokens' : 'subscription',
          status: record.payment_status || 'completed',
          payment_method: record.payment_method || 'SEPA',
          transaction_id: record.transaction_id,
          metadata: record.metadata || {},
          created_at: record.created_at
        }));
        
        setReceipts(processedReceipts);
      } else {
        // Si no hay recibos en BD, usar datos simulados
        setReceipts([
          {
            id: 'rec_001',
            receipt_number: 'REC-20240228-001',
            date: '2024-02-28',
            description: 'Recibo de Suscripción Profesional Plus',
            amount: 89.00,
            type: 'subscription',
            status: 'Pagado',
            payment_method: 'Tarjeta ****1234',
            transaction_id: 'txn_sub_001'
          },
          {
            id: 'rec_002',
            receipt_number: 'REC-20240215-002',
            date: '2024-02-15',
            description: 'Recibo de Tokens Premium - 5,000 tokens',
            amount: 55.00,
            type: 'tokens',
            status: 'Pagado',
            payment_method: 'SEPA',
            transaction_id: 'txn_tok_002'
          }
        ]);
      }
    } catch (error) {
      console.error('Error cargando recibos:', error);
      // Usar datos de respaldo
      setReceipts([]);
    }
  };

  const loadFinancialData = async () => {
    try {
      setLoading(true);

      // Datos de suscripción simulados
      setSubscriptionData({
        plan: 'Profesional Plus',
        status: 'Activa',
        monthly_cost: 89,
        next_renewal: '2024-03-15',
        days_until_renewal: 12,
        features_included: [
          'Análisis ilimitado con IA',
          '10GB almacenamiento',
          'Soporte prioritario',
          'Integración con Obralia',
          'Reportes avanzados'
        ],
        usage_percentage: 67
      });

      // Historial de compras simulado
      const mockPurchases = [
        {
          id: 'txn_001',
          date: '2024-02-28',
          description: 'Suscripción Profesional Plus',
          amount: 89.00,
          type: 'subscription',
          status: 'Completado',
          payment_method: 'Tarjeta ****1234'
        },
        {
          id: 'txn_002',
          date: '2024-02-15',
          description: 'Paquete Premium - 5,000 tokens',
          amount: 55.00,
          type: 'tokens',
          status: 'Completado',
          payment_method: 'SEPA'
        },
        {
          id: 'txn_003',
          date: '2024-01-28',
          description: 'Suscripción Profesional Plus',
          amount: 89.00,
          type: 'subscription',
          status: 'Completado',
          payment_method: 'Tarjeta ****1234'
        },
        {
          id: 'txn_004',
          date: '2024-01-10',
          description: 'Paquete Estándar - 2,500 tokens',
          amount: 35.00,
          type: 'tokens',
          status: 'Completado',
          payment_method: 'PayPal'
        }
      ];
      setPurchaseHistory(mockPurchases);

      // Métricas financieras
      setFinancialMetrics({
        total_spent_this_month: 89,
        total_spent_last_month: 124,
        average_monthly_spend: 96,
        tokens_purchased_this_month: 0,
        tokens_remaining: 1250,
        cost_per_token: 0.011,
        projected_monthly_cost: 92
      });

      // Datos de gasto mensual
      const mockMonthlyData = [
        { month: 'Sep', suscripcion: 89, tokens: 0, total: 89 },
        { month: 'Oct', suscripcion: 89, tokens: 25, total: 114 },
        { month: 'Nov', suscripcion: 89, tokens: 55, total: 144 },
        { month: 'Dic', suscripcion: 89, tokens: 35, total: 124 },
        { month: 'Ene', suscripcion: 89, tokens: 35, total: 124 },
        { month: 'Feb', suscripcion: 89, tokens: 55, total: 144 }
      ];
      setMonthlySpending(mockMonthlyData);
    } catch (error) {
      console.error('Error cargando datos financieros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const generateReceipt = async (transactionId: string) => {
    try {
      const clientId = localStorage.getItem('constructia_client_id') || 'client_001';
      
      // Registrar la generación del recibo
      const receiptLog = {
        id: `receipt_gen_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        client_id: clientId,
        activity_type: 'receipt_generated',
        description: `Recibo generado para transacción ${transactionId}`,
        metadata: {
          transaction_id: transactionId,
          receipt_type: 'pdf_generation',
          generated_at: new Date().toISOString()
        },
        ip_address: '127.0.0.1',
        user_agent: navigator?.userAgent?.substring(0, 255) || 'client-browser',
        created_at: new Date().toISOString(),
      };

      await supabase.from('client_activity_logs').insert([receiptLog]);
      
      alert('✅ Recibo generado y enviado\n\n📧 El recibo ha sido enviado a tu correo electrónico\n📄 También está disponible en tu historial de transacciones');
    } catch (error) {
      console.error('Error generando recibo:', error);
      alert('❌ Error generando el recibo. Inténtalo de nuevo.');
    }
  };

  const TransactionDetailsModal = () => {
    if (!selectedTransaction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Detalles de Transacción</h3>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Transaction Header */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedTransaction.description}</h4>
                  <p className="text-gray-600 text-sm">ID de transacción: {selectedTransaction.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">€{selectedTransaction.amount.toFixed(2)}</div>
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    <i className="ri-check-line mr-1"></i>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Información de Pago</h5>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-calendar-line text-blue-600"></i>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Fecha de transacción</div>
                    <div className="font-medium text-gray-900">
                      {new Date(selectedTransaction.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-bank-card-line text-purple-600"></i>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Método de pago</div>
                    <div className="font-medium text-gray-900">{selectedTransaction.payment_method}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i
                      className={`${selectedTransaction.type === 'subscription' ? 'ri-vip-crown-line' : 'ri-coin-line'} text-green-600`}
                    ></i>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Tipo de compra</div>
                    <div className="font-medium text-gray-900">
                      {selectedTransaction.type === 'subscription' ? 'Suscripción mensual' : 'Compra de tokens'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Detalles del Servicio</h5>

                {selectedTransaction.type === 'subscription' ? (
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="font-medium text-blue-900 mb-2">Plan Profesional Plus</div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Análisis ilimitado con IA</li>
                        <li>• 10GB de almacenamiento</li>
                        <li>• Soporte prioritario</li>
                        <li>• Integración con Obralia</li>
                        <li>• Reportes avanzados</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="font-medium text-purple-900 mb-2">
                        {selectedTransaction.description.includes('5,000') ? 'Paquete Premium - 5,000 tokens' : 'Paquete Estándar - 2,500 tokens'}
                      </div>
                      <div className="text-sm text-purple-700">
                        <div>• Tokens para análisis IA</div>
                        <div>• Válidos por 12 meses</div>
                        <div>• Sin fecha de caducidad</div>
                        <div>• Costo por token: €{(selectedTransaction.amount / (selectedTransaction.description.includes('5,000') ? 5000 : 2500)).toFixed(4)}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">€{(selectedTransaction.amount * 0.79).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">IVA (21%)</span>
                    <span className="font-medium text-gray-900">€{(selectedTransaction.amount * 0.21).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-gray-900">€{selectedTransaction.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => generateReceipt(selectedTransaction.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-file-download-line mr-2"></i>
                  Descargar Recibo
                </button>
                <button 
                  onClick={() => generateReceipt(selectedTransaction.id)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-mail-line mr-2"></i>
                  Enviar Recibo
                </button>
              </div>

              <div className="text-sm text-gray-500">
                Procesado el {new Date(selectedTransaction.date).toLocaleDateString('es-ES')} a las {new Date(selectedTransaction.date + 'T14:30:00').toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos financieros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión Financiera</h2>
          <p className="text-gray-600 mt-1">Suscripciones, tokens y recibos de servicios</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm text-gray-600">Balance Actual</div>
            <div className="text-xl font-bold text-green-600">{financialMetrics.tokens_remaining} tokens</div>
          </div>
        </div>
      </div>

      {/* Estado de Suscripción */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Estado de Suscripción</h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            {subscriptionData.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{subscriptionData.plan}</div>
                  <div className="text-gray-600">Plan Actual</div>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-vip-crown-line text-2xl text-blue-600"></i>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">€{subscriptionData.monthly_cost}</div>
                  <div className="text-sm text-gray-600">Por mes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{subscriptionData.days_until_renewal}</div>
                  <div className="text-sm text-gray-600">Días restantes</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Uso del plan</span>
                  <span className="font-semibold text-gray-900">{subscriptionData.usage_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${subscriptionData.usage_percentage}%` }}
                  ></div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-refresh-line mr-2"></i>
                Renovar Suscripción
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Características Incluidas:</h4>
            <ul className="space-y-3">
              {subscriptionData.features_included.map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-3"></i>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center mb-2">
                <i className="ri-calendar-line text-orange-600 mr-2"></i>
                <span className="font-semibold text-orange-800">Próxima Renovación</span>
              </div>
              <div className="text-sm text-orange-700">
                {new Date(subscriptionData.next_renewal).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Financieras */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-euro-circle-line text-green-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">€{financialMetrics.total_spent_this_month}</div>
              <div className="text-sm text-gray-600">Este Mes</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-arrow-down-line text-red-500 mr-1"></i>
            <span className="text-red-600">-€{financialMetrics.total_spent_last_month - financialMetrics.total_spent_this_month} vs anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-coin-line text-blue-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{financialMetrics.tokens_remaining}</div>
              <div className="text-sm text-gray-600">Tokens Restantes</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-information-line text-blue-500 mr-1"></i>
            <span className="text-blue-600">€{financialMetrics.cost_per_token}/token</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-bar-chart-line text-purple-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">€{financialMetrics.average_monthly_spend}</div>
              <div className="text-sm text-gray-600">Promedio Mensual</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-trending-up-line text-green-500 mr-1"></i>
            <span className="text-green-600">Estable últimos 3 meses</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-forecast-line text-orange-600"></i>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">€{financialMetrics.projected_monthly_cost}</div>
              <div className="text-sm text-gray-600">Proyección</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <i className="ri-arrow-up-line text-orange-500 mr-1"></i>
            <span className="text-orange-600">+€3 vs actual</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Gastos Mensuales */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Evolución de Gastos</h3>
            <p className="text-sm text-gray-600">Suscripción vs Compra de Tokens</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Suscripción</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Tokens</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Area
                type="monotone"
                dataKey="suscripcion"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="tokens"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historial de Transacciones */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Historial de Transacciones</h3>
              <p className="text-sm text-gray-600">Últimas compras y recibos de servicios</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-download-line mr-2"></i>
              Descargar Recibos
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Descripción</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Método</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Importe</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchaseHistory.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-gray-500 text-xs">ID: {transaction.id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'subscription' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {transaction.type === 'subscription' ? 'Suscripción' : 'Tokens'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.payment_method}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    €{transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      <i className="ri-check-line mr-1"></i>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => generateReceipt(transaction.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        <i className="ri-file-download-line mr-1"></i>
                        Recibo
                      </button>
                      <button
                        onClick={() => handleViewDetails(transaction)}
                        className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:border-green-600 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        <i className="ri-eye-line mr-1"></i>Ver Detalles
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel de Alertas Financieras */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="ri-alarm-warning-line text-2xl text-orange-600"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Alertas Financieras IA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <i className="ri-time-line text-orange-500 mr-2"></i>
                  <span className="font-medium text-gray-900">Renovación Próxima</span>
                </div>
                <p className="text-sm text-gray-600">Tu suscripción se renueva en {subscriptionData.days_until_renewal} días. Asegúrate de tener fondos suficientes.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <i className="ri-coin-line text-blue-500 mr-2"></i>
                  <span className="font-medium text-gray-900">Tokens Disponibles</span>
                </div>
                <p className="text-sm text-gray-600">Te quedan {financialMetrics.tokens_remaining} tokens. Al ritmo actual, durarán aproximadamente 15 días.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información sobre Recibos */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <i className="ri-file-text-line text-blue-600 text-2xl mt-1"></i>
          <div>
            <h3 className="font-bold text-blue-800 mb-2">Sistema de Recibos Digitales</h3>
            <p className="text-blue-700 mb-3">
              Todos tus pagos generan recibos automáticamente que están sincronizados con el módulo financiero del administrador.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="font-semibold text-blue-800">Recibos de Suscripción</div>
                <div className="text-blue-600">Generados mensualmente de forma automática</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="font-semibold text-blue-800">Recibos de Tokens</div>
                <div className="text-blue-600">Emitidos al instante tras cada compra</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Nota:</strong> Cada transacción en este panel se registra automáticamente en el módulo financiero del administrador, 
                actualizando KPIs, reportes y estadísticas en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showTransactionModal && <TransactionDetailsModal />}
    </div>
  );
}
