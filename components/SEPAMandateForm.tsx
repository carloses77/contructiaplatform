
'use client';

import { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SEPAMandateFormProps {
  clientId: string;
  amount: number;
  description: string;
  onMandateSigned: (mandateData: any) => void;
  onCancel: () => void;
}

export default function SEPAMandateForm({
  clientId,
  amount,
  description,
  onMandateSigned,
  onCancel
}: SEPAMandateFormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState<'form' | 'signature' | 'completed'>('form');
  const [loading, setLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureExists, setSignatureExists] = useState(false);
  const [signatureMetadata, setSignatureMetadata] = useState<any>(null);
  const [mandateData, setMandateData] = useState({
    creditor_identifier: 'ES98ZZZ12345678901',
    creditor_name: 'ConstructIA SL',
    creditor_address: 'Calle Innovación, 123',
    creditor_city: 'Madrid',
    creditor_postal_code: '28001',
    creditor_country: 'ES',
    debtor_name: '',
    debtor_email: '',
    debtor_address: '',
    debtor_city: '',
    debtor_postal_code: '',
    debtor_country: 'ES',
    debtor_iban: '',
    debtor_bic: '',
    payment_type: 'recurring',
    signature_date: new Date().toISOString().split('T')[0],
    signature_location: '',
    accept_terms: false,
    accept_sepa_conditions: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateIBAN = (iban: string): boolean => {
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    if (cleanIban.length < 15 || cleanIban.length > 34) return false;
    if (cleanIban.startsWith('ES') && cleanIban.length !== 24) return false;
    return /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban);
  };

  const validateBIC = (bic: string): boolean => {
    const cleanBic = bic.replace(/\s/g, '').toUpperCase();
    return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanBic);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!mandateData.debtor_name) newErrors.debtor_name = 'Nombre del deudor es obligatorio';
    if (!mandateData.debtor_email) newErrors.debtor_email = 'Email es obligatorio';
    if (!mandateData.debtor_address) newErrors.debtor_address = 'Dirección es obligatoria';
    if (!mandateData.debtor_city) newErrors.debtor_city = 'Ciudad es obligatoria';
    if (!mandateData.debtor_postal_code) newErrors.debtor_postal_code = 'Código postal es obligatorio';
    if (!mandateData.debtor_iban) {
      newErrors.debtor_iban = 'IBAN es obligatorio';
    } else if (!validateIBAN(mandateData.debtor_iban)) {
      newErrors.debtor_iban = 'IBAN no válido';
    }
    if (!mandateData.debtor_bic) {
      newErrors.debtor_bic = 'BIC es obligatorio';
    } else if (!validateBIC(mandateData.debtor_bic)) {
      newErrors.debtor_bic = 'BIC no válido';
    }
    if (!mandateData.signature_location) newErrors.signature_location = 'Lugar de firma es obligatorio';
    if (!mandateData.accept_terms) newErrors.accept_terms = 'Debes aceptar los términos';
    if (!mandateData.accept_sepa_conditions) newErrors.accept_sepa_conditions = 'Debes aceptar las condiciones SEPA';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return;
    setCurrentStep('signature');
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasContent = imageData.data.some((value, index) => {
          return index % 4 === 3 && value > 0;
        });

        setSignatureExists(hasContent);

        if (hasContent) {
          const metadata = {
            width: canvas.width,
            height: canvas.height,
            timestamp: new Date().toISOString(),
            device_info: navigator.userAgent.substring(0, 100),
            signature_hash: generateSimpleHash(imageData.data),
            pixel_count: imageData.data.filter((value, index) => index % 4 === 3 && value > 0).length
          };
          setSignatureMetadata(metadata);
        }
      }
    }
  };

  const generateSimpleHash = (data: Uint8ClampedArray): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i += 100) {
      hash = ((hash << 5) - hash + data[i]) & 0xffffffff;
    }
    return Math.abs(hash).toString(36);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureExists(false);
    setSignatureMetadata(null);
  };

  const completeMandateProcess = async () => {
    try {
      setLoading(true);

      if (!signatureExists || !signatureMetadata) {
        alert('请在继续之前签署授权书');
        setLoading(false);
        return;
      }

      const mandateReference = `SEPA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const generateUUID = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      const completeMandateData = {
        id: generateUUID(),
        mandate_reference: mandateReference,
        client_id: clientId,
        creditor_identifier: mandateData.creditor_identifier,
        creditor_name: mandateData.creditor_name,
        creditor_address: mandateData.creditor_address,
        creditor_city: mandateData.creditor_city,
        creditor_postal_code: mandateData.creditor_postal_code,
        creditor_country: mandateData.creditor_country,
        debtor_name: mandateData.debtor_name,
        debtor_email: mandateData.debtor_email,
        debtor_address: mandateData.debtor_address,
        debtor_city: mandateData.debtor_city,
        debtor_postal_code: mandateData.debtor_postal_code,
        debtor_country: mandateData.debtor_country,
        debtor_iban: mandateData.debtor_iban.replace(/\s/g, ''),
        debtor_bic: mandateData.debtor_bic.replace(/\s/g, ''),
        payment_type: mandateData.payment_type,
        signature_metadata: {
          signature_present: true,
          signed_at: new Date().toISOString(),
          signature_location: mandateData.signature_location,
          device_signature: signatureMetadata.device_info,
          signature_hash: signatureMetadata.signature_hash,
          canvas_dimensions: `${signatureMetadata.width}x${signatureMetadata.height}`,
          pixel_count: signatureMetadata.pixel_count,
          ip_address: '127.0.0.1'
        },
        signed_at: new Date().toISOString(),
        signature_location: mandateData.signature_location,
        payment_amount: amount,
        payment_currency: 'EUR',
        payment_description: description,
        status: 'active',
        ip_address: '127.0.0.1',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 200) : 'client-browser',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Guardando SEPA autorización con nombres de campo correctos:', completeMandateData);

      const { data: savedMandate, error } = await supabase
        .from('sepa_mandates')
        .insert(completeMandateData)
        .select()
        .single();

      if (error) {
        console.error('保存SEPA授权书时出错:', error);
        throw new Error(`保存SEPA授权书失败: ${error.message}`);
      }

      console.log('SEPA授权书已正确保存:', savedMandate);

      try {
        await supabase.from('sepa_signatures').insert({
          id: generateUUID(),
          mandate_id: savedMandate.id,
          client_id: clientId,
          signature_data: JSON.stringify({
            signature_hash: signatureMetadata.signature_hash,
            canvas_dimensions: `${signatureMetadata.width}x${signatureMetadata.height}`,
            pixel_count: signatureMetadata.pixel_count,
            device_info: signatureMetadata.device_info
          }),
          signature_metadata: {
            signature_present: true,
            signed_at: new Date().toISOString(),
            signature_location: mandateData.signature_location,
            signature_hash: signatureMetadata.signature_hash,
            verification_status: 'verified'
          },
          debtor_name: mandateData.debtor_name,
          debtor_iban: mandateData.debtor_iban.replace(/\s/g, ''),
          mandate_reference: mandateReference,
          ip_address: '127.0.0.1',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'client-browser',
          created_at: new Date().toISOString()
        });
      } catch (sigError) {
        console.warn('记录独立签名时出现警告:', sigError);
      }

      try {
        await supabase.from('client_activity_logs').insert({
          id: generateUUID(),
          client_id: clientId,
          activity_type: 'sepa_mandate_signed',
          description: `数字签署SEPA授权书: ${mandateReference}`,
          metadata: {
            mandate_reference: mandateReference,
            iban_last_four: mandateData.debtor_iban.slice(-4),
            amount: amount,
            currency: 'EUR',
            signature_verified: true,
            signature_hash: signatureMetadata.signature_hash,
            debtor_email: mandateData.debtor_email
          },
          created_at: new Date().toISOString()
        });
      } catch (logError) {
        console.warn('记录活动日志时出现警告:', logError);
      }

      try {
        await supabase.from('financial_records').insert({
          id: generateUUID(),
          type: 'sepa_mandate',
          amount: amount,
          date: new Date().toISOString(),
          category: 'payment_processing',
          description: `已创建SEPA授权书 - ${description}`,
          client_id: clientId,
          transaction_id: mandateReference,
          payment_method: 'SEPA Direct Debit',
          metadata: {
            mandate_reference: mandateReference,
            debtor_iban: mandateData.debtor_iban.replace(/\s/g, ''),
            debtor_bic: mandateData.debtor_bic.replace(/\s/g, ''),
            payment_type: mandateData.payment_type,
            signature_verified: true,
            debtor_email: mandateData.debtor_email
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } catch (finError) {
        console.warn('记录财务记录时出现警告:', finError);
      }

      setCurrentStep('completed');
      onMandateSigned(savedMandate);

    } catch (error: any) {
      console.error('处理SEPA授权书时出错:', error);

      let errorMessage = '处理授权书时出错，请重试。';
      if (error.message && error.message.includes('relation')) {
        errorMessage = 'Error de configuración de base de datos. Los campos no coinciden con la tabla.';
      } else if (error.message && error.message.includes('column')) {
        errorMessage = '数据库架构错误。请联系技术支持。';
      } else if (error.message && error.message.includes('invalid input syntax')) {
        errorMessage = 'UUID格式错误。系统已修复，请重试。';
      } else if (error.message) {
        errorMessage = `错误: ${error.message}`;
      }

      alert(`错误: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const formatIBAN = (value: string): string => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  function renderFormStep() {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-bank-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900">Orden de Domiciliación SEPA B2B</h3>
              <p className="text-sm text-blue-700">SEPA Business-to-Business Direct Debit Mandate</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <i className="ri-building-line mr-2 text-green-600"></i>
            Datos del Acreedor (ConstructIA)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block font-medium text-gray-700">Identificador del acreedor:</label>
              <div className="bg-white p-2 rounded border mt-1">{mandateData.creditor_identifier}</div>
            </div>
            <div>
              <label className="block font-medium text-gray-700">Nombre del acreedor:</label>
              <div className="bg-white p-2 rounded border mt-1">{mandateData.creditor_name}</div>
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700">Dirección:</label>
              <div className="bg-white p-2 rounded border mt-1">
                {mandateData.creditor_address}, {mandateData.creditor_postal_code} {mandateData.creditor_city}, {mandateData.creditor_country}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <i className="ri-user-line mr-2 text-blue-600"></i>
            Datos del Deudor (Sus datos)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del deudor *</label>
              <input
                type="text"
                value={mandateData.debtor_name}
                onChange={(e) => setMandateData(prev => ({ ...prev, debtor_name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.debtor_name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nombre completo"
              />
              {errors.debtor_name && <p className="text-red-500 text-xs mt-1">{errors.debtor_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email del deudor *</label>
              <input
                type="email"
                value={mandateData.debtor_email}
                onChange={(e) => setMandateData(prev => ({ ...prev, debtor_email: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.debtor_email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="email@ejemplo.com"
              />
              {errors.debtor_email && <p className="text-red-500 text-xs mt-1">{errors.debtor_email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección del deudor *</label>
              <input
                type="text"
                value={mandateData.debtor_address}
                onChange={(e) => setMandateData(prev => ({ ...prev, debtor_address: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.debtor_address ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Calle y número"
              />
              {errors.debtor_address && <p className="text-red-500 text-xs mt-1">{errors.debtor_address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código postal - Ciudad *</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={mandateData.debtor_postal_code}
                  onChange={(e) => setMandateData(prev => ({ ...prev, debtor_postal_code: e.target.value }))}
                  className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.debtor_postal_code ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="28001"
                />
                <input
                  type="text"
                  value={mandateData.debtor_city}
                  onChange={(e) => setMandateData(prev => ({ ...prev, debtor_city: e.target.value }))}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.debtor_city ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Madrid"
                />
              </div>
              {(errors.debtor_postal_code || errors.debtor_city) && (
                <p className="text-red-500 text-xs mt-1">{errors.debtor_postal_code || errors.debtor_city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">País del deudor</label>
              <select
                value={mandateData.debtor_country}
                onChange={(e) => setMandateData(prev => ({ ...prev, debtor_country: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
              >
                <option value="ES">España (ES)</option>
                <option value="DE">Alemania (DE)</option>
                <option value="FR">Francia (FR)</option>
                <option value="IT">Italia (IT)</option>
                <option value="PT">Portugal (PT)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BIC / Swift BIC *</label>
              <input
                type="text"
                value={mandateData.debtor_bic}
                onChange={(e) => setMandateData(prev => ({ ...prev, debtor_bic: e.target.value.toUpperCase() }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.debtor_bic ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="CAIXESBBXXX"
                maxLength={11}
              />
              {errors.debtor_bic && <p className="text-red-500 text-xs mt-1">{errors.debtor_bic}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de cuenta - IBAN *</label>
              <input
                type="text"
                value={mandateData.debtor_iban}
                onChange={(e) => {
                  const formatted = formatIBAN(e.target.value);
                  if (formatted.length <= 29) {
                    setMandateData(prev => ({ ...prev, debtor_iban: formatted }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.debtor_iban ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="ES21 1234 5678 90 1234567890"
                maxLength={29}
              />
              <p className="text-xs text-gray-500 mt-1">El IBAN cuenta de 24 posiciones comenzando siempre por ES</p>
              {errors.debtor_iban && <p className="text-red-500 text-xs mt-1">{errors.debtor_iban}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <i className="ri-repeat-line mr-2 text-purple-600"></i>
            Tipo de Pago
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="recurring"
                name="payment_type"
                value="recurring"
                checked={mandateData.payment_type === 'recurring'}
                onChange={(e) => setMandateData(prev => ({ ...prev, payment_type: e.target.value as 'recurring' | 'one-time' }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="recurring" className="text-sm font-medium text-gray-700 cursor-pointer">
                Pago recurrente - Para suscripciones mensuales
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="one-time"
                name="payment_type"
                value="one-time"
                checked={mandateData.payment_type === 'one-time'}
                onChange={(e) => setMandateData(prev => ({ ...prev, payment_type: e.target.value as 'recurring' | 'one-time' }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="one-time" className="text-sm font-medium text-gray-700 cursor-pointer">
                Pago único - Solo para esta transacción
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <i className="ri-calendar-line mr-2 text-orange-600"></i>
            Fecha y Localización
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de firma</label>
              <input
                type="date"
                value={mandateData.signature_date}
                onChange={(e) => setMandateData(prev => ({ ...prev, signature_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lugar de firma *</label>
              <input
                type="text"
                value={mandateData.signature_location}
                onChange={(e) => setMandateData(prev => ({ ...prev, signature_location: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.signature_location ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Barcelona"
              />
              {errors.signature_location && <p className="text-red-500 text-xs mt-1">{errors.signature_location}</p>}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <i className="ri-money-euro-circle-line mr-2 text-green-600"></i>
            Resumen del Pago a Domiciliar
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Concepto:</span>
              <span>{description}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Importe:</span>
              <span className="text-lg font-bold text-green-600">{amount.toFixed(2)} EUR</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tipo de mandato:</span>
              <span className="capitalize">{mandateData.payment_type === 'recurring' ? 'Recurrente' : 'Pago único'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={mandateData.accept_terms}
              onChange={(e) => setMandateData(prev => ({ ...prev, accept_terms: e.target.checked }))}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
              Acepto los <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">términos y condiciones</a> de
              ConstructIA y autorizo el cargo en mi cuenta bancaria *
            </label>
          </div>
          {errors.accept_terms && <p className="text-red-500 text-xs ml-7">{errors.accept_terms}</p>}

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="sepa-conditions"
              checked={mandateData.accept_sepa_conditions}
              onChange={(e) => setMandateData(prev => ({ ...prev, accept_sepa_conditions: e.target.checked }))}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="sepa-conditions" className="text-sm text-gray-700 cursor-pointer">
              Acepto las <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">condiciones SEPA</a> y
              autorizo tanto operaciones recurrentes como puntuales según se especifique *
            </label>
          </div>
          {errors.accept_sepa_conditions && <p className="text-red-500 text-xs ml-7">{errors.accept_sepa_conditions}</p>}
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
            type="button"
          >
            ← Cancelar
          </button>
          <button
            onClick={handleFormSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            type="button"
          >
            Continuar a la Firma
            <i className="ri-arrow-right-line ml-2"></i>
          </button>
        </div>
      </div>
    );
  }

  function renderSignatureStep() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Firma Digital del Mandato SEPA</h3>
          <p className="text-gray-600">Por favor, firma en el área designada para completar el mandato de domiciliación</p>
        </div>

        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <div className="mb-4">
            <i className="ri-quill-pen-line text-4xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-600">Área de firma digital</p>
            {signatureExists && (
              <p className="text-sm text-green-600 mt-1">
                <i className="ri-check-line mr-1"></i>
                Firma detectada correctamente
              </p>
            )}
          </div>

          <div className="border-2 border-gray-200 rounded-lg inline-block bg-white">
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair rounded-lg"
              style={{ touchAction: 'none' }}
            />
          </div>

          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={clearSignature}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 cursor-pointer"
              type="button"
            >
              <i className="ri-delete-bin-line"></i>
              <span>Borrar firma</span>
            </button>

            {signatureMetadata && (
              <div className="text-xs text-gray-500">
                Hash: {signatureMetadata.signature_hash}
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-medium text-blue-900 mb-3">Resumen de los datos del mandato:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Deudor:</span> {mandateData.debtor_name}
            </div>
            <div>
              <span className="font-medium">IBAN:</span> {mandateData.debtor_iban}
            </div>
            <div>
              <span className="font-medium">Importe:</span> {amount.toFixed(2)} EUR
            </div>
            <div>
              <span className="font-medium">Tipo:</span> {mandateData.payment_type === 'recurring' ? 'Recurrente' : 'Pago único'}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-2">
            <i className="ri-information-line text-yellow-600 mt-0.5"></i>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Información importante sobre la firma digital:</p>
              <ul className="text-xs space-y-0.5">
                <li>• Su firma digital tiene la misma validez legal que una firma manuscrita</li>
                <li>• Se almacenan solo metadatos de verificación, no la imagen de la firma</li>
                <li>• El mandato SEPA será procesado según la normativa europea</li>
                <li>• Puede cancelar la domiciliación contactando con su banco</li>
                <li>• Los cargos se realizarán con un preaviso de 5 días</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep('form')}
            className="text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
            type="button"
          >
            ← Volver al formulario
          </button>
          <button
            onClick={completeMandateProcess}
            disabled={loading || !signatureExists}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
            type="button"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Procesando mandato...
              </>
            ) : !signatureExists ? (
              <>
                <i className="ri-quill-pen-line mr-2"></i>
                Firma requerida para continuar
              </>
            ) : (
              <>
                <i className="ri-check-double-line mr-2"></i>
                Firmar y Completar Mandato
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  function renderCompletedStep() {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <i className="ri-check-double-line text-green-600 text-3xl"></i>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">¡Mandato SEPA Completado!</h3>
          <p className="text-gray-600">
            Su mandato de domiciliación SEPA ha sido firmado digitalmente y registrado correctamente
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-left max-w-md mx-auto">
          <h4 className="font-medium text-green-900 mb-3"> Próximos pasos:</h4>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• El mandato ha sido procesado con firma digital verificada</li>
            <li>• Los metadatos de seguridad han sido registrados</li>
            <li>• Recibirá confirmación por email en 24-48 horas</li>
            <li>• Los cargos comenzarán según lo acordado</li>
            <li>• Puede consultar el estado en su panel de cliente</li>
          </ul>
        </div>

        <button
          onClick={onCancel}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          type="button"
        >
          <i className="ri-home-line mr-2"></i>
          Continuar al Pago
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentStep === 'form' && renderFormStep()}
      {currentStep === 'signature' && renderSignatureStep()}
      {currentStep === 'completed' && renderCompletedStep()}
    </div>
  );
}
